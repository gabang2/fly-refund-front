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
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", height: "100vh", display: "flex", justifyContent: "center", background: "#e8e8ea" }}>
      <div style={{ width: "min(430px, 100vw)", height: "100vh", display: "flex", flexDirection: "column", background: C.surface, position: "relative", overflow: "hidden", boxShadow: "0 0 40px rgba(0,0,0,.12)" }}>
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
          {children}
        </div>

        <div style={{ width: "min(430px, 100vw)" }}>
          <BottomNav active={activeTab} onTab={onTabChange} labels={{ home: t.navHome, community: t.navCommunity, myInfo: t.navMyInfo }} />
        </div>
      </div>
    </div>
  );
}
