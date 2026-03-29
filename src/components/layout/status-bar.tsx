import React from "react";
import { C } from "@/lib/constants";

export function StatusBar() {
  return (
    <div style={{ height: 44, background: C.bg, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", flexShrink: 0 }}>
      <span style={{ fontSize: 15, fontWeight: 600, color: C.textPrimary }}>9:41</span>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <span style={{ fontSize: 11 }}>●●●</span><span style={{ fontSize: 11 }}>📶</span><span style={{ fontSize: 11 }}>🔋</span>
      </div>
    </div>
  );
}
