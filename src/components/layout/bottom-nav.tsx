import React from "react";
import { C } from "@/lib/constants";

interface BottomNavProps {
  active: number;
  onTab: (idx: number) => void;
  labels: { home: string; community: string; myInfo: string };
}

function PlaneIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22l-4-9-9-4 19-7z" />
    </svg>
  );
}

function ChatIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function PersonIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function BottomNav({ active, onTab, labels }: BottomNavProps) {
  const tabs = [
    { icon: PlaneIcon, label: labels?.home || "홈" },
    { icon: ChatIcon, label: labels?.community || "커뮤니티" },
    { icon: PersonIcon, label: labels?.myInfo || "내정보" },
  ];

  return (
    <div style={{ 
      height: "100%",
      minHeight: 72, 
      paddingBottom: "env(safe-area-inset-bottom)", 
      background: C.bg, 
      display: "flex", 
      alignItems: "stretch", 
      flexShrink: 0,
      width: "100%",
    }}>
      {tabs.map((tb, i) => {
        const color = active === i ? C.accent : C.textSecondary;
        const Icon = tb.icon;
        return (
          <button 
            key={i} 
            onClick={() => onTab(i)} 
            style={{ 
              flex: 1, 
              background: "none", 
              border: "none", 
              cursor: "pointer", 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              justifyContent: "center",
              gap: 4,
              padding: "4px 0"
            }}
          >
            <div style={{ height: 24, display: 'flex', alignItems: 'center' }}>
              <Icon color={color} />
            </div>
            <span style={{ fontSize: 10, fontWeight: active === i ? 600 : 400, color, transition: "color 0.2s" }}>{tb.label}</span>
          </button>
        );
      })}
    </div>
  );
}
