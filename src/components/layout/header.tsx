import React from "react";
import { C } from "@/lib/constants";

interface HeaderProps {
  title?: string;
  onBack?: { label?: string; onClick: () => void };
  right?: React.ReactNode;
}

export function Header({ title, onBack, right }: HeaderProps) {
  return (
    <>
      <div style={{ height: 52, background: C.bg, display: "flex", alignItems: "center", padding: "0 20px", flexShrink: 0, position: "relative" }}>
        {onBack && (
          <button onClick={onBack.onClick} style={{ background: "none", border: "none", color: C.accent, fontSize: 14, fontWeight: 500, cursor: "pointer", padding: 0, marginRight: 8 }}>
            {onBack.label || "← Back"}
          </button>
        )}
        {title && <span style={{ fontSize: 16, fontWeight: 700, color: C.textPrimary, position: "absolute", left: "50%", transform: "translateX(-50%)" }}>{title}</span>}
        {right && <div style={{ marginLeft: "auto" }}>{right}</div>}
      </div>
      <div style={{ height: 1, background: C.border, flexShrink: 0 }} />
    </>
  );
}
