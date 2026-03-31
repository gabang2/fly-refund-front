import React from "react";
import { BottomNav } from "@/components/layout/bottom-nav";
import { C } from "@/lib/constants";

interface LayoutProps {
  children: React.ReactNode;
  params: { locale: string };
  activeTab: number;
  onTabChange: (idx: number) => void;
  t: any;
}

export default function LocaleLayout({ children, params, activeTab, onTabChange, t }: LayoutProps) {
  return (
    <div style={{ 
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Segoe UI', sans-serif", 
      height: "100vh", 
      height: "100dvh",
      width: "100vw",
      display: "flex", 
      justifyContent: "center", 
      background: "#E2DDD7",
      overflow: "hidden", // Keep this to prevent background scroll
      position: "fixed", // Use fixed to ensure it stays in viewport
      top: 0,
      left: 0
    }}>
      <div style={{ 
        width: "min(430px, 100vw)", 
        height: "100%", 
        display: "flex", 
        flexDirection: "column", 
        background: C.surface, 
        boxShadow: "0 0 40px rgba(0,0,0,.12)",
        position: "relative",
        overflow: "hidden" // Ensure children don't bleed out
      }}>
        {/* Scrollable Center Content */}
        <div style={{ 
          flex: 1, 
          overflowY: "auto", 
          WebkitOverflowScrolling: "touch",
          background: C.surface,
          paddingBottom: "calc(80px + env(safe-area-inset-bottom))",
          overscrollBehavior: "contain",
          width: "100%",
          display: "flex",
          flexDirection: "column"
        }}>
          {children}
        </div>

        {/* Fixed Footer: Stays at the bottom of the container */}
        <div style={{ 
          position: "absolute", // Changed from fixed to absolute to be relative to the phone container
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100, 
          background: C.bg,
          borderTop: `1px solid ${C.border}`,
          boxShadow: "0 -2px 10px rgba(0,0,0,0.05)"
        }}>
          <BottomNav active={activeTab} onTab={onTabChange} labels={{ home: t.navHome || "홈", community: t.navCommunity || "커뮤니티", myInfo: t.navMyInfo || "내정보" }} />
        </div>
      </div>
    </div>
  );
}
