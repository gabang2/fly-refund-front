import React from 'react';
import { C } from '@/lib/constants';

export default function TermsPage({ locale, onBack }: { locale: string; onBack: () => void }) {
  const isKr = locale === 'kr';
  
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
      <div style={{ background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "12px 20px", display: "flex", alignItems: "center" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.accent, fontSize: 14, fontWeight: 500 }}>
          {isKr ? '← 뒤로' : '← Back'}
        </button>
        <span style={{ marginLeft: 16, fontSize: 16, fontWeight: 600, color: C.textPrimary }}>
          {isKr ? '이용약관' : 'Terms of Service'}
        </span>
      </div>
      <div style={{ padding: "20px", fontSize: 14, lineHeight: 1.6, color: C.textPrimary, paddingBottom: 100, overflowY: "auto" }}>
        {isKr ? (
          <>
            <h3 style={{ marginTop: 0 }}>1. 서비스의 목적</h3>
            <p>FlyRefund(이하 "서비스")는 사용자가 입력한 항공편 정보를 바탕으로 여러 국가의 항공 보상 규정(EU261, APPR, 한국 소비자분쟁해결기준 등)에 따른 예상 보상금과 청구 가이드를 제공하는 플랫폼입니다.</p>
            
            <h3>2. 책임의 한계 (면책 조항)</h3>
            <p>본 서비스에서 제공하는 모든 계산 결과, AI 상세 분석 및 항의 이메일 초안은 공개된 규정을 기반으로 한 <strong>참고용 안내일 뿐이며, 법적 자문이나 구속력이 있는 문서가 아닙니다.</strong></p>
            <p>실제 보상 가능 여부와 최종 지급 금액은 항공사의 내부 정책, 예외 사유(기상 악화 등), 그리고 관련 규제 기관의 판단에 따라 달라질 수 있습니다. 본 서비스는 제공된 결과물로 인해 발생하는 어떠한 손해나 분쟁에 대해서도 법적 책임을 지지 않습니다.</p>

            <h3>3. 유료 서비스 (결제 및 환불 정책)</h3>
            <p>본 서비스 내의 특정 기능(AI 상세 분석, 항의 이메일 초안 자동 생성 등)은 유료로 제공될 수 있습니다.</p>
            <p>디지털 콘텐츠 특성상 결제 완료 즉시 결과물이 생성되어 제공되므로, 관련 법령에 따라 <strong>결제 후 단순 변심에 의한 청약 철회(환불)가 불가능</strong>합니다.</p>
            <p>단, 시스템 오류나 버그로 인하여 결과물이 정상적으로 제공되지 않은 경우에는 전액 환불을 요청할 수 있습니다.</p>

            <h3>4. 서비스의 변경 및 중단</h3>
            <p>회사는 서비스 운영상 또는 기술상의 필요에 따라 제공하고 있는 서비스의 전부 또는 일부를 사전 공지 없이 변경하거나 중단할 수 있습니다.</p>
          </>
        ) : (
          <>
            <h3 style={{ marginTop: 0 }}>1. Purpose of Service</h3>
            <p>FlyRefund (the "Service") is a platform that provides estimated compensation amounts and claim guides based on flight compensation regulations of various countries (e.g., EU261, APPR, US DOT) using the flight information provided by the user.</p>
            
            <h3>2. Limitation of Liability (Disclaimer)</h3>
            <p>All calculation results, detailed AI analyses, and complaint email drafts provided by the Service are for reference purposes only based on public regulations and <strong>do not constitute legal advice or binding documents.</strong></p>
            <p>Actual compensation eligibility and final amounts are subject to the airline's internal policies, extraordinary circumstances (e.g., weather), and the judgment of relevant regulatory bodies. The Service assumes no legal liability for any damages or disputes arising from the use of the provided results.</p>

            <h3>3. Paid Services & Refund Policy</h3>
            <p>Certain features within the Service (e.g., Detailed AI Analysis, Auto-generated Email Drafts) may be offered for a fee.</p>
            <p>Because the digital content is generated and delivered immediately upon payment completion, <strong>refunds due to a simple change of mind are not possible</strong> in accordance with applicable laws.</p>
            <p>However, if the output is not successfully delivered due to a system error or bug, you may request a full refund.</p>

            <h3>4. Service Modification and Suspension</h3>
            <p>We reserve the right to modify or suspend all or part of the Service for operational or technical reasons without prior notice.</p>
          </>
        )}
      </div>
    </div>
  );
}
