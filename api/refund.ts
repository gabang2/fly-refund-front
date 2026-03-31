import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
      status: 405, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }

  try {
    const { purchaseId } = await req.json();
    if (!purchaseId) {
      return new Response(JSON.stringify({ error: 'purchaseId is required' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(
      process.env.VITE_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // 구매 내역 조회
    const { data: purchase, error: fetchErr } = await supabase
      .from('purchases')
      .select('*')
      .eq('id', purchaseId)
      .single();

    if (fetchErr || !purchase) {
      return new Response(JSON.stringify({ error: 'Purchase not found' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (purchase.status === 'refunded') {
      return new Response(JSON.stringify({ error: 'Already refunded' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const orderId = purchase.extra_data?.order_id;
    if (!orderId) {
      return new Response(JSON.stringify({ error: 'No order_id found' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 금액 파싱 (price_label: "9.90 USD" 형식)
    const amountMatch = (purchase.price_label ?? '').match(/([\d.]+)/);
    const amountCents = amountMatch ? Math.round(parseFloat(amountMatch[1]) * 100) : 0;
    if (!amountCents) {
      return new Response(JSON.stringify({ error: 'Could not parse amount' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Polar 환불 요청
    const polarRes = await fetch('https://api.polar.sh/v1/refunds/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.POLAR_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        order_id: orderId,
        reason: 'customer_request',
        amount: amountCents,
        revoke_benefits: true,
      }),
    });

    const polarData = await polarRes.json();
    if (!polarRes.ok) {
      console.error('Polar refund failed:', polarData);
      return new Response(JSON.stringify({ error: 'Polar refund failed', detail: polarData }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // DB 상태 업데이트
    const { error: updateErr } = await supabase
      .from('purchases')
      .update({ status: 'refunded', ai_status: 'REFUND' })
      .eq('id', purchaseId);

    if (updateErr) {
      console.error('DB update failed after Polar refund:', updateErr);
    }

    return new Response(JSON.stringify({ success: true }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    console.error('Refund route error:', err);
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
