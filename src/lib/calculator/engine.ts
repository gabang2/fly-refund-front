import { getAirport, haversineKm, EU_EEA_COUNTRIES, UK_COUNTRIES } from './airports';

// ─── 입력 타입 ────────────────────────────────────────────────────────────────

export type ReasonKey = 'airline_fault' | 'weather' | 'extraordinary';
export type TimingKey = 'under7days' | '7to14days' | 'over14days';

export interface AirlineData {
  id: number;
  name_kr: string;
  name_en: string;
  code: string;
  country_code: string | null;
  is_eu_carrier: boolean | null;
  is_uk_carrier: boolean | null;
  appr_size: 'large' | 'small' | null;
}

export type TicketCurrency = 'KRW' | 'USD' | 'EUR' | 'JPY' | 'GBP' | 'CNY' | 'CAD' | 'AUD' | 'SGD' | 'THB';

// 대략적 KRW 환산 기준 (참고용)
const TO_KRW: Record<TicketCurrency, number> = {
  KRW: 1,
  USD: 1350,
  EUR: 1450,
  JPY: 9,
  GBP: 1700,
  CNY: 185,
  CAD: 980,
  AUD: 850,
  SGD: 1000,
  THB: 38,
};

export function toKrw(amount: number, currency: TicketCurrency): number {
  return Math.round(amount * TO_KRW[currency]);
}

export interface CalculationInput {
  dep: string;             // IATA 출발 공항
  arr: string;             // IATA 도착 공항
  airline: AirlineData;   // 항공사 전체 객체
  reason: ReasonKey;
  timing: TimingKey;
  flightDate?: string;          // YYYY-MM-DD (선택)
  ticketPrice?: number;         // 선택, 한국·GACA용
  ticketCurrency?: TicketCurrency; // 티켓 금액 통화 (기본 KRW)
  lang: string;
}

// ─── 결과 타입 ────────────────────────────────────────────────────────────────

export type ExplanationKey =
  | 'eligible'
  | 'early_notice'
  | 'weather_exempt'
  | 'extraordinary_exempt'
  | 'refund_only'
  | 'montreal_fallback'
  | 'appr_eligible'
  | 'korea_cancellation'
  | 'gaca_cancel_percent'
  | 'dgca_eligible'
  | 'vietnam_eligible'
  | 'anac_refund_only';

export interface CalculationResult {
  dep: string;
  arr: string;
  airlineName: string;
  reason: ReasonKey;
  timing: TimingKey;
  distanceKm: number;
  jurisdiction: string;
  regulation: string;
  amount: number;
  currency: string;
  isUpTo: boolean;             // "최대" 표시 여부
  isRefundOnly: boolean;       // US DOT — 현금 보상 없음, 환불만
  isMontrealFallback: boolean; // 고정 보상 없음, 실비 청구
  isGuideline: boolean;        // 한국 — 강제력 없는 가이드라인
  careRights: boolean;         // 식사·숙박 청구 가능 여부
  claimDeadlineYears: number;
  explanation: ExplanationKey;
  gacaPercent?: number;        // GACA 티켓가치 대비 % (티켓금액 미입력 시)
}

// ─── 관할권 판단 ──────────────────────────────────────────────────────────────

type Jurisdiction =
  | 'EU261' | 'UK261' | 'EU261_UK261_OVERLAP'
  | 'APPR' | 'USDOT' | 'Korea'
  | 'GACA' | 'DGCA' | 'Vietnam' | 'ANAC'
  | 'Montreal';

