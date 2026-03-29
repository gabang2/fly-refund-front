import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Btn } from "@/components/ui/button";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { C } from "@/lib/constants";
import { signInWithGoogle } from "@/api/auth";

interface LoginPageProps {
  t: any;
  locale: string;
  onLocaleChange: (l: string) => void;
  onBack: () => void;
  onDone: () => void;
}

export default function LoginPage({ t, locale, onLocaleChange, onBack, onDone }: LoginPageProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg("");
    const { error } = await signInWithGoogle();
    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.surface }}>
      <div style={{ background: C.bg }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: C.accent, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>←</button>
          <LocaleSwitcher currentLocale={locale} onLocaleChange={onLocaleChange} />
        </div>
        <div style={{ height: 1, background: C.border }} />
      </div>
      <div style={{ padding: "60px 24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontSize: 50, marginBottom: 16 }}>✈</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: C.textPrimary, marginBottom: 8 }}>{t.appName}</div>
        <div style={{ fontSize: 14, color: C.textSecondary, marginBottom: 40, textAlign: "center" }}>{t.heroSub}</div>
        
        <Card style={{ width: "100%", padding: 32, display: "flex", flexDirection: "column", gap: 24, alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.textPrimary, marginBottom: 8 }}>{t.loginTitle}</div>
            <div style={{ fontSize: 14, color: C.textSecondary }}>{t.loginBenefitsTitle || "로그인하고 모든 혜택을 누리세요"}</div>
          </div>
          
          <Btn 
            onClick={handleGoogleLogin} 
            disabled={loading} 
            variant="outline"
            sx={{ 
              width: "100%", 
              height: 54,
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: 12,
              fontSize: 16,
              fontWeight: 600,
              color: C.textPrimary,
              borderColor: C.border,
              borderRadius: 12,
              background: "#fff"
            }}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20" height="20" alt="Google" />
            {loading ? "..." : (t.googleBtn || "Google로 계속하기")}
          </Btn>

          {errorMsg && <div style={{ color: "red", fontSize: 13, textAlign: "center" }}>{errorMsg}</div>}
          
          <div style={{ fontSize: 12, color: C.textSecondary, textAlign: "center", lineHeight: 1.5 }}>
            {t.loginDisclaimer || "로그인 시 이용약관 및 개인정보처리방침에 동의하게 됩니다."}
          </div>
        </Card>
      </div>
    </div>
  );
}
