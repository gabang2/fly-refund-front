import React from 'react';
import { C } from '@/lib/constants';

export default function PrivacyPage({ locale, onBack }: { locale: string; onBack: () => void }) {
  const isKr = locale === 'kr';
  
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
      <div style={{ background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "12px 20px", display: "flex", alignItems: "center" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.accent, fontSize: 14, fontWeight: 500 }}>
          {isKr ? '← 뒤로' : '← Back'}
        </button>
        <span style={{ marginLeft: 16, fontSize: 16, fontWeight: 600, color: C.textPrimary }}>
          {isKr ? '개인정보 처리방침' : 'Privacy Policy'}
        </span>
      </div>
      <div style={{ padding: "20px", fontSize: 14, lineHeight: 1.6, color: C.textPrimary, paddingBottom: 100, overflowY: "auto" }}>
        {isKr ? (
          <>
            <h3 style={{ marginTop: 0 }}>1. 수집하는 개인정보 항목</h3>
            <p>본 서비스는 원활한 서비스 제공을 위해 아래와 같은 개인정보를 수집하고 있습니다.</p>
            <ul style={{ paddingLeft: 20 }}>
              <li><strong>필수항목:</strong> 이메일 주소</li>
              <li><strong>선택항목:</strong> 항공편 정보 (출발지, 도착지, 날짜, 항공사 등), 닉네임</li>
              <li><strong>결제 시 수집항목:</strong> 결제 내역 (실제 카드 정보는 당사가 저장하지 않으며 결제대행사를 통해 안전하게 처리됩니다)</li>
            </ul>

            <h3>2. 개인정보의 수집 및 이용 목적</h3>
            <p>수집된 개인정보는 회원 관리, 서비스 제공, 요금 결제 및 정산, 고객 상담 등에 이용됩니다.</p>

            <h3>3. 개인정보의 보유 및 이용 기간</h3>
            <p>원칙적으로 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 관련 법령에서 정한 일정한 기간 동안 개인정보를 보관합니다.</p>

            <h3>4. 개인정보 제3자 제공</h3>
            <p>회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 단, AI 분석 및 이메일 생성을 위해 입력된 항공편 정보와 취소 사유 등의 비식별 데이터가 외부 API (예: Google Gemini API)로 전송될 수 있습니다.</p>

            <h3>5. 쿠키(Cookie) 및 분석 도구의 사용</h3>
            <p>본 서비스는 사용자 경험 향상과 트래픽 분석을 위해 Google Analytics 등의 도구를 사용합니다. 이 과정에서 익명화된 트래픽 데이터가 수집될 수 있습니다.</p>
          </>
        ) : (
          <>
            <h3 style={{ marginTop: 0 }}>1. Information We Collect</h3>
            <p>We collect the following personal information to provide our services smoothly.</p>
            <ul style={{ paddingLeft: 20 }}>
              <li><strong>Required:</strong> Email address</li>
              <li><strong>Optional:</strong> Flight details (departure, arrival, date, airline), Nickname</li>
              <li><strong>Payment Information:</strong> Payment history (Actual card details are handled securely by third-party providers and are not stored by us)</li>
            </ul>

            <h3>2. Purpose of Collection</h3>
            <p>The collected information is used for account management, service provision, payment processing, and customer support.</p>

            <h3>3. Retention Period</h3>
            <p>Personal information is generally destroyed without delay once the purpose of collection is fulfilled, unless retention is required by applicable laws.</p>

            <h3>4. Third-Party Sharing</h3>
            <p>We do not share your personal information with third parties, except that anonymized flight data and cancellation reasons may be sent to external APIs (e.g., Google Gemini API) for AI analysis and email draft generation.</p>

            <h3>5. Cookies and Analytics</h3>
            <p>This service uses tools like Google Analytics to improve user experience and analyze traffic. Anonymized traffic data may be collected in this process.</p>
          </>
        )}
      </div>
    </div>
  );
}
