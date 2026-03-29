import React from "react";
import { C } from "@/lib/constants";

export function Card({ children, style: sx }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", ...sx }}>{children}</div>;
}
