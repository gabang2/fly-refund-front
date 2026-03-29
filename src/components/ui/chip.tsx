import React from "react";
import { C } from "@/lib/constants";

interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function Chip({ label, active, onClick }: ChipProps) {
  return (
    <button onClick={onClick} style={{ padding: "6px 14px", borderRadius: 100, border: `1px solid ${active ? C.accent : C.border}`, background: active ? C.accentLight : C.bg, color: active ? C.accent : C.textSecondary, fontSize: 13, fontWeight: active ? 600 : 400, cursor: "pointer", whiteSpace: "nowrap" }}>
      {label}
    </button>
  );
}