export function getJurisdiction(
  depCountry: string,
  arrCountry: string,
  airline: AirlineData
): Jurisdiction {
  const depEU = EU_EEA_COUNTRIES.has(depCountry);
  const depUK = UK_COUNTRIES.has(depCountry);
  const arrEU = EU_EEA_COUNTRIES.has(arrCountry);
  const arrUK = UK_COUNTRIES.has(arrCountry);
  const isEUCarrier = !!airline.is_eu_carrier;
  const isUKCarrier = !!airline.is_uk_carrier;

  // EU/EEA 출발 → 항공사 국적 무관하게 EU261
  if (depEU) return 'EU261';

  // UK 출발 → UK261
  if (depUK) {
    // UK 출발, EU 도착, EU 항공사 → UK261이 기준이나 EU261 중첩 가능
    if (arrEU && isEUCarrier) return 'EU261_UK261_OVERLAP';
    return 'UK261';
  }

  // 제3국 출발, EU 도착, EU 항공사
  if (arrEU && isEUCarrier) return 'EU261';

  // 제3국 출발, UK 도착, UK 또는 EU 항공사
  if (arrUK && (isUKCarrier || isEUCarrier)) return 'UK261';

  // 캐나다 출발 또는 도착
  if (depCountry === 'CA' || arrCountry === 'CA') return 'APPR';

  // 인도 국내선
  if (depCountry === 'IN' && arrCountry === 'IN') return 'DGCA';

  // 사우디 출발, 또는 사우디 국적 항공사의 사우디 도착편
  if (depCountry === 'SA') return 'GACA';
  if (arrCountry === 'SA' && airline.country_code === 'SA') return 'GACA';

  // 베트남 출발
  if (depCountry === 'VN') return 'Vietnam';

  // 브라질 출발 또는 도착
  if (depCountry === 'BR' || arrCountry === 'BR') return 'ANAC';

  // 미국 출발 또는 도착
  if (depCountry === 'US' || arrCountry === 'US') return 'USDOT';

  // 한국 출발 또는 도착
  if (depCountry === 'KR' || arrCountry === 'KR') return 'Korea';

  return 'Montreal';
}

// ─── 규정별 계산 모듈 ─────────────────────────────────────────────────────────

interface ModuleResult {
  amount: number;
  currency: string;
  isUpTo: boolean;
  isRefundOnly: boolean;
  isMontrealFallback: boolean;
  isGuideline: boolean;
  careRights: boolean;
  claimDeadlineYears: number;
  explanation: ExplanationKey;
  gacaPercent?: number;
}

function calcEU261(distKm: number, reason: ReasonKey, timing: TimingKey): ModuleResult {
  const base: ModuleResult = {
    amount: 0, currency: 'EUR', isUpTo: false, isRefundOnly: false,
    isMontrealFallback: false, isGuideline: false, careRights: false, claimDeadlineYears: 3,
    explanation: 'eligible',
  };

  if (reason === 'weather') return { ...base, careRights: true, explanation: 'weather_exempt' };
  if (reason === 'extraordinary') return { ...base, explanation: 'extraordinary_exempt' };
  if (timing === 'over14days') return { ...base, explanation: 'early_notice' };

  let amount = 0;
  if (distKm <= 1500) amount = 250;
  else if (distKm <= 3500) amount = 400;
  else amount = 600;

  return { ...base, amount, careRights: true };
}

function calcUK261(distKm: number, reason: ReasonKey, timing: TimingKey): ModuleResult {
  const base: ModuleResult = {
    amount: 0, currency: 'GBP', isUpTo: false, isRefundOnly: false,
    isMontrealFallback: false, isGuideline: false, careRights: false, claimDeadlineYears: 6,
    explanation: 'eligible',
  };

  if (reason === 'weather') return { ...base, careRights: true, explanation: 'weather_exempt' };
  if (reason === 'extraordinary') return { ...base, explanation: 'extraordinary_exempt' };
  if (timing === 'over14days') return { ...base, explanation: 'early_notice' };

  let amount = 0;
  if (distKm <= 1500) amount = 220;
  else if (distKm <= 3500) amount = 350;
  else amount = 520;

  return { ...base, amount, careRights: true };
}

function calcAPPR(airline: AirlineData, reason: ReasonKey, timing: TimingKey): ModuleResult {
  const base: ModuleResult = {
    amount: 0, currency: 'CAD', isUpTo: true, isRefundOnly: false,
    isMontrealFallback: false, isGuideline: false, careRights: false, claimDeadlineYears: 1,
    explanation: 'appr_eligible',
  };

  if (reason !== 'airline_fault') return { ...base, isUpTo: false, explanation: 'extraordinary_exempt' };
  if (timing === 'over14days') return { ...base, isUpTo: false, explanation: 'early_notice' };

  // 실제 도착 지연 시간 미입력이므로 최대 금액 표시 (isUpTo: true)
  const isLarge = airline.appr_size !== 'small';
  const amount = isLarge ? 1000 : 500;

  return { ...base, amount };
}

