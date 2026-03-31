import React, { useState, useEffect } from "react";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}
import { BrowserRouter, Routes, Route, useNavigate, useParams, Navigate, useLocation } from "react-router-dom";
import LocaleLayout from "@/app/_locale/layout";
import LandingPage from "@/app/_locale/page";
import ResultPage from "@/app/_locale/calculator/result/page";
import CommunityPage from "@/app/_locale/community/page";
import PostDetailPage from "@/app/_locale/community/[id]/page";
import LoginPage from "@/app/_locale/login/page";
import MyInfoPage from "@/app/_locale/myinfo/page";
import WritePage from "@/app/_locale/community/write/page";
import PrivacyPage from "@/app/_locale/privacy/page";
import TermsPage from "@/app/_locale/terms/page";
import { useLang } from "@/hooks/use-lang";
import { calculateCompensation } from "@/lib/calculator/engine";
import { onAuthStateChange, getSession, setAfterLoginRedirect, popAfterLoginRedirect } from "@/api/auth";
import { getProfile, updateProfile } from "@/api/profiles";
import { generateNickname } from "@/lib/nickname";
import { sendComplaintEmail } from "@/api/emails";
import { trackEvent } from "@/lib/analytics";

function AppContent() {
  const { locale } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, t, setLang } = useLang();
  
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [savedResult, setSavedResult] = useState<any>(() => {
    try { return JSON.parse(sessionStorage.getItem('flyrefund_pending_result') || 'null'); } catch { return null; }
  });
  const [savedInput, setSavedInput] = useState<any>(() => {
    try { return JSON.parse(sessionStorage.getItem('flyrefund_pending_input') || 'null'); } catch { return null; }
  });
  const [isFromHistory, setIsFromHistory] = useState(false);
  const [savedCalcId, setSavedCalcId] = useState<string | null>(null);
  const [currentPost, setCurrentPost] = useState<any>(null);
  const [sharedCalculation, setSharedCalculation] = useState<any>(() => {
    try { return JSON.parse(sessionStorage.getItem('flyrefund_shared_calc') || 'null'); } catch { return null; }
  });

  // GA4 페이지뷰 추적
  useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  // Dynamic Title
  useEffect(() => {
    if (t.tabTitle) {
      document.title = `FlyRefund | ${t.tabTitle}`;
    }
  }, [lang, t.tabTitle]);

  // 로그인한 유저의 프로필 조회 및 닉네임 자동 생성
  const syncProfile = async (authUser: any) => {
    if (!authUser) { setUserProfile(null); return; }
    const { data } = await getProfile(authUser.id);
    if (data?.full_name) {
      setUserProfile(data);
    } else {
      const nickname = generateNickname();
      const { data: created } = await updateProfile({ id: authUser.id, full_name: nickname, email: authUser.email });
      setUserProfile(created ?? { id: authUser.id, full_name: nickname, email: authUser.email });
    }
  };

  // Auth synchronization
  useEffect(() => {
    // Initial session check
    getSession().then(({ session }) => {
      setUser(session?.user ?? null);
      syncProfile(session?.user ?? null);
    });

    // Listen for changes
    const subscription = onAuthStateChange((session) => {
      setUser(session?.user ?? null);
      syncProfile(session?.user ?? null);
      if (session?.user) {
        const redirectTo = popAfterLoginRedirect();
        if (redirectTo) {
          navigate(redirectTo);
        } else if (location.pathname.includes("/login")) {
          navigate(`/${lang}/myinfo`);
        }
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [lang, navigate, location.pathname]);

  useEffect(() => {
    const validLangs = ["kr", "en"];
    if (locale && validLangs.includes(locale) && locale !== lang) {
      setLang(locale);
    }
  }, [locale, lang, setLang]);

  const handleCalculate = (data: any) => {
    const result = calculateCompensation({ ...data, lang });
    setSavedResult(result);
    setSavedInput(data);
    setIsFromHistory(false);
    setSavedCalcId(null);
    trackEvent("calculate_submit", {
      airline: data.airline,
      reason: data.reason,
      regulation: result.regulation,
      amount: result.amount,
      currency: result.currency,
    });
    // OAuth 새로고침 대비 sessionStorage에 임시 저장
    sessionStorage.setItem('flyrefund_pending_result', JSON.stringify(result));
    sessionStorage.setItem('flyrefund_pending_input', JSON.stringify(data));
    navigate(`/${lang}/calculator/result`);
  };

  const handleCalcSaved = (id: string) => {
    setSavedCalcId(id);
    sessionStorage.removeItem('flyrefund_pending_result');
    sessionStorage.removeItem('flyrefund_pending_input');
    // URL에 calc_id를 추가하여 새로고침 대비
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('calc_id', id);
    navigate({
      pathname: location.pathname,
      search: searchParams.toString()
    }, { replace: true });
  };

  const handleHistoryClick = (calc: any) => {
    const input = calc.input_data;
    if (!input?.airline || !input?.dep || !input?.arr) return;
    const result = calculateCompensation({ ...input, lang });
    setSavedResult(result);
    setSavedInput(input);
    setIsFromHistory(true);
    setSavedCalcId(calc.id ?? null);
    // URL에 calc_id 포함
    navigate(`/${lang}/calculator/result?calc_id=${calc.id}`);
  };

  const handlePurchaseClick = (purchase: any) => {
    const input = purchase.extra_data?.calc_input;
    if (!input) {
      // 만약 입력 데이터가 없으면 calc_id로 조회하도록 유도
      navigate(`/${lang}/calculator/result?calc_id=${purchase.calc_id}`);
      return;
    }
    const result = calculateCompensation({ ...input, lang });
    setSavedResult(result);
    setSavedInput(input);
    setIsFromHistory(true);
    setSavedCalcId(purchase.calc_id ?? null);
    // URL에 calc_id 포함
    navigate(`/${lang}/calculator/result?calc_id=${purchase.calc_id}`);
  };

  const handleShareFromResult = () => {
    if (!savedResult || !savedInput) return;
    const calc = {
      input_data: savedInput,
      result_data: {
        amount: savedResult.amount,
        currency: savedResult.currency,
        regulation: savedResult.regulation
      }
    };
    setSharedCalculation(calc);
    sessionStorage.setItem('flyrefund_shared_calc', JSON.stringify(calc));
    trackEvent("share_result", {
      regulation: savedResult.regulation,
      amount: savedResult.amount,
      currency: savedResult.currency,
    });
    if (user) {
      navigate(`/${lang}/community/write`);
    } else {
      setAfterLoginRedirect(`/${lang}/community/write`);
      navigate(`/${lang}/login`);
    }
  };

  const handleShare = (calc: any) => {
    setSharedCalculation({
      input_data: calc.input_data,
      result_data: calc.result_data
    });
    navigate(`/${lang}/community/write`);
  };

  const handleEditPost = (post: any) => {
    setSharedCalculation(post);
    navigate(`/${lang}/community/${post.id}/edit`);
  };

  const handleLocaleChange = (newLang: string) => {
    const newPath = location.pathname.replace(`/${lang}`, `/${newLang}`);
    setLang(newLang);
    navigate({ pathname: newPath, search: location.search });
  };

  const handleAction = async (type: string) => {
    if (type === "email") {
      if (!user) {
        navigate(`/${lang}/login`);
        return;
      }
      if (!savedResult) return;

      const { error } = await sendComplaintEmail({
        user_id: user.id,
        recipient_email: "complaints@airline.com",
        subject: `[Claim] Flight ${savedResult.airlineName} (${savedResult.dep}→${savedResult.arr})`,
        content: `Compensation claim for flight ${savedResult.airlineName} under ${savedResult.regulation}. Amount: ${savedResult.currency}${savedResult.amount}`,
      });

      if (!error) {
        alert(lang === "kr" ? "항의 이메일이 발송되었습니다 (시뮬레이션)" : "Complaint email sent (simulation)");
      } else {
        alert(error.message);
      }
    }
  };

  const getActiveTab = () => {
    if (location.pathname.includes("/community")) return 1;
    if (location.pathname.includes("/myinfo")) return 2;
    return 0;
  };

  const queryParams = new URLSearchParams(location.search);
  const urlCalcId = queryParams.get('calc_id');

  return (
    <LocaleLayout 
      params={{ locale: lang }} 
      activeTab={getActiveTab()} 
      onTabChange={(idx) => {
        if (idx === 0) navigate(`/${lang}`);
        if (idx === 1) navigate(`/${lang}/community`);
        if (idx === 2) navigate(`/${lang}/myinfo`);
      }}
      t={t}
    >
      <Routes>
        <Route path="/" element={<LandingPage user={user} t={t} locale={lang} onCalculate={handleCalculate} onLogin={() => navigate(`/${lang}/login`)} onLocaleChange={handleLocaleChange} savedResult={savedResult} savedInput={savedInput} />} />
        <Route path="/calculator/result" element={
          <ResultPage 
            user={user} 
            t={t} 
            result={savedResult} 
            input={savedInput} 
            setResult={setSavedResult}
            setInput={setSavedInput}
            isFromHistory={isFromHistory} 
            calcId={urlCalcId || savedCalcId} 
            locale={lang} 
            onBack={() => navigate(-1)} 
            onLocaleChange={handleLocaleChange} 
            onCalcSaved={handleCalcSaved} 
            onLogin={() => {
              setAfterLoginRedirect(location.pathname + location.search);
              navigate(`/${lang}/login`);
            }}
            onShare={handleShareFromResult}
          />
        } />
        
        {/* Community Routes - Specific order to avoid parameter collisions */}
        <Route path="/community" element={<CommunityPage t={t} locale={lang} onLocaleChange={handleLocaleChange} onWrite={() => navigate(user ? `/${lang}/community/write` : `/${lang}/login`)} onPostClick={(post) => { setCurrentPost(post); navigate(`/${lang}/community/${post.id}`); }} />} />
        <Route path="/community/write" element={<WritePage user={user} t={t} locale={lang} sharedData={sharedCalculation} onLocaleChange={handleLocaleChange} onBack={() => navigate(-1)} onDone={() => { setSharedCalculation(null); sessionStorage.removeItem('flyrefund_shared_calc'); navigate(`/${lang}/community`); }} />} />
        <Route path="/community/:id/edit" element={<WritePage user={user} t={t} locale={lang} sharedData={sharedCalculation} onLocaleChange={handleLocaleChange} onBack={() => navigate(-1)} onDone={() => { setSharedCalculation(null); navigate(-1); }} />} />
        <Route path="/community/:id" element={<PostDetailPage user={user} t={t} post={currentPost} locale={lang} onBack={() => navigate(-1)} onLocaleChange={handleLocaleChange} onEditPost={handleEditPost} />} />

        <Route path="/login" element={<LoginPage t={t} locale={lang} onLocaleChange={handleLocaleChange} onBack={() => navigate(-1)} onDone={() => navigate(`/${lang}/myinfo`)} />} />
        <Route path="/myinfo" element={<MyInfoPage user={user} profile={userProfile} t={t} locale={lang} onLocaleChange={handleLocaleChange} onLogin={() => navigate(`/${lang}/login`)} onHistoryClick={handleHistoryClick} onShare={handleShare} onPurchaseClick={handlePurchaseClick} />} />
        <Route path="/privacy" element={<PrivacyPage locale={lang} onBack={() => navigate(-1)} />} />
        <Route path="/terms" element={<TermsPage locale={lang} onBack={() => navigate(-1)} />} />
      </Routes>
    </LocaleLayout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Preserve search and hash during root redirect for auth callback support */}
        <Route 
          path="/" 
          element={<Navigate to={`/kr${window.location.search}${window.location.hash}`} replace />} 
        />
        <Route path="/:locale/*" element={<AppContent />} />
        <Route path="*" element={<Navigate to="/kr" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
