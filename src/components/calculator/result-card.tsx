import React from "react";
import { Card } from "@/components/ui/card";
import { C } from "@/lib/constants";
import type { CalculationResult } from "@/lib/calculator/engine";

interface ResultCardProps {
  t: any;
  result: CalculationResult;
}

export function ResultCard({ t, result }: ResultCardProps) {
  const {
    amount, currency, isUpTo, isRefundOnly, isMontrealFallback,
    isGuideline, careRights, claimDeadlineYears, explanation,
    regulation, jurisdiction, distanceKm, gacaPercent,
  } = result;

  const hasAmount = amount > 0;
  const isEligible = hasAmount || isRefundOnly;
  const noComp = !hasAmount && !isRefundOnly && !isMontrealFallback;

  // 금액 표시 문자열
  const amountDisplay = (() => {
    if (isMontrealFallback) return t.montrealLabel;
    if (isRefundOnly) return t.refundOnlyLabel;
    if (gacaPercent) return `${t.ticketValuePrefix}${gacaPercent}%`;
    if (!hasAmount) return t.noComp;
    const formatted = amount.toLocaleString();
    const prefix = isUpTo ? `${t.upToLabel} ` : '';
    return `${prefix}${currency} ${formatted}`;
  })();

  // KRW 환산 (EUR, GBP, USD, CAD → 참고용)
  const krwRef = (() => {
    if (!hasAmount || currency === '₩') return null;
    const rates: Record<string, number> = { EUR: 1500, GBP: 1750, USD: 1400, CAD: 1030, SDR: 1900 };
    const rate = rates[currency];
    if (!rate) return null;
    return `≈ ${(amount * rate).toLocaleString()}₩`;
  })();

  // 설명 텍스트
  const explanationText = t.explanations?.[explanation] ?? '';

  // 배지 색상
  const badgeColor = isEligible ? C.success : noComp ? C.warn : C.textSecondary;
  const badgeBg = isEligible ? C.successLight : noComp ? C.warnLight : C.surface;
  const badgeText = isEligible ? t.highChance : t.lowChance;

  return (
    <Card style={{ padding: 20, display: "flex", flexDirection: "column", gap: 0 }}>
      {/* 금액 + 배지 */}
      <div style={{ fontSize: 11, fontWeight: 500, color: C.textSecondary, marginBottom: 6 }}>{t.estLabel}</div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 4 }}>
        <div>
          <div style={{ fontSize: 38, fontWeight: 700, color: hasAmount ? C.textPrimary : C.textSecondary, lineHeight: 1 }}>
            {amountDisplay}
          </div>
          {krwRef && (
            <div style={{ fontSize: 13, color: C.textSecondary, marginTop: 4 }}>{krwRef}</div>
          )}
        </div>
        <div style={{ background: badgeBg, borderRadius: 100, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: badgeColor, whiteSpace: "nowrap" }}>
          {badgeText}
        </div>
      </div>

      {/* 설명 문구 */}
      {explanationText && (
        <div style={{ fontSize: 12, color: C.textSecondary, background: C.surface, borderRadius: 8, padding: "8px 12px", marginTop: 12 }}>
          {explanationText}
        </div>
      )}

      {/* 몬트리올 협약 안내 */}
      {isMontrealFallback && (
        <div style={{ fontSize: 12, color: C.warn, background: C.warnLight, borderRadius: 8, padding: "8px 12px", marginTop: 12 }}>
          {t.montrealNote}
        </div>
      )}

      {/* 미국 환불 안내 */}
      {isRefundOnly && (
        <div style={{ fontSize: 12, color: C.accent, background: C.accentLight, borderRadius: 8, padding: "8px 12px", marginTop: 12 }}>
          {t.refundOnlyNote}
        </div>
      )}

      {/* 한국 가이드라인 경고 */}
      {isGuideline && (
        <div style={{ fontSize: 12, color: C.warn, background: C.warnLight, borderRadius: 8, padding: "8px 12px", marginTop: 12 }}>
          {t.guidelineNote}
        </div>
      )}

      {/* 구분선 */}
      <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 16, paddingTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>

        {/* 적용 규정 */}
        <Row label={t.regLabel} value={regulation} />

        {/* 관할 거리 */}
        {distanceKm > 0 && (
          <Row label={t.distanceLabel} value={`${distanceKm.toLocaleString()} km`} />
        )}

        {/* 돌봄의 권리 */}
        {careRights && (
          <Row label={t.careRightsLabel} value={t.careRightsText} valueColor={C.success} />
        )}

        {/* 청구 기한 */}
        {claimDeadlineYears > 0 && (
          <Row label={t.claimDeadlineLabel} value={t.claimDeadlineText.replace('{n}', String(claimDeadlineYears))} />
        )}
      </div>
    </Card>
  );
}

function Row({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
      <div style={{ fontSize: 11, color: C.textSecondary, flexShrink: 0 }}>{label}</div>
      <div style={{ fontSize: 12, fontWeight: 500, color: valueColor ?? C.textPrimary, textAlign: "right" }}>{value}</div>
    </div>
  );
}
