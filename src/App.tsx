import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useParams, Navigate, useLocation } from "react-router-dom";
import LocaleLayout from "@/app/_locale/layout";
import LandingPage from "@/app/_locale/page";
import ResultPage from "@/app/_locale/calculator/result/page";
import CommunityPage from "@/app/_locale/community/page";
import PostDetailPage from "@/app/_locale/community/[id]/page";
import LoginPage from "@/app/_locale/login/page";
import MyInfoPage from "@/app/_locale/myinfo/page";
import WritePage from "@/app/_locale/community/write/page";
import { useLang } from "@/hooks/use-lang";
import { calculateCompensation } from "@/lib/calculator/engine";
import { onAuthStateChange, getSession } from "@/api/auth";
import { sendComplaintEmail } from "@/api/emails";

function AppContent() {
  const { locale } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, t, setLang } = useLang();
  
  const [user, setUser] = useState<any>(null);
  const [savedResult, setSavedResult] = useState<any>(null);
  const [savedInput, setSavedInput] = useState<any>(null);
  const [isFromHistory, setIsFromHistory] = useState(false);
  const [savedCalcId, setSavedCalcId] = useState<string | null>(null);
  const [currentPost, setCurrentPost] = useState<any>(null);
  const [sharedCalculation, setSharedCalculation] = useState<any>(null);

  // Dynamic Title
  useEffect(() => {
    if (t.tabTitle) {
      document.title = `FlyRefund | ${t.tabTitle}`;
    }
  }, [lang, t.tabTitle]);

  // Auth synchronization
  useEffect(() => {
    // Initial session check
    getSession().then(({ session }) => {
      setUser(session?.user ?? null);
    });

    // Listen for changes
    const subscription = onAuthStateChange((session) => {
      setUser(session?.user ?? null);
      if (session?.user && location.pathname.includes("/login")) {
        navigate(`/${lang}/myinfo`);
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
    navigate(`/${lang}/calculator/result`);
  };

  const handleCalcSaved = (id: string) => {
    setSavedCalcId(id);
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
    setSharedCalculation({
      input_data: savedInput,
      result_data: {
        amount: savedResult.amount,
        currency: savedResult.currency,
        regulation: savedResult.regulation
      }
    });
    navigate(user ? `/${lang}/community/write` : `/${lang}/login`);
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
    navigate(newPath);
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
        <Route path="/" element={<LandingPage user={user} t={t} locale={lang} onCalculate={handleCalculate} onLogin={() => navigate(`/${lang}/login`)} onLocaleChange={handleLocaleChange} savedResult={savedResult} />} />
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
            onLogin={() => navigate(`/${lang}/login`)} 
            onShare={handleShareFromResult} 
          />
        } />
        
        {/* Community Routes - Specific order to avoid parameter collisions */}
        <Route path="/community" element={<CommunityPage t={t} locale={lang} onLocaleChange={handleLocaleChange} onWrite={() => navigate(user ? `/${lang}/community/write` : `/${lang}/login`)} onPostClick={(post) => { setCurrentPost(post); navigate(`/${lang}/community/${post.id}`); }} />} />
        <Route path="/community/write" element={<WritePage user={user} t={t} locale={lang} sharedData={sharedCalculation} onLocaleChange={handleLocaleChange} onBack={() => navigate(-1)} onDone={() => { setSharedCalculation(null); navigate(`/${lang}/community`); }} />} />
        <Route path="/community/:id/edit" element={<WritePage user={user} t={t} locale={lang} sharedData={sharedCalculation} onLocaleChange={handleLocaleChange} onBack={() => navigate(-1)} onDone={() => { setSharedCalculation(null); navigate(-1); }} />} />
        <Route path="/community/:id" element={<PostDetailPage user={user} t={t} post={currentPost} locale={lang} onBack={() => navigate(-1)} onLocaleChange={handleLocaleChange} onEditPost={handleEditPost} />} />

        <Route path="/login" element={<LoginPage t={t} locale={lang} onLocaleChange={handleLocaleChange} onBack={() => navigate(-1)} onDone={() => navigate(`/${lang}/myinfo`)} />} />
        <Route path="/myinfo" element={<MyInfoPage user={user} t={t} locale={lang} onLocaleChange={handleLocaleChange} onLogin={() => navigate(`/${lang}/login`)} onHistoryClick={handleHistoryClick} onShare={handleShare} onPurchaseClick={handlePurchaseClick} />} />
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
