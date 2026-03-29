import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Polar } from 'https://esm.sh/@polar-sh/sdk@0.46.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. 요청 본문 확인
    const bodyText = await req.text();
    console.log('Raw Request Body:', bodyText);

    if (!bodyText) {
      throw new Error('Request body is empty');
    }

    let payload;
    try {
      payload = JSON.parse(bodyText);
    } catch (e) {
      throw new Error(`Invalid JSON: ${e.message}`);
    }

    const { priceId, successUrl, userId, calcId, productType, customerEmail } = payload;
    console.log('Parsed payload:', { priceId, userId, productType, customerEmail });

    if (!priceId || !userId || !productType) {
      throw new Error(`Missing required parameters: priceId(${!!priceId}), userId(${!!userId}), productType(${!!productType})`);
    }

    const accessToken = Deno.env.get('POLAR_ACCESS_TOKEN');
    if (!accessToken) {
      throw new Error('POLAR_ACCESS_TOKEN is not set in Supabase Secrets');
    }

    const polar = new Polar({
      accessToken: accessToken,
      server: 'sandbox'
    })

    // 2. 체크아웃 세션 생성 (SDK 0.46.x 방식 확인)
    console.log('Calling polar.checkouts.create...');
    
    // SDK 구조에 따라 checkouts.create가 없을 경우를 대비해 세이프티 체크
    if (!polar.checkouts || typeof polar.checkouts.create !== 'function') {
      console.error('Polar SDK structure:', Object.keys(polar));
      if (polar.checkouts) console.error('Polar checkouts keys:', Object.keys(polar.checkouts));
      throw new Error('Polar SDK structure mismatch: polar.checkouts.create is not a function');
    }

    const checkout = await polar.checkouts.create({
      products: [priceId], // 문자열 배열 형식으로 수정
      successUrl: successUrl,
      customerEmail: customerEmail,
      metadata: {
        userId: userId,
        calcId: calcId || '',
        productType: productType
      }
    })

    console.log('Checkout created successfully:', checkout.url)
    return new Response(
      JSON.stringify({ url: checkout.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (err) {
    console.error('Edge Function Error:', err.message)
    return new Response(
      JSON.stringify({ error: err.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
