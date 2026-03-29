import React from "react";
import { useNavigate } from "react-router-dom";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { SavedBanner } from "@/components/ui/saved-banner";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { C } from "@/lib/constants";

interface PageProps {
  user?: any;
  t: any;
  locale: string;
  onCalculate: (data: any) => void;
  onLogin: () => void;
  onLocaleChange: (l: string) => void;
  savedResult?: any;
}

export default function LandingPage({ user, t, locale, onCalculate, onLogin, onLocaleChange, savedResult }: PageProps) {
  const navigate = useNavigate();

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div style={{ background: C.bg }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px" }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: C.textPrimary, whiteSpace: "nowrap" }}>{t.appName}</span>
          <LocaleSwitcher currentLocale={locale} onLocaleChange={onLocaleChange} />
        </div>
        <div style={{ height: 1, background: C.border }} />
      </div>
      <div style={{ padding: "20px 20px 0" }}>
        <p style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary, margin: 0, lineHeight: 1.4 }}>{t.hero1}</p>
        <p style={{ fontSize: 22, fontWeight: 700, color: C.accent, margin: "0 0 6px" }}>{t.hero2}</p>
        <p style={{ fontSize: 13, color: C.textSecondary, margin: 0 }}>{t.heroSub}</p>
      </div>
      <div style={{ padding: "16px 20px 100px", display: "flex", flexDirection: "column", gap: 12 }}>
        <CalculatorForm t={t} locale={locale} onCalculate={onCalculate} savedResult={savedResult} />
        {savedResult && <SavedBanner text={t.savedBanner.replace("{dep}", savedResult.dep).replace("{arr}", savedResult.arr)} />}
      </div>
    </div>
  );
}
