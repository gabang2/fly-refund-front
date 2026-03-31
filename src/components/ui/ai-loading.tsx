import React, { useEffect, useState } from "react";
import { C } from "@/lib/constants";

const EMOJIS = ["✈️", "💼", "📋", "⚖️"];

interface AiLoadingProps {
  isKr: boolean;
}

export function AiLoading({ isKr }: AiLoadingProps) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 150);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: "24px 0" }}>
      {/* 이모티콘 wave 로더 */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 56 }}>
        {EMOJIS.map((emoji, i) => {
          // tick 기준으로 각 이모티콘이 다른 타이밍에 bounce
          const phase = (tick - i * 1) % 8; // 8틱 주기
          const bouncing = phase >= 0 && phase < 3;
          return (
            <span
              key={i}
              style={{
                fontSize: 28,
                display: "inline-block",
                transform: bouncing ? "translateY(-14px)" : "translateY(0px)",
                transition: "transform 0.15s ease-in-out",
              }}
            >
              {emoji}
            </span>
          );
        })}
      </div>

      {/* 텍스트 */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, marginBottom: 6 }}>
          {isKr ? "AI가 분석하고 있어요" : "AI is analyzing your case"}
        </div>
        <div style={{ fontSize: 12, color: C.textSecondary }}>
          {isKr ? "보통 15~30초 정도 소요됩니다" : "This usually takes 15–30 seconds"}
        </div>
      </div>
    </div>
  );
}
