import React from "react";
import { C } from "@/lib/constants";

interface CalcSummaryCardProps {
  regulation?: string;
  amt?: string;
  route?: string;
  locale?: string;
}

const REG_MAP_KR: Record<string, string> = {
  "EU Regulation 261/2004": "EU261 (유럽 보상 규정)",
  "UK261 (Air Passenger Rights)": "UK261 (영국 보상 규정)",
  "Canada APPR (Air Passenger Protection Regulations)": "캐나다 APPR 규정",
  "US DOT (Department of Transportation)": "미국 교통부 (US DOT) 규정",
  "Korea MOLIT Consumer Dispute Resolution": "한국 소비자분쟁해결기준 (공정거래위원회)",
  "한국 소비자분쟁해결기준 (공정거래위원회)": "한국 소비자분쟁해결기준 (공정거래위원회)",
  "Saudi GACA Passenger Rights Protection Regulations": "사우디 GACA 규정",
  "India DGCA CAR Section 3 Series M Part IV": "인도 DGCA 규정",
  "Vietnam Circular 14/2015/TT-BGTVT": "베트남 항공여객 보호 규정",
  "Brazil ANAC Resolution 400": "브라질 ANAC 규정",
  "Montreal Convention 1999": "몬트리올 협약 1999",
};

function localizeReg(reg?: string, locale?: string): string {
  if (!reg) return "";
  if (locale !== "kr") return reg;
  return REG_MAP_KR[reg] || reg;
}

export function CalcSummaryCard({ regulation, amt, route, locale }: CalcSummaryCardProps) {
  if (!amt && !route) return null;

  const dep = route?.split("→")[0]?.trim();
  const arr = route?.split("→")[1]?.trim();
  const localizedReg = localizeReg(regulation, locale);

  const iconBox: React.CSSProperties = {
    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
  };

  return (
    <div style={{
      background: "#f8f9fa",
      borderRadius: 12,
      border: `1px solid #e8e8e8`,
      overflow: "hidden",
    }}>
      {/* 1. 규정 */}
      {localizedReg && (
        <div style={{ padding: "10px 14px", borderBottom: `1px solid #e8e8e8`, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ ...iconBox, background: "#eef2ff" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, color: C.accent, lineHeight: 1.4 }}>
            {localizedReg}
          </span>
        </div>
      )}

      {/* 2. 보상 금액 */}
      {amt && (
        <div style={{ padding: "10px 14px", borderBottom: (dep || arr) ? `1px solid #e8e8e8` : undefined, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ ...iconBox, background: C.successLight }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 10, color: C.textSecondary, marginBottom: 1 }}>
              {locale === "kr" ? "보상 금액" : "Compensation"}
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.success, letterSpacing: "-0.3px" }}>
              {amt}
            </div>
          </div>
        </div>
      )}

      {/* 3. 노선 */}
      {(dep || arr) && (
        <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ ...iconBox, background: "#f0f0f0" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/>
            </svg>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>{dep}</span>
            <span style={{ fontSize: 11, color: C.textSecondary }}>→</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>{arr}</span>
          </div>
        </div>
      )}
    </div>
  );
}
