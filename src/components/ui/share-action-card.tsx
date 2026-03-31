import React from "react";
import { Card } from "./card";
import { C } from "@/lib/constants";

interface ShareActionCardProps {
  onShare: () => void;
  locale: string;
  t: any;
}

export function ShareActionCard({ onShare, locale, t }: ShareActionCardProps) {
  const isKr = locale === 'kr';
  
  return (
    <Card style={{ padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>
            {isKr ? '내 경험 커뮤니티에 남기기' : 'Share Your Story'}
          </div>
          <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 2 }}>
            {isKr ? '비슷한 상황의 여행자에게 실질적인 도움이 돼요' : 'Your experience could help someone in the same situation'}
          </div>
        </div>
        <button
          onClick={onShare}
          style={{
            background: C.accentLight,
            color: C.accent,
            border: "none",
            borderRadius: 8,
            padding: "8px 14px",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            flexShrink: 0
          }}
        >
          {isKr ? '공유하기' : 'Share'}
        </button>
      </div>
    </Card>
  );
}
