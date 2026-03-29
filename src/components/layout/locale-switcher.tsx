import React from "react";
import { C } from "@/lib/constants";

interface LocaleSwitcherProps {
  currentLocale: string;
  onLocaleChange: (locale: string) => void;
}

export function LocaleSwitcher({ currentLocale, onLocaleChange }: LocaleSwitcherProps) {
  const languages = [
    { code: "kr", label: "한국어" },
    { code: "en", label: "English" }
  ];

  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <select
        value={currentLocale}
        onChange={(e) => onLocaleChange(e.target.value)}
        style={{
          appearance: "none",
          background: C.bg,
          border: `1px solid ${C.border}`,
          borderRadius: 100,
          padding: "6px 28px 6px 12px",
          fontSize: 12,
          fontWeight: 600,
          color: C.textPrimary,
          cursor: "pointer",
          outline: "none"
        }}
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
      {/* 커스텀 화살표 아이콘 */}
      <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", fontSize: 10, color: C.textSecondary }}>
        ▼
      </div>
    </div>
  );
}
