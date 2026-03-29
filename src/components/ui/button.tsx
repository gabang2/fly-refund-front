import React from "react";
import { C } from "@/lib/constants";

interface BtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  sx?: React.CSSProperties;
  disabled?: boolean;
}

export function Btn({ children, onClick, variant = "primary", size = "md", sx, disabled }: BtnProps) {
  const base: React.CSSProperties = { 
    border: "none", 
    borderRadius: 12, 
    cursor: disabled ? "default" : "pointer", 
    fontWeight: 600, 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    gap: 6, 
    transition: "opacity .15s",
    opacity: disabled ? 0.6 : 1
  };
  const variants = { 
    primary: { background: C.accent, color: "#fff" }, 
    outline: { background: C.bg, color: C.accent, border: `1.5px solid ${C.accent}` }, 
    ghost: { background: C.surface, color: C.textPrimary } 
  };
  const sizes = { 
    sm: { height: 36, padding: "0 16px", fontSize: 13 }, 
    md: { height: 48, padding: "0 20px", fontSize: 15 }, 
    lg: { height: 52, padding: "0 20px", fontSize: 16 } 
  };
  return <button onClick={!disabled ? onClick : undefined} disabled={disabled} style={{ ...base, ...variants[variant], ...sizes[size], ...sx }}>{children}</button>;
}
