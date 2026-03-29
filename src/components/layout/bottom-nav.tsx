import React from "react";
import { C } from "@/lib/constants";

interface BottomNavProps {
  active: number;
  onTab: (idx: number) => void;
  labels: { home: string; community: string; myInfo: string };
}

export function BottomNav({ active, onTab, labels }: BottomNavProps) {
  const tabs = [
    { icon: "✈", label: labels.home },
    { icon: "💬", label: labels.community },
    { icon: "👤", label: labels.myInfo }
  ];
  
  return (
    <div style={{ height: 72, background: C.bg, borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "flex-start", paddingTop: 10, flexShrink: 0 }}>
      {tabs.map((tb, i) => (
        <button key={i} onClick={() => onTab(i)} style={{ flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <span style={{ fontSize: 22 }}>{tb.icon}</span>
          <span style={{ fontSize: 11, fontWeight: active === i ? 600 : 400, color: active === i ? C.accent : C.textSecondary }}>{tb.label}</span>
        </button>
      ))}
    </div>
  );
}
