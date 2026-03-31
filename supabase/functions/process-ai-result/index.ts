import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ai_status 순서 정의
const FAILED_SEQUENCE = ['PROCESSING', 'FAILED', 'FAILED_1', 'FAILED_2', 'FAILED_3'] as const
const RETRY_DELAY_MS = 10000

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 현재 status에서 다음 실패 status 반환
function nextFailedStatus(current: string): string {
  const idx = FAILED_SEQUENCE.indexOf(current as any)
  if (idx === -1 || idx >= FAILED_SEQUENCE.length - 1) return 'REFUND'
  return FAILED_SEQUENCE[idx + 1]
}

// Gemini API 호출 (AI 분석)
async function callAnalysis(flightDetails: any, geminiApiKey: string): Promise<{ analysis_kr: string; analysis_en: string } | null> {
  try {
    const POLICY_REFERENCE = `
[글로벌 항공 보상 규정 핵심 요약 - 반드시 이 내용을 근거로 분석할 것]

■ 몬트리올 협약 1999 (Montreal Convention)
- 적용 조건: 출발지·도착지·항공사 국적이 모두 협약 가입국(130개국+)인 국제선
- 제19조: 항공사 귀책 지연 시 손해배상 책임 / 제20조: 항공사가 모든 합리적 조치를 취했음을 입증해야 면책
- 보상 방식: 고정금액 없음. 실제 발생·증빙 가능한 손해(숙박비, 식비, 대체 교통비, 소득 손실 등)만 청구 가능
- 책임 한도: 1인당 6,303 SDR (2024년 12월 28일 개정 적용, 약 8,400 USD / 약 1,150만 원)
  ※ 구버전 5,346 SDR은 2024년 12월 28일 이전 항공편에만 적용
- 청구 시효: 항공편 출발일로부터 2년 이내
- 증빙 필수: 영수증, 예약확인서 등 실제 손해 서류 없이는 청구 불가

■ EU261 (유럽연합 / 이스탄불 포함 터키 제외)
- 적용 조건: EU 출발 전 항공편(항공사 무관) OR EU 도착편 중 EU 국적 항공사
- 고정 보상금 (도착지 기준 3시간+ 지연 또는 취소):
  · 1,500km 이하: €250
  · 1,500~3,500km: €400
  · 3,500km 초과: €600
- 취소 통보 시점별 면책: 14일+ 전 통보 → 보상금 없음(환불만) / 7~14일 전 → 조건부 면책 / 7일 미만 → 거의 면책 불가
- 비정상 상황 면책: ATC 파업, 테러, 화산재, 극단적 기상. 기체 결함·승무원 결근은 면책 안 됨
- 돌봄의 권리: 취소·지연 원인 무관하게 2~4시간+ 대기 시 식사제공, 익일 연장 시 호텔·교통 제공 의무

■ UK261 (영국) - EU261과 동일 구조, 금액만 파운드(£220/£350/£520)

■ 캐나다 APPR
- 적용: 캐나다 출도착 모든 항공편
- 대형 항공사(연 200만+ 승객): 3~6h 지연 $400 CAD / 6~9h $700 CAD / 9h+ $1,000 CAD
- 소형 항공사: $125 / $250 / $500 CAD

■ 미국 US DOT
- 고정 보상금 없음(오버부킹 제외). 국내선 3h+, 국제선 6h+ 지연·취소 시 전액 환불 의무

■ 대한민국 소비자분쟁해결기준 (강제력 없는 권고 기준)
- 국제선: 2~4h 운임 10% / 4~12h 20% / 12h+ 30% 보상 권고
- 취소(대체편 미제공): 운임 환급 + 최대 $600 USD 보상 권고
- 주의: 항공사가 약관 핑계로 거절 가능, 강제력 없음

■ 호주 ACL (소비자보증 원칙)
- 고정 보상금 없음. 항공사 귀책 시 환불 또는 실비 청구 가능, 기준 주관적

■ 공통 원칙
- 항공사 귀책(airline_fault): 기체 결함, 승무원 부족, 상업적 결정 → 보상 대상
- 기상/불가항력(weather, extraordinary): EU261에선 보상금 없으나 돌봄의 권리는 보장
`

    const userPrompt = `당신은 항공 보상 전문 상담사입니다. 아래 규정 지식과 실제 항공편 상황을 바탕으로, 당황한 여행자에게 친구처럼 설명하는 안내문을 한국어(analysis_kr)와 영어(analysis_en)로 작성해 JSON으로 반환하세요.

[적용 규정 지식]
${POLICY_REFERENCE}

[승객 상황]
${JSON.stringify(flightDetails)}

━━━ 작성 규칙 ━━━

1. 말투: "~할 수 있어요", "~해보세요" 처럼 친근하게. "~입니다", "~됩니다" 같은 딱딱한 문어체 절대 금지.
2. 법률 용어: 반드시 괄호로 풀어쓰기. 예) 몬트리올 협약(국제 항공 피해 보상 규정), SDR(국제 통화 단위)
3. 부정적 소식: 대안을 함께 제시. "못 받아요" 대신 "고정 금액은 없지만, 실비를 청구할 수 있어요"
4. 수치: 계산된 보상 금액(amount, currency)이 있으면 반드시 안내문에 포함
5. 규정 근거: 위 규정 지식에서 해당 상황에 맞는 조항·금액을 정확하게 인용

━━━ 출력 형식 ━━━

아래 섹션 헤더 [대괄호]를 반드시 그대로 출력하세요. 헤더 없으면 스타일이 깨집니다.

[한 줄 요약]
보상 가능 여부와 핵심 금액을 긍정적 뉘앙스로 한 줄 요약. 수치 반드시 포함.

[적용 규정 설명]
어떤 규정이 왜 적용되는지, 2~3문장으로 친근하게 설명.

[보상 가능 금액 또는 권리]
• 구체적 항목과 금액/조건
• 항목 2
• 항목 3

[다음 행동 가이드]
• 지금 바로 할 수 있는 행동 순서대로
• 행동 2
• 행동 3

* 본 결과는 공개된 규정을 바탕으로 한 참고용 정보이며, 실제 보상 여부는 항공사 판단에 따라 달라질 수 있습니다.

━━━ 응답 형식 ━━━
줄바꿈은 \\n으로 표현. JSON만 출력, 다른 텍스트 없음:
{"analysis_kr": "...", "analysis_en": "..."}`

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      console.error('Gemini API error:', response.status, JSON.stringify(data))
      // 503 과부하 시 fallback 모델로 재시도
      if (response.status === 503) {
        await delay(5000)
        const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`
        const fallbackRes = await fetch(fallbackUrl, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
            generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
          }),
        })
        const fallbackData = await fallbackRes.json()
        if (!fallbackRes.ok) {
          console.error('Fallback Gemini API error:', fallbackRes.status, JSON.stringify(fallbackData))
          return null
        }
        let fallbackText = fallbackData.candidates?.[0]?.content?.parts?.[0]?.text || ''
        fallbackText = fallbackText.replace(/```json/g, '').replace(/```/g, '').trim()
        const fallbackResult = JSON.parse(fallbackText)
        if (!fallbackResult.analysis_kr && !fallbackResult.analysis_en) return null
        return fallbackResult
      }
      return null
    }
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    text = text.replace(/```json/g, '').replace(/```/g, '').trim()
    const result = JSON.parse(text)
    if (!result.analysis_kr && !result.analysis_en) return null
    return result
  } catch (err) {
    console.error('callAnalysis error:', err)
    return null
  }
}

// Gemini API 호출 (이메일 생성)
async function callEmailGen(flightDetails: any, geminiApiKey: string): Promise<{ email_kr: string; email_en: string } | null> {
  try {
    const userPrompt = `항공사 고객센터에 제출할 가장 강력하고 전문적인 민원 이메일을 한국어(kr)와 영어(en)로 각각 작성하여 JSON으로 반환하세요.
분석 데이터: ${JSON.stringify(flightDetails)}

요구사항:
1. JSON 형식: {"email_kr": "...", "email_en": "..."}
2. [적용 규정]과 [보상 근거 판례]를 인용하여 단호하게 권리를 주장하세요.
3. [예약번호], [성함] 등 사용자가 채워야 할 부분은 [ ] 플레이스홀더를 사용하세요.
4. Markdown 기호를 사용하지 마세요. 줄바꿈은 \\n을 사용하세요.
5. 제목(Subject)을 본문 처음에 포함하세요.`

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: `시스템 지침: 당신은 승객의 권리를 관철시키는 전문 변호사입니다.\n\n${userPrompt}` }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.6 },
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      console.error('Gemini API error (email):', response.status, JSON.stringify(data))
      if (response.status === 503) {
        await delay(5000)
        const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`
        const fallbackRes = await fetch(fallbackUrl, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: `시스템 지침: 당신은 승객의 권리를 관철시키는 전문 변호사입니다.\n\n${userPrompt}` }] }],
            generationConfig: { responseMimeType: 'application/json', temperature: 0.6 },
          }),
        })
        const fallbackData = await fallbackRes.json()
        if (!fallbackRes.ok) return null
        let ft = fallbackData.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
        if (ft.includes('```json')) ft = ft.split('```json')[1].split('```')[0].trim()
        else if (ft.includes('```')) ft = ft.split('```')[1].split('```')[0].trim()
        const fr = JSON.parse(ft)
        if (!fr.email_kr && !fr.email_en) return null
        return fr
      }
      return null
    }
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
    if (text.includes('```json')) text = text.split('```json')[1].split('```')[0].trim()
    else if (text.includes('```')) text = text.split('```')[1].split('```')[0].trim()
    const result = JSON.parse(text)
    if (!result.email_kr && !result.email_en) return null
    return result
  } catch (err) {
    console.error('callEmailGen error:', err)
    return null
  }
}

