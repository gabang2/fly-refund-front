import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS })

  try {
    const { purchaseId } = await req.json()
    if (!purchaseId) {
      return new Response(JSON.stringify({ error: 'purchaseId is required' }), { status: 400, headers: CORS_HEADERS })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { data: purchase, error: fetchErr } = await supabase
      .from('purchases')
      .select('*')
      .eq('id', purchaseId)
      .single()

    if (fetchErr || !purchase) {
      return new Response(JSON.stringify({ error: 'Purchase not found' }), { status: 404, headers: CORS_HEADERS })
    }

    if (purchase.status === 'refunded') {
      return new Response(JSON.stringify({ error: 'Already refunded' }), { status: 400, headers: CORS_HEADERS })
    }

    const orderId = purchase.extra_data?.order_id
    if (!orderId) {
      return new Response(JSON.stringify({ error: 'No order_id found' }), { status: 400, headers: CORS_HEADERS })
    }

    const amountMatch = (purchase.price_label ?? '').match(/([\d.]+)/)
    const amountCents = amountMatch ? Math.round(parseFloat(amountMatch[1]) * 100) : 0
    if (!amountCents) {
      return new Response(JSON.stringify({ error: 'Could not parse amount' }), { status: 400, headers: CORS_HEADERS })
    }

    const polarRes = await fetch('https://sandbox-api.polar.sh/v1/refunds/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('POLAR_ACCESS_TOKEN')}`,
      },
      body: JSON.stringify({
        order_id: orderId,
        reason: 'customer_request',
        amount: amountCents,
        revoke_benefits: true,
      }),
    })

    const polarData = await polarRes.json()
    if (!polarRes.ok) {
      console.error('Polar refund failed:', polarData)
      return new Response(JSON.stringify({ error: 'Polar refund failed', detail: polarData }), { status: 500, headers: CORS_HEADERS })
    }

    await supabase
      .from('purchases')
      .update({ status: 'refunded', ai_status: 'REFUND' })
      .eq('id', purchaseId)

    return new Response(JSON.stringify({ success: true }), { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } })
  } catch (err: any) {
    console.error('refund-purchase error:', err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS_HEADERS })
  }
})
