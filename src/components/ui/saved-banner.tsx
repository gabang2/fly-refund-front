import React from "react";
import { C } from "@/lib/constants";

export function SavedBanner({ text }: { text: string }) {
  return <div style={{ background: C.accentLight, borderRadius: 8, padding: "10px 16px", fontSize: 12, color: C.accent, fontWeight: 500 }}>✓ {text}</div>;
}
