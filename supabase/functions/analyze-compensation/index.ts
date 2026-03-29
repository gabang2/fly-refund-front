import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const KNOWLEDGE_BASE = `
[몬트리올 협약] 국제선 실비 청구 (8,400 USD 한도).
[유럽 EU261/UK261] 거리별 €250~€600. 정비결함은 보상대상.
[캐나다 APPR] 대형사 최대 $1,000 CAD.
[미국 US DOT] 현금보상 대신 전액 자동 환불 의무.
[사우디 GACA] 티켓값의 50~150% 보상.
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS })

  try {
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
    const body = await req.json()
    const { flightDetails } = body

    const userPrompt = `당신은 항공법 전문가입니다. 다음 상황을 분석하여 한국어(kr)와 영어(en) 결과를 반환하세요.
상황: ${JSON.stringify(flightDetails)}

요구사항:
1. JSON 형식으로 응답: {"analysis_kr": "...", "analysis_en": "..."}
2. Markdown 기호 사용 금지.
3. 구체적인 법적 근거와 보상 금액 포함.`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: `${KNOWLEDGE_BASE}\n\n${userPrompt}` }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.2 }
      }),
    })

    const data = await response.json()
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}"
    
    // 마크다운 코드 블록 제거 로직 추가 (안전한 파싱)
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(text);

    return new Response(JSON.stringify(result), { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error("Edge Function Error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: CORS_HEADERS })
  }
})