// Polar 환불 요청
async function requestPolarRefund(purchase: any, _geminiApiKey: string) {
  try {
    const polarAccessToken = Deno.env.get('POLAR_ACCESS_TOKEN') ?? ''
    const orderId = purchase.extra_data?.order_id

    if (!orderId) {
      console.error('No order_id found in purchase extra_data, cannot refund')
      return
    }

    // 금액 파싱 (price_label: "9.90 USD" 형식)
    const priceLabel = purchase.price_label ?? ''
    const amountMatch = priceLabel.match(/([\d.]+)/)
    const amountCents = amountMatch ? Math.round(parseFloat(amountMatch[1]) * 100) : 0

    if (!amountCents) {
      console.error('Could not parse amount from price_label:', priceLabel)
      return
    }

    const res = await fetch('https://api.polar.sh/v1/refunds/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${polarAccessToken}`,
      },
      body: JSON.stringify({
        order_id: orderId,
        reason: 'service_disruption',
        amount: amountCents,
        comment: 'AI 분석 처리 실패로 인한 자동 환불',
        revoke_benefits: true,
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      console.error('Polar refund failed:', res.status, JSON.stringify(data))
    } else {
      console.log('Polar refund succeeded:', JSON.stringify(data))
    }
  } catch (err) {
    console.error('requestPolarRefund error:', err)
  }
}

async function processWithRetry(purchaseId: string, supabase: any, geminiApiKey: string) {
  // 구매 내역 조회
  const { data: purchase, error: fetchErr } = await supabase
    .from('purchases')
    .select('*, calculations(*)')
    .eq('id', purchaseId)
    .single()

  if (fetchErr || !purchase) {
    console.error('Failed to fetch purchase:', fetchErr)
    return
  }

  const calcData = purchase.calculations
  if (!calcData) {
    console.error('No calculation data found for purchase:', purchaseId)
    return
  }

  const flightDetails = {
    ...calcData.input_data,
    ...calcData.result_data,
    dep: calcData.input_data?.dep,
    arr: calcData.input_data?.arr,
    reason: calcData.input_data?.reason,
    timing: calcData.input_data?.timing,
    amount: calcData.result_data?.amount,
    currency: calcData.result_data?.currency,
    regulation: calcData.result_data?.regulation,
  }

  let currentStatus: string = purchase.ai_status || 'PROCESSING'

  // 최대 FAILED_SEQUENCE 길이만큼 반복 (PROCESSING → FAILED → FAILED_1 → FAILED_2 → FAILED_3 → REFUND)
  for (let attempt = 0; attempt <= FAILED_SEQUENCE.length; attempt++) {
    if (attempt > 0) {
      // 재시도 전 대기
      console.log(`Waiting ${RETRY_DELAY_MS}ms before retry attempt ${attempt}...`)
      await delay(RETRY_DELAY_MS)
    }

    console.log(`Processing purchase ${purchaseId}, product: ${purchase.product_type}, attempt: ${attempt + 1}, current status: ${currentStatus}`)

    let aiResult: any = null

    if (purchase.product_type === 'detailed_analysis') {
      aiResult = await callAnalysis(flightDetails, geminiApiKey)
    } else if (purchase.product_type === 'email_draft') {
      // 이메일 생성은 분석 데이터가 필요하므로 같은 calc_id의 detailed_analysis 구매 내역에서 가져옴
      const { data: analysisPurchase } = await supabase
        .from('purchases')
        .select('extra_data')
        .eq('calc_id', purchase.calc_id)
        .eq('product_type', 'detailed_analysis')
        .eq('ai_status', 'COMPLETED')
        .single()

      const emailFlightDetails = {
        ...flightDetails,
        analysis: analysisPurchase?.extra_data?.analysis_kr,
      }
      aiResult = await callEmailGen(emailFlightDetails, geminiApiKey)
    }

    if (aiResult) {
      // 성공: extra_data 업데이트 및 COMPLETED 상태로 변경
      const updatedExtraData = { ...purchase.extra_data, ...aiResult }
      const { error: updateErr } = await supabase
        .from('purchases')
        .update({ extra_data: updatedExtraData, ai_status: 'COMPLETED' })
        .eq('id', purchaseId)

      if (updateErr) {
        console.error('Failed to update purchase with AI result:', updateErr)
      } else {
        console.log(`Successfully completed AI processing for purchase ${purchaseId}`)
      }
      return
    }

    // 실패: 다음 실패 상태로 업데이트
    const nextStatus = nextFailedStatus(currentStatus)
    console.log(`AI processing failed. Updating status: ${currentStatus} → ${nextStatus}`)

    const updatePayload: any = { ai_status: nextStatus }
    if (nextStatus === 'REFUND') {
      updatePayload.status = 'refunded'
    }

    const { error: statusErr } = await supabase
      .from('purchases')
      .update(updatePayload)
      .eq('id', purchaseId)

    if (statusErr) {
      console.error('Failed to update ai_status:', statusErr)
    }

    currentStatus = nextStatus

    if (nextStatus === 'REFUND') {
      console.log(`All retries exhausted. Purchase ${purchaseId} marked as REFUND. Requesting Polar refund...`)
      await requestPolarRefund(purchase, geminiApiKey)
      return
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS })

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY') ?? ''

    const { purchaseId } = await req.json()
    if (!purchaseId) {
      return new Response(JSON.stringify({ error: 'purchaseId is required' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    // 즉시 응답하고 백그라운드에서 처리
    // @ts-ignore - Deno EdgeRuntime
    if (typeof EdgeRuntime !== 'undefined') {
      // @ts-ignore
      EdgeRuntime.waitUntil(processWithRetry(purchaseId, supabase, geminiApiKey))
    } else {
      // 로컬 개발 환경: 바로 실행
      processWithRetry(purchaseId, supabase, geminiApiKey).catch(console.error)
    }

    return new Response(JSON.stringify({ received: true, purchaseId }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