function calcUSDOT(reason: ReasonKey): ModuleResult {
  // 미국은 징벌적 보상 없음, 환불 권리만
  return {
    amount: 0, currency: 'USD', isUpTo: false, isRefundOnly: true,
    isMontrealFallback: false, isGuideline: false, careRights: false, claimDeadlineYears: 0,
    explanation: 'refund_only',
  };
}

function calcKorea(reason: ReasonKey, timing: TimingKey, ticketPrice?: number): ModuleResult {
  const base: ModuleResult = {
    amount: 0, currency: '₩', isUpTo: false, isRefundOnly: false,
    isMontrealFallback: false, isGuideline: true, careRights: false, claimDeadlineYears: 3,
    explanation: 'korea_cancellation',
  };

  if (reason !== 'airline_fault' || timing === 'over14days') {
    return { ...base, explanation: 'early_notice' };
  }

  // 취소 보상: 운임 환급 + 최고 $600 USD ≈ 900,000원 (1 USD ≈ 1,500원 기준)
  // 티켓 금액 입력 시 운임의 10%와 비교해 큰 쪽 (최고 900,000원)
  const maxKrw = 900000;
  if (ticketPrice && ticketPrice > 0) {
    const pct10 = Math.round(ticketPrice * 0.1);
    return { ...base, amount: Math.min(pct10 > maxKrw ? pct10 : maxKrw, maxKrw), isUpTo: true };
  }

  return { ...base, amount: maxKrw, isUpTo: true };
}

function calcGACA(reason: ReasonKey, timing: TimingKey, ticketPrice?: number): ModuleResult {
  const base: ModuleResult = {
    amount: 0, currency: 'SDR', isUpTo: false, isRefundOnly: false,
    isMontrealFallback: false, isGuideline: false, careRights: false, claimDeadlineYears: 1,
    explanation: 'gaca_cancel_percent',
  };

  if (reason !== 'airline_fault') return { ...base, explanation: 'extraordinary_exempt' };

  // 취소 보상: 티켓 가치의 % (통보 시점에 따라)
  // over14days → 50%, 7to14days → 75%, under7days → 150%
  const pctMap: Record<TimingKey, number> = {
    over14days: 50,
    '7to14days': 75,
    under7days: 150,
  };
  const pct = pctMap[timing];

  if (ticketPrice && ticketPrice > 0) {
    // KRW로 변환해서 표시 (1 SDR ≈ 1,900원)
    const krw = Math.round((ticketPrice * pct) / 100);
    return { ...base, amount: krw, currency: '₩', isUpTo: false };
  }

  // 티켓 금액 없으면 % 표시
  return { ...base, gacaPercent: pct };
}

function calcDGCA(reason: ReasonKey, timing: TimingKey): ModuleResult {
  const base: ModuleResult = {
    amount: 0, currency: '₹', isUpTo: true, isRefundOnly: false,
    isMontrealFallback: false, isGuideline: false, careRights: true, claimDeadlineYears: 1,
    explanation: 'dgca_eligible',
  };

  if (reason !== 'airline_fault') return { ...base, isUpTo: false, explanation: 'extraordinary_exempt' };
  if (timing === 'over14days') return { ...base, isUpTo: false, explanation: 'early_notice' };

  // 블록 타임 정보 없으므로 최대 금액 표시
  return { ...base, amount: 20000 };
}

function calcVietnam(distKm: number, reason: ReasonKey): ModuleResult {
  const base: ModuleResult = {
    amount: 0, currency: 'USD', isUpTo: false, isRefundOnly: false,
    isMontrealFallback: false, isGuideline: false, careRights: false, claimDeadlineYears: 1,
    explanation: 'vietnam_eligible',
  };

  if (reason !== 'airline_fault') return { ...base, explanation: 'extraordinary_exempt' };

  // 국제선 거리 기준
  let amount = 0;
  if (distKm < 1000) amount = 25;
  else if (distKm < 2500) amount = 50;
  else if (distKm < 5000) amount = 80;
  else amount = 150;

  return { ...base, amount };
}

function calcANAC(reason: ReasonKey): ModuleResult {
  // 브라질: 고정 현금 보상 없음 (탑승거부 제외), 물질적 지원 + 환불만
  return {
    amount: 0, currency: 'BRL', isUpTo: false, isRefundOnly: true,
    isMontrealFallback: false, isGuideline: false, careRights: true, claimDeadlineYears: 1,
    explanation: 'anac_refund_only',
  };
}

