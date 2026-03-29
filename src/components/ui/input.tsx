import React from "react";
import { C } from "@/lib/constants";

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
}

export function InputField({ label, placeholder, value, onChange, type = "text" }: InputFieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: C.textSecondary }}>{label}</label>
      <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
        style={{ height: 44, border: `1px solid ${C.border}`, borderRadius: 8, padding: "0 14px", fontSize: 14, color: C.textPrimary, background: C.bg, outline: "none" }} />
    </div>
  );
}
