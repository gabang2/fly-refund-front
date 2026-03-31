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
  const NAV_HEIGHT = 72;
  const bottomPadding = `calc(${NAV_HEIGHT}px + env(safe-area-inset-bottom))`;

  return (
    <div style={{ 
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex", 
      justifyContent: "center", 
      background: "#E2DDD7",
      overflow: "hidden"
    }}>
      <div style={{ 
        width: "min(430px, 100vw)", 
        height: "100%", 
        display: "flex", 
        flexDirection: "column", 
        background: C.surface, 
        boxShadow: "0 0 40px rgba(0,0,0,.12)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Scrollable Center Content */}
        <div style={{ 
          flex: 1, 
          overflowY: "auto", 
          WebkitOverflowScrolling: "touch",
          background: C.surface,
          overscrollBehavior: "contain",
          width: "100%",
          paddingBottom: bottomPadding, // Reserve space for the absolute nav
        }}>
          {children}
        </div>

        {/* Navigation Bar: Absolute positioned at the bottom of the container */}
        <div style={{ 
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: bottomPadding,
          zIndex: 9999, // Ensure it's on top of everything
          background: C.bg,
          borderTop: `1px solid ${C.border}`,
          boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
        }}>
          <BottomNav active={activeTab} onTab={onTabChange} labels={{ home: t.navHome || "홈", community: t.navCommunity || "커뮤니티", myInfo: t.navMyInfo || "내정보" }} />
        </div>
      </div>
    </div>
  );
}
