import type { CalculationResult } from './calculator/engine';

export function generateEmailDraft(result: CalculationResult, locale: string): string {
  const isKr = locale === 'kr';
  const { dep, arr, airlineName, regulation, amount, currency, isRefundOnly, isMontrealFallback } = result;

  if (isKr) {
    if (isRefundOnly) {
      return `수신: ${airlineName} 고객센터

제목: 항공편 취소 전액 환불 요청 (${dep}→${arr})

안녕하세요,

저는 ${dep}→${arr} 구간 항공편이 취소되어 환불을 요청드립니다.

미국 DOT 규정에 따라, 항공사 측 취소 시 승객은 전액 자동 환불을 받을 권리가 있습니다. 7영업일 이내에 전액 환불 처리를 요청드립니다.

감사합니다.`;
    }

    if (isMontrealFallback) {
      return `수신: ${airlineName} 고객센터

제목: 항공편 취소로 인한 실비 보상 청구 (${dep}→${arr})

안녕하세요,

저는 ${dep}→${arr} 구간 항공편 취소로 인해 발생한 실비를 청구드립니다.

몬트리올 협약에 따라 항공편 취소로 인한 호텔비, 식비, 교통비 등 실제 발생 비용에 대한 보상을 요청드립니다. 영수증을 첨부하오니 확인 후 처리 부탁드립니다.

감사합니다.`;
    }

    return `수신: ${airlineName} 고객센터

제목: 항공편 취소 보상금 청구 (${dep}→${arr})

안녕하세요,

저는 ${dep}→${arr} 구간 항공편이 취소되어 ${regulation} 규정에 따른 보상을 요청드립니다.

적용 규정: ${regulation}
청구 보상액: ${currency}${amount.toLocaleString()}

관련 규정에 따라 14일 이내 보상금 지급을 요청드립니다. 예약 확인증 및 취소 통보 내역을 제출할 준비가 되어 있습니다.

감사합니다.`;
  } else {
    if (isRefundOnly) {
      return `To: ${airlineName} Customer Service

Subject: Request for Full Refund – Cancelled Flight (${dep}→${arr})

Dear ${airlineName},

I am writing to request a full refund for my cancelled flight from ${dep} to ${arr}.

Under US DOT regulations, passengers are entitled to a full automatic refund when a flight is cancelled by the airline. I kindly request that the refund be processed within 7 business days.

Thank you for your prompt attention to this matter.`;
    }

    if (isMontrealFallback) {
      return `To: ${airlineName} Customer Service

Subject: Claim for Actual Expenses – Cancelled Flight (${dep}→${arr})

Dear ${airlineName},

I am writing to claim reimbursement for expenses incurred due to the cancellation of my flight from ${dep} to ${arr}.

Under the Montreal Convention, I am entitled to recover documented expenses (hotel, meals, transport) caused by the cancellation. Please find receipts attached for your review.

Thank you.`;
    }

    return `To: ${airlineName} Customer Service

Subject: Compensation Claim for Cancelled Flight (${dep}→${arr})

Dear ${airlineName},

I am writing to formally claim compensation for the cancellation of my flight from ${dep} to ${arr} under ${regulation}.

Applicable regulation: ${regulation}
Claimed amount: ${currency}${amount.toLocaleString()}

I kindly request payment of the above compensation within 14 days. I am prepared to provide booking confirmation and cancellation notice upon request.

Thank you for your attention.`;
  }
}
