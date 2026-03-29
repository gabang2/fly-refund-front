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
        <span style={{ fontSize: 28 }}>💬</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>
            {isKr ? '커뮤니티에 공유하기' : 'Share to Community'}
          </div>
          <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 2 }}>
            {isKr ? '경험을 공유하고 다른 여행자를 도와주세요' : 'Help other travelers by sharing your experience'}
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
          {isKr ? '무료' : 'Free'}
        </button>
      </div>
    </Card>
  );
}
