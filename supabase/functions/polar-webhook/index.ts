import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const body = await req.json()
    const { type, data } = body

    console.log(`Received Polar webhook event: ${type}`, JSON.stringify(data, null, 2))

    // checkout.created 또는 order.created 둘 다 처리 가능하지만, 
    // 실제 결제 완료 후 DB에 넣으려면 order.created가 적절합니다.
    if (type === 'order.created') {
      const order = data
      const metadata = order.metadata || {}
      
      const { userId, calcId, productType } = metadata

      if (userId && productType) {
        let extraData: any = { 
          order_id: order.id,
          customer_id: order.customer_id,
          customer_email: order.customer_email
        }

        // 1. 만약 AI 분석 상품이라면, 분석을 미리 수행하여 저장
        if (productType === 'detailed_analysis' && calcId) {
          try {
            console.log(`Starting AI analysis for calculation ${calcId}...`)
            // 현재 프로젝트 구조상 내부 API 호출이 어려우므로 
            // 프론트엔드에서 데이터가 비어있을 때 수행하거나, 여기서 AI API를 직접 호출해야 합니다.
            // 일단은 'pending' 상태로 두고 프론트엔드에서 보완하도록 하겠습니다.
            extraData.analysis_status = 'pending'
          } catch (e) {
            console.error('AI Analysis failed during webhook:', e)
          }
        }

        // 2. 결제 내역 저장
        const { error } = await supabase
          .from('purchases')
          .insert([{
            user_id: userId,
            calc_id: calcId || null,
            product_type: productType,
            status: 'paid',
            price_label: `${order.amount / 100} ${order.currency.toUpperCase()}`,
            extra_data: extraData
          }])

        if (error) {
          console.error('Error inserting purchase:', error)
          throw error
        }
        console.log(`Successfully recorded purchase for user ${userId}, product ${productType}`)
      } else {
        console.warn('Missing metadata in Polar webhook:', metadata)
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
