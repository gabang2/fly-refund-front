import React, { useEffect, useRef, useState } from "react";
import { PolarEmbedCheckout } from "@polar-sh/checkout/embed";
import { ResultCard } from "@/components/calculator/result-card";
import { Card } from "@/components/ui/card";
import { Btn } from "@/components/ui/button";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { C } from "@/lib/constants";
import { saveCalculation, getCalculationById } from "@/api/calculations";
import { savePurchase, getPurchasesByCalcId, Purchase } from "@/api/purchases";
import { ShareActionCard } from "@/components/ui/share-action-card";
import { supabase } from "@/api/supabaseClient";
import { AnalysisRenderer } from "@/components/calculator/analysis-renderer";
import { AiLoading } from "@/components/ui/ai-loading";

interface ResultPageProps {
  user?: any;
  t: any;
  result: any;
  input: any;
  isFromHistory?: boolean;
  calcId: string | null;
  locale: string;
  onBack: () => void;
  onLocaleChange: (l: string) => void;
  onCalcSaved?: (id: string) => void;
  onLogin: () => void;
  onShare?: () => void;
  setResult?: (res: any) => void;
  setInput?: (input: any) => void;
}

const PRICE_LABEL: Record<string, string> = {
  kr: "₩500",
  en: "$0.50"
};