function calcMontreal(): ModuleResult {
  return {
    amount: 0, currency: '', isUpTo: false, isRefundOnly: false,
    isMontrealFallback: true, isGuideline: false, careRights: false, claimDeadlineYears: 2,
    explanation: 'montreal_fallback',
  };
}

// ─── 메인 함수 ────────────────────────────────────────────────────────────────

export function calculateCompensation(input: CalculationInput): CalculationResult {
  const { dep, arr, airline, reason, timing, ticketPrice, ticketCurrency = 'KRW', lang } = input;
  const ticketPriceKrw = ticketPrice ? toKrw(ticketPrice, ticketCurrency) : undefined;

  const depAirport = getAirport(dep);
  const arrAirport = getAirport(arr);

  const depCountry = depAirport?.country ?? '';
  const arrCountry = arrAirport?.country ?? '';

  const distanceKm =
    depAirport && arrAirport
      ? Math.round(haversineKm(depAirport.lat, depAirport.lon, arrAirport.lat, arrAirport.lon))
      : 0;

  const jurisdiction = getJurisdiction(depCountry, arrCountry, airline);

  // 관할권별 계산
  let mod: ModuleResult;
  let regulation = '';

  switch (jurisdiction) {
    case 'EU261':
      mod = calcEU261(distanceKm, reason, timing);
      regulation = 'EU Regulation 261/2004';
      break;
    case 'UK261':
      mod = calcUK261(distanceKm, reason, timing);
      regulation = 'UK261 (Air Passenger Rights)';
      break;
    case 'EU261_UK261_OVERLAP': {
      // 두 규정 병렬 계산 후 더 유리한 쪽 선택 (1 EUR ≈ 0.86 GBP 기준, EUR이 통상 유리)
      const eu = calcEU261(distanceKm, reason, timing);
      const uk = calcUK261(distanceKm, reason, timing);
      // EUR → GBP 환산(0.86)으로 비교
      const euInGbp = eu.amount * 0.86;
      if (euInGbp >= uk.amount) {
        mod = eu;
        regulation = 'EU Regulation 261/2004 (EU261 · UK261 중첩 — EU261 유리)';
      } else {
        mod = uk;
        regulation = 'UK261 (EU261 · UK261 중첩 — UK261 유리)';
      }
      break;
    }
    case 'APPR':
      mod = calcAPPR(airline, reason, timing);
      regulation = 'Canada APPR (Air Passenger Protection Regulations)';
      break;
    case 'USDOT':
      mod = calcUSDOT(reason);
      regulation = 'US DOT (Department of Transportation)';
      break;
    case 'Korea':
      mod = calcKorea(reason, timing, ticketPriceKrw);
      regulation = lang === 'kr' ? '한국 소비자분쟁해결기준 (공정거래위원회)' : 'Korea MOLIT Consumer Dispute Resolution';
      break;
    case 'GACA':
      mod = calcGACA(reason, timing, ticketPriceKrw);
      regulation = 'Saudi GACA Passenger Rights Protection Regulations';
      break;
    case 'DGCA':
      mod = calcDGCA(reason, timing);
      regulation = 'India DGCA CAR Section 3 Series M Part IV';
      break;
    case 'Vietnam':
      mod = calcVietnam(distanceKm, reason);
      regulation = 'Vietnam Circular 14/2015/TT-BGTVT';
      break;
    case 'ANAC':
      mod = calcANAC(reason);
      regulation = 'Brazil ANAC Resolution 400';
      break;
    default:
      mod = calcMontreal();
      regulation = 'Montreal Convention 1999';
  }

  const airlineName = lang === 'kr' ? airline.name_kr : airline.name_en;

  return {
    dep: dep.toUpperCase(),
    arr: arr.toUpperCase(),
    airlineName,
    reason,
    timing,
    distanceKm,
    jurisdiction,
    regulation,
    amount: mod.amount,
    currency: mod.currency,
    isUpTo: mod.isUpTo,
    isRefundOnly: mod.isRefundOnly,
    isMontrealFallback: mod.isMontrealFallback,
    isGuideline: mod.isGuideline,
    careRights: mod.careRights,
    claimDeadlineYears: mod.claimDeadlineYears,
    explanation: mod.explanation,
    gacaPercent: mod.gacaPercent,
  };
}
