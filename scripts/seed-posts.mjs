import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwxrspczszenvboiiiap.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const posts = [
  // ── 한국어 (locale: 'kr') ──────────────────────────────────────────────────
  {
    title: '대한항공 ICN→LAX 7시간 지연, EU261로 €600 받았습니다',
    content: `작년 12월에 인천에서 LA 가는 비행기가 기계 결함으로 7시간 넘게 지연됐어요.\n\n처음엔 그냥 포기하고 기다렸는데, FlyRefund로 계산해보니까 EU261 적용이 가능하다고 나오더라고요. 반신반의하면서 항공사에 이메일 보냈는데 한 달 만에 €600 입금됐습니다.\n\n핵심은 지연 확인서(지연 증명서)를 공항에서 꼭 받아두는 거예요. 저는 다행히 게이트 직원한테 요청해서 받아뒀는데, 없었으면 시간이 더 걸렸을 것 같아요. 여러분도 포기하지 마세요!`,
    tag: '성공후기',
    airline: '대한항공',
    route: 'ICN→LAX',
    success: true,
    amt: '€600',
    locale: 'kr',
  },
  {
    title: '아시아나 GMP→CJU 취소 — 보상 가능한가요?',
    content: `오늘 아침 제주도 가는 국내선이 갑자기 결항됐어요. 공항에서 "기상 악화"라고 했는데, 날씨 앱 보면 제주 날씨가 그렇게 나쁘지 않았거든요.\n\n항공사에서는 보상 불가라고 하는데 믿기 어렵네요. 혹시 비슷한 경험 있으신 분 있나요? 한국 소비자분쟁해결기준으로 이의 제기할 수 있을까요?\n\n탑승권이랑 문자 기록은 다 가지고 있습니다.`,
    tag: '도움요청',
    airline: '아시아나항공',
    route: 'GMP→CJU',
    success: false,
    locale: 'kr',
  },
  {
    title: '진에어 4시간 지연 — 국내선도 보상 받을 수 있어요',
    content: `많은 분들이 국내선은 보상 못 받는다고 알고 계시던데, 그렇지 않아요!\n\n공정거래위원회 소비자분쟁해결기준에 따르면 국내선도 4시간 이상 지연 시 운임의 10~20% 배상을 받을 수 있어요. 저는 부산 가는 진에어 4시간 지연으로 운임의 20% 돌려받았습니다.\n\n방법은 간단해요.\n1. 지연 확인서 수령\n2. 항공사 고객센터에 배상 신청\n3. 14일 이내 처리 안 되면 한국소비자원 신고\n\n포기하지 마세요!`,
    tag: '정보공유',
    airline: '진에어',
    route: 'GMP→PUS',
    success: true,
    amt: '₩24,000',
    locale: 'kr',
  },
  {
    title: '유나이티드항공 ICN→SFO 오버부킹 — $1,350 받은 후기',
    content: `미국 출장인데 게이트에서 탑승 거부당했어요. 오버부킹이라고 하더라고요.\n\nUS DOT 규정으로 2시간 이상 연착 시 최대 $1,350까지 보상받을 수 있다는 걸 여기서 처음 알았어요. 처음에 항공사가 $400짜리 바우처를 제시했는데, 규정 공부하고 나서 거절했더니 결국 현금으로 $1,350 받았습니다.\n\n팁: 항공사가 제시하는 바우처보다 현금이 무조건 유리해요. 서명하기 전에 꼭 FlyRefund로 먼저 계산해보세요.`,
    tag: '성공후기',
    airline: 'United Airlines',
    route: 'ICN→SFO',
    success: true,
    amt: '$1,350',
    locale: 'kr',
  },
  {
    title: '에어프랑스 CDG 환승 중 연결편 놓쳤는데 보상 받나요?',
    content: `파리 샤를 드골에서 환승하다가 첫 번째 비행편이 늦게 도착해서 연결편을 놓쳤어요.\n\n에어프랑스 직원이 "환승은 별도 규정"이라고 하던데, 같은 예약번호로 발권된 연결편이면 EU261 적용된다고 들었거든요. 맞나요?\n\n지금은 다음날 편으로 호텔 제공받아서 대기 중입니다. 음식 쿠폰도 받았고요. 이게 보상에서 제외되는 건지도 궁금합니다.`,
    tag: '도움요청',
    airline: 'Air France',
    route: 'ICN→CDG→BCN',
    success: false,
    locale: 'kr',
  },

  // ── English (locale: 'en') ─────────────────────────────────────────────────
  {
    title: 'Got €400 from Ryanair after 5-hour delay — here\'s how',
    content: `My flight from Dublin to Barcelona was delayed 5 hours due to a "technical issue." I almost gave up and just waited, but a fellow passenger told me about EU261 compensation.\n\nI used FlyRefund to calculate my eligibility — it came back with €400. Filed the claim directly on Ryanair's website. They initially rejected it, saying it was an "extraordinary circumstance," but I escalated to the Irish Aviation Authority and got paid within 3 weeks.\n\nKey lesson: airlines often reject first claims hoping you'll give up. Escalate to your national enforcement body if they do. Persistence pays off — literally.`,
    tag: 'Success Story',
    airline: 'Ryanair',
    route: 'DUB→BCN',
    success: true,
    amt: '€400',
    locale: 'en',
  },
  {
    title: 'Denied boarding at Heathrow — what are my rights?',
    content: `I showed up at the gate on time with a confirmed booking, and the BA agent told me the flight was overbooked and I'd been bumped.\n\nThey offered a £250 voucher, but I've read that under UK261 I might be entitled to more. My replacement flight arrives 4 hours late to my destination.\n\nDoes anyone know how this is calculated? Is it based on the original departure time or the final arrival? Also, can I still claim if I accept the voucher? I haven't signed anything yet.`,
    tag: 'Help Needed',
    airline: 'British Airways',
    route: 'LHR→JFK',
    success: false,
    locale: 'en',
  },
  {
    title: 'Quick guide: EU261 vs UK261 after Brexit',
    content: `A lot of people are confused about which regulation applies to their flight post-Brexit. Here's a simple breakdown:\n\n**EU261 applies when:**\n• Departing from any EU airport (regardless of airline)\n• Flying INTO the EU on an EU-based carrier\n\n**UK261 applies when:**\n• Departing from a UK airport\n• Flying INTO the UK on a UK or EU carrier\n\nThe compensation amounts are identical: €/£250 for short haul, €/£400 for medium, €/£600 for long haul (3+ hours late).\n\nIf your flight touches both UK and EU airports, you may have claims under both — but you can only collect once. Always claim under the regulation that's easier to enforce in your situation.`,
    tag: 'Tips & Info',
    airline: 'General',
    route: 'LHR→FRA',
    success: false,
    locale: 'en',
  },
  {
    title: 'Delta cancelled my ATL→ICN flight 2 hours before departure — $1,550 later',
    content: `Delta cancelled my Atlanta to Incheon flight with just 2 hours notice. No explanation, no proactive rebooking — just a text saying "your flight has been cancelled."\n\nUnder the new US DOT rules (effective 2024), airlines must give automatic cash refunds for cancellations. I also qualified for the involuntary denied boarding compensation since my rebooked flight arrived more than 4 hours late.\n\nTotal received: $1,350 (DOT compensation) + full refund of my original ticket (~$200 difference refunded as miles were used).\n\nThe new DOT rules are a game changer — airlines can no longer offer vouchers as the default. Always ask for cash.`,
    tag: 'Success Story',
    airline: 'Delta Air Lines',
    route: 'ATL→ICN',
    success: true,
    amt: '$1,350',
    locale: 'en',
  },
  {
    title: 'Turkish Airlines delay in IST — can I claim if I\'m not EU citizen?',
    content: `Had a 4-hour delay on a Turkish Airlines flight from Istanbul to Amsterdam. I'm Korean, not an EU citizen. Does that affect my EU261 claim?\n\nAlso the delay happened at IST (Turkey), but the destination is AMS (Netherlands). Turkish Airlines is not an EU carrier.\n\nFrom what I've read, EU261 only covers: (1) flights departing FROM the EU, or (2) flights arriving IN the EU operated by an EU carrier. Since this departs Turkey on a non-EU airline, I might be out of luck?\n\nWould love to hear if anyone has successfully claimed in a similar situation.`,
    tag: 'Help Needed',
    airline: 'Turkish Airlines',
    route: 'IST→AMS',
    success: false,
    locale: 'en',
  },
];

async function seedPosts() {
  console.log(`Inserting ${posts.length} posts...`);

  const { data, error } = await supabase
    .from('posts')
    .insert(posts)
    .select('id, title');

  if (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }

  console.log('Done! Inserted posts:');
  data.forEach(p => console.log(`  [${p.id}] ${p.title}`));
}

seedPosts();
