import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS })

  try {
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
    const body = await req.json()
    const { flightDetails } = body

    const userPrompt = `항공사 고객센터에 제출할 가장 강력하고 전문적인 민원 이메일을 한국어(kr)와 영어(en)로 각각 작성하여 JSON으로 반환하세요.
분석 데이터: ${JSON.stringify(flightDetails)}

요구사항:
1. JSON 형식: {"email_kr": "...", "email_en": "..."}
2. [적용 규정]과 [보상 근거 판례]를 인용하여 단호하게 권리를 주장하세요.
3. [예약번호], [성함] 등 사용자가 채워야 할 부분은 [ ] 플레이스홀더를 사용하세요.
4. Markdown 기호를 사용하지 마세요. 줄바꿈은 \\n을 사용하세요.
5. 제목(Subject)을 본문 처음에 포함하세요.`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{ text: `시스템 지침: 당신은 승객의 권리를 관철시키는 전문 변호사입니다.\n\n${userPrompt}` }]
        }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.6 }
      }),
    })

    const data = await response.json()
    console.log('Gemini raw response:', JSON.stringify(data))
    
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}"
    // 만약 마크다운 코드 블록이 포함되어 있다면 제거
    if (text.includes('```json')) {
      text = text.split('```json')[1].split('```')[0].trim()
    } else if (text.includes('```')) {
      text = text.split('```')[1].split('```')[0].trim()
    }
    
    const result = JSON.parse(text)

    return new Response(JSON.stringify(result), { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: CORS_HEADERS })
  }
})