export default function ResultPage({ 
  user, t, result, input, isFromHistory, calcId, locale, 
  onBack, onLocaleChange, onCalcSaved, onLogin, onShare,
  setResult, setInput 
}: ResultPageProps) {
  const [payingFor, setPayingFor] = useState<'detailed_analysis' | 'email_draft' | null>(null);
  const [paying, setPaying] = useState(false);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const savedRef = useRef(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isKr = locale === 'kr';

  // 데이터 가공 - result에 없는 필드는 input에서 fallback
  const REASON_KEYS = ['airline_fault', 'weather', 'extraordinary'];
  const TIMING_KEYS = ['under7days', '7to14days', 'over14days'];

  const dep = result?.dep ?? input?.dep ?? '';
  const arr = result?.arr ?? input?.arr ?? '';
  const reason = result?.reason ?? input?.reason;
  const reasonText = reason ? (t.reasons[REASON_KEYS.indexOf(reason)] ?? reason) : '';
  const timing = result?.timing ?? input?.timing;
  const timingText = timing ? (t.timings[TIMING_KEYS.indexOf(timing)] ?? timing) : '';
  const airline = result?.airline ?? input?.airline;
  const airlineName = airline
    ? (typeof airline === 'object'
        ? (isKr ? airline?.name_kr : airline?.name_en)
        : result?.airlineName ?? input?.airlineName ?? airline)
    : '';

  const analysisPurchase = purchases.find(p => p.product_type === 'detailed_analysis');
  const emailPurchase = purchases.find(p => p.product_type === 'email_draft');

  // 1. 데이터 복구
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlCalcId = params.get('calc_id');
    const targetId = urlCalcId || calcId;

    if (targetId && (!result || (isFromHistory && !savedRef.current))) {
      setLoading(true);
      getCalculationById(targetId).then(({ data }) => {
        if (data && setResult && setInput) {
          setResult(data.result_data);
          setInput(data.input_data);
        }
        setLoading(false);
      }).catch((e) => {
        console.error("Fetch calc error:", e);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [calcId, result === null]);

  // 2. Initialize Polar
  useEffect(() => {
    PolarEmbedCheckout.init();
  }, []);

  // 3. 결과 저장
  useEffect(() => {
    if (user && result && !savedRef.current && !isFromHistory && !calcId) {
      saveCalculation({
        user_id: user.id,
        input_data: input ?? { dep: result.dep, arr: result.arr, reason: result.reason, timing: result.timing },
        result_data: result,
      }).then(({ data }) => {
        if (data?.id) onCalcSaved?.(data.id);
      });
      savedRef.current = true;
    }
  }, [user, result, input, isFromHistory, calcId, onCalcSaved]);

  // 4. 구매 내역 조회
  useEffect(() => {
    if (user && calcId) {
      getPurchasesByCalcId(calcId).then(({ data }) => {
        if (data) setPurchases(data.filter(p => p.status === 'paid'));
      });
    }
  }, [user, calcId]);

  const isFulfillingRef = useRef(false);

  // 5. 결제 성공 후 처리 (웹훅이 늦을 경우 프론트에서 직접 기록 생성)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get('success') === 'true';
    const productType = params.get('product_type') as any;

    if (success && user && calcId && !isFulfillingRef.current) {
      const fulfillPurchase = async () => {
        isFulfillingRef.current = true;
        setPaying(true);
        console.log("Payment success detected. Verifying or creating purchase record...");

        // 1. 먼저 DB에 이미 있는지 확인 (웹훅이 먼저 처리했을 수 있음)
        const { data: existing } = await getPurchasesByCalcId(calcId);
        const alreadyRecorded = existing?.find(p => p.product_type === productType && p.status === 'paid');

        if (alreadyRecorded) {
          console.log("Purchase already recorded by webhook.");
          setPurchases(existing!.filter(p => p.status === 'paid'));
          setPaying(false);
          isFulfillingRef.current = false;
          const cleanParams2 = new URLSearchParams(window.location.search);
          cleanParams2.delete('success');
          cleanParams2.delete('product_type');
          const cleanSearch2 = cleanParams2.toString();
          window.history.replaceState({}, '', window.location.pathname + (cleanSearch2 ? `?${cleanSearch2}` : ''));
          return;
        }

        // 2. 만약 없다면 프론트엔드에서 직접 생성 (웹훅 대용)
        console.log("No record found. Creating purchase record from frontend...");
        const { data: newRecord, error } = await savePurchase({
          user_id: user.id,
          calc_id: calcId,
          product_type: productType,
          status: 'paid',
          ai_status: 'PROCESSING',
          price_label: isKr ? "₩500" : "$0.50",
          extra_data: { source: 'frontend_fallback' }
        });

        if (!error && newRecord) {
          setPurchases(prev => [...prev, newRecord]);
          // AI 처리 트리거
          supabase.functions.invoke('process-ai-result', {
            body: { purchaseId: newRecord.id }
          }).catch(console.error);
        }
        
        setPaying(false);
        isFulfillingRef.current = false;
        // calc_id는 유지하고 success, product_type만 제거
        const cleanParams = new URLSearchParams(window.location.search);
        cleanParams.delete('success');
        cleanParams.delete('product_type');
        const cleanSearch = cleanParams.toString();
        window.history.replaceState({}, '', window.location.pathname + (cleanSearch ? `?${cleanSearch}` : ''));
      };
      fulfillPurchase();
    }
  }, [user, calcId]);

  // 6. AI 처리 상태 폴링 (백엔드에서 비동기 처리 중인 경우)
  useEffect(() => {
    const hasProcessingPurchase = purchases.some(
      p => p.ai_status && !['COMPLETED', 'REFUND'].includes(p.ai_status)
    );

    if (hasProcessingPurchase && calcId) {
      pollingRef.current = setInterval(async () => {
        const { data } = await getPurchasesByCalcId(calcId);
        if (data) {
          setPurchases(data.filter(p => p.status === 'paid'));
          const stillProcessing = data.some(
            p => p.status === 'paid' && p.ai_status && !['COMPLETED', 'REFUND'].includes(p.ai_status)
          );
          if (!stillProcessing && pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
        }
      }, 4000);
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [purchases.map(p => p.ai_status).join(','), calcId]);

  const handlePay = async () => {
    if (!payingFor || !user) return;
    let productId = '';
    if (payingFor === 'detailed_analysis') productId = isKr ? import.meta.env.VITE_POLAR_DETAILED_INFO_PRICE_ID_KR : import.meta.env.VITE_POLAR_DETAILED_INFO_PRICE_ID_US;
    else if (payingFor === 'email_draft') productId = isKr ? import.meta.env.VITE_POLAR_EMAIL_DRAFT_PRICE_ID_KR : import.meta.env.VITE_POLAR_EMAIL_DRAFT_PRICE_ID_US;

    if (!productId) return;
    const successUrl = `${window.location.origin}/${locale}/calculator/result?success=true&product_type=${payingFor}&calc_id=${calcId}`;
    setPaying(true);

    try {
      // 샌드박스 환경에서는 도메인을 sandbox.polar.sh로 명시해야 할 수 있습니다.
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          priceId: productId, 
          successUrl, 
          userId: user.id, 
          calcId, 
          productType: payingFor, 
          customerEmail: user.email,
          isSandbox: true // 샌드박스 플래그 추가
        }
      });
      if (error) throw error;
      window.location.href = data.url;
    } catch (err: any) {
      alert(err.message || "Error");
      setPaying(false);
    }
  };

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: C.bg }}>
      <div style={{ background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.accent, fontSize: 14, fontWeight: 500 }}>{t.resultBack}</button>
        <LocaleSwitcher currentLocale={locale} onLocaleChange={onLocaleChange} />
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: `3px solid ${C.accentLight}`, borderTop: `3px solid ${C.accent}`, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ fontSize: 14, color: C.textSecondary }}>{isKr ? '결과를 분석하고 있습니다...' : 'Analyzing results...'}</p>
        </div>
      </div>
    </div>
  );
  if (!result) return null;

  const priceLabel = PRICE_LABEL[locale] ?? PRICE_LABEL.kr;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
      <div style={{ background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.accent, fontSize: 14, fontWeight: 500 }}>{t.resultBack}</button>
        <LocaleSwitcher currentLocale={locale} onLocaleChange={onLocaleChange} />
      </div>

      <div style={{ padding: '16px 20px 100px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ background: C.accentLight, borderRadius: 8, padding: '10px 16px', fontSize: 13, fontWeight: 500, color: C.accent }}>
          ✈ {dep} → {arr} · {airlineName} · {reasonText}
        </div>

        <ResultCard t={t} result={result} />

        {/* 상세 분석 카드 */}
        <Card style={{ padding: 16 }}>
          {analysisPurchase ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: C.textPrimary }}>{isKr ? '상세 분석 결과' : 'Detailed Analysis'}</div>
                <div style={{ background: C.successLight, color: C.success, fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 100 }}>{isKr ? '결제완료' : 'Paid'}</div>
              </div>
              <div style={{ background: C.surface, borderRadius: 10, padding: 16 }}>
                {analysisPurchase.ai_status === 'REFUND'
                  ? <p style={{ fontSize: 13, color: C.textSecondary, margin: 0 }}>{isKr ? '⚠️ AI 분석 처리 실패로 환불 처리되었습니다.' : '⚠️ AI analysis failed. Refund has been issued.'}</p>
                  : analysisPurchase.ai_status === 'COMPLETED'
                    ? <AnalysisRenderer text={isKr ? analysisPurchase.extra_data?.analysis_kr : analysisPurchase.extra_data?.analysis_en} />
                    : <AiLoading isKr={isKr} />}
              </div>

              {/* 이메일 영역 */}
              <div style={{ marginTop: 14, padding: 14, background: C.accentLight, borderRadius: 10 }}>
                {emailPurchase ? (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                      <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{t.emailResultTitle}</div>
                      <div style={{ background: C.successLight, color: C.success, fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 100 }}>{isKr ? '결제완료' : 'Paid'}</div>
                    </div>
                    <div style={{ background: C.bg, borderRadius: 8, padding: 12, fontSize: 12, lineHeight: 1.7, color: C.textPrimary, whiteSpace: 'pre-wrap' }}>
                      {emailPurchase.ai_status === 'REFUND'
                        ? (isKr ? '⚠️ 이메일 생성 실패로 환불 처리되었습니다.' : '⚠️ Email generation failed. Refund has been issued.')
                        : emailPurchase.ai_status === 'COMPLETED'
                          ? (isKr ? emailPurchase.extra_data?.email_kr : emailPurchase.extra_data?.email_en)
                          : <AiLoading isKr={isKr} />}
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button onClick={() => { navigator.clipboard.writeText(isKr ? emailPurchase.extra_data?.email_kr : emailPurchase.extra_data?.email_en); setCopiedEmail(true); setTimeout(()=>setCopiedEmail(false), 2000); }} style={{ flex: 1, height: 34, background: copiedEmail ? C.successLight : C.bg, border: `1px solid ${C.border}`, borderRadius: 8, color: copiedEmail ? C.success : C.accent, fontSize: 12, fontWeight: 600 }}>{copiedEmail ? t.copiedBtn : t.copyBtn}</button>
                      <button onClick={() => window.open(`mailto:?body=${encodeURIComponent(isKr ? emailPurchase.extra_data?.email_kr : emailPurchase.extra_data?.email_en)}`)} style={{ flex: 1, height: 34, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.textPrimary, fontSize: 12, fontWeight: 600 }}>{t.mailBtn}</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{t.emailTitle}</div><div style={{ fontSize: 11, color: C.textSecondary }}>{t.emailDesc}</div></div>
                    <button onClick={() => user ? setPayingFor('email_draft') : onLogin()} style={{ background: C.accent, color: '#fff', border: 'none', borderRadius: 8, padding: '7px 12px', fontSize: 12, fontWeight: 700 }}>{priceLabel}</button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>{isKr ? '상세 분석 보기' : 'Get Detailed Analysis'}</div><div style={{ fontSize: 12, color: C.textSecondary }}>{isKr ? '보상 가능성 및 청구 절차 분석' : 'Analysis of eligibility & claims'}</div></div>
              <button onClick={() => user ? setPayingFor('detailed_analysis') : onLogin()} style={{ background: C.accent, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 700 }}>{priceLabel}</button>
            </div>
          )}
        </Card>

        <ShareActionCard onShare={onShare || (() => {})} locale={locale} t={t} />
      </div>

      {/* 결제 모달 */}
      {payingFor && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'flex-end' }} onClick={() => !paying && setPayingFor(null)}>
          <div style={{ background: C.bg, borderRadius: '20px 20px 0 0', padding: '28px 24px 40px', width: '100%' }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 40, height: 4, background: C.border, borderRadius: 4, margin: '0 auto 24px' }} />
            <div style={{ fontSize: 18, fontWeight: 700, color: C.textPrimary, marginBottom: 6 }}>{payingFor === 'detailed_analysis' ? (isKr ? '상세 분석' : 'Detailed Analysis') : (isKr ? '이메일 초안 생성' : 'Generate Email Draft')}</div>
            <div style={{ fontSize: 13, color: C.textSecondary, marginBottom: 24 }}>{isKr ? '항공 보상 규정에 따라 사례를 분석합니다.' : 'Your case will be analyzed against aviation regulations.'}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}><span style={{ fontSize: 12, color: C.textSecondary }}>Powered by</span><span style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>Polar</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: C.surface, borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}><span style={{ fontSize: 14, color: C.textPrimary }}>{isKr ? '결제 금액' : 'Total Price'}</span><span style={{ fontSize: 18, fontWeight: 800, color: C.textPrimary }}>{priceLabel}</span></div>
            <Btn onClick={handlePay} disabled={paying} sx={{ width: '100%', marginBottom: 12 }}>{paying ? (isKr ? '처리 중...' : 'Processing...') : (isKr ? `${priceLabel} 결제하기` : `Pay ${priceLabel}`)}</Btn>
            <button onClick={() => !paying && setPayingFor(null)} style={{ width: '100%', height: 44, background: 'none', border: 'none', color: C.textSecondary, fontSize: 14 }}>{isKr ? '취소' : 'Cancel'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
