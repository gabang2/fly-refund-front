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

    if (type === 'order.created') {
      const order = data
      const metadata = order.metadata || {}
      const { userId, calcId, productType } = metadata

      if (userId && productType) {
        const extraData: any = {
          order_id: order.id,
          customer_id: order.customer_id,
          customer_email: order.customer_email,
        }

        // 결제 내역 저장 (ai_status = PROCESSING으로 시작)
        const { data: newPurchase, error } = await supabase
          .from('purchases')
          .insert([{
            user_id: userId,
            calc_id: calcId || null,
            product_type: productType,
            status: 'paid',
            ai_status: 'PROCESSING',
            price_label: `${order.amount / 100} ${order.currency.toUpperCase()}`,
            extra_data: extraData,
          }])
          .select()
          .single()

        if (error) {
          console.error('Error inserting purchase:', error)
          throw error
        }

        console.log(`Successfully recorded purchase for user ${userId}, product ${productType}, purchase id: ${newPurchase.id}`)

        // AI 처리를 비동기로 시작 (백그라운드)
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
        const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

        const triggerAI = async () => {
          try {
            const res = await fetch(`${supabaseUrl}/functions/v1/process-ai-result`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${anonKey}`,
              },
              body: JSON.stringify({ purchaseId: newPurchase.id }),
            })
            console.log(`process-ai-result triggered: ${res.status}`)
          } catch (e) {
            console.error('Failed to trigger process-ai-result:', e)
          }
        }

        // @ts-ignore - Deno EdgeRuntime
        if (typeof EdgeRuntime !== 'undefined') {
          // @ts-ignore
          EdgeRuntime.waitUntil(triggerAI())
        } else {
          triggerAI().catch(console.error)
        }
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
