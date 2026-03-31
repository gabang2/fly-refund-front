import React, { useState, useEffect } from "react";
import { Btn } from "@/components/ui/button";
import { C } from "@/lib/constants";
import { createPost, updatePost } from "@/api/posts";
import { CalcSummaryCard } from "@/components/community/calc-summary-card";

interface WritePageProps {
  user: any;
  t: any;
  locale: string;
  sharedData?: any; // { input_data, result_data, id? } - id가 있으면 수정 모드
  onLocaleChange: (l: string) => void;
  onBack: () => void;
  onDone: () => void;
}

export default function WritePage({ user, t, locale, sharedData, onLocaleChange, onBack, onDone }: WritePageProps) {
  const isKr = locale === 'kr';
  
  // 규정 이름 지역화 매핑
  const getLocalizedReg = (reg?: string) => {
    if (!reg) return "";
    if (!isKr) return reg;
    const map: any = {
      "MOLIT (Korea)": "한국 소비자분쟁해결기준 (공정거래위원회)",
      "EU261": "EU261 (유럽 보상 규정)",
      "US DOT": "미국 교통부 (US DOT) 규정",
      "UK261": "UK261 (영국 보상 규정)",
      "APPR (Canada)": "캐나다 APPR 규정",
      "GACA (Saudi)": "사우디 GACA 규정"
    };
    return map[reg] || reg;
  };

  const getAutoTitle = () => {
    if (!sharedData || sharedData.id) return sharedData?.title || ""; // 수정 모드면 기존 제목
    const airline = sharedData.input_data?.airline;
    const airlineName = isKr ? (airline?.name_kr || airline?.name_en) : (airline?.name_en || airline?.name_kr);
    const amount = sharedData.result_data?.amount ? `${sharedData.result_data?.currency}${sharedData.result_data?.amount?.toLocaleString()}` : "";
    const route = `${sharedData.input_data?.dep}→${sharedData.input_data?.arr}`;

    if (isKr) return `${airlineName} ${route} 취소로 ${amount} 보상받았습니다!`;
    return `Got ${amount} from ${airlineName} for my ${route} flight!`;
  };

  const [title, setTitle] = useState(getAutoTitle());
  const [content, setContent] = useState(sharedData?.content || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !user || !content) return;
    setLoading(true);
    
    const airline = sharedData?.input_data?.airline;
    const airlineName = typeof airline === 'object' 
      ? (isKr ? (airline.name_kr || airline.name_en) : (airline.name_en || airline.name_kr))
      : (sharedData?.input_data?.airlineName || airline || "");
    const route = sharedData?.input_data ? `${sharedData.input_data.dep}→${sharedData.input_data.arr}` : (sharedData?.route || "");

    const postData: any = {
      author_id: user.id,
      title,
      content,
      airline: airlineName,
      route,
      locale,
      success: !!sharedData?.result_data?.amount || sharedData?.success,
      amt: sharedData?.result_data?.amount ? `${sharedData.result_data.currency}${sharedData.result_data.amount.toLocaleString()}` : (sharedData?.amt || undefined),
      result_data: sharedData?.result_data || undefined,
    };

    const { error } = sharedData?.id 
      ? await updatePost(sharedData.id, postData)
      : await createPost(postData);

    if (!error) {
      onDone();
    } else {
      alert(error.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#fff" }}>
      <div style={{ background: "#fff", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: C.textSecondary, fontSize: 15, cursor: "pointer" }}>{t.back || "취소"}</button>
          <span style={{ fontSize: 16, fontWeight: 700 }}>{sharedData?.id ? (isKr ? '글 수정' : 'Edit Post') : (t.writeBtn || "글쓰기")}</span>
          <Btn onClick={handleSubmit} disabled={loading || !title || !content} size="sm" sx={{ borderRadius: 20, padding: "0 16px", height: 32, fontSize: 14 }}>
            {loading ? "..." : (sharedData?.id ? (isKr ? '수정' : 'Update') : (t.postSubmit || "등록"))}
          </Btn>
        </div>
        <div style={{ height: 1, background: "#f5f5f5" }} />
      </div>

      <div style={{ padding: "24px 20px", display: "flex", flexDirection: "column" }}>

        <input 
          placeholder={t.postTitlePh || "제목을 입력하세요"}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", border: "none", fontSize: 22, fontWeight: 800, outline: "none", color: C.textPrimary, padding: "0 0 16px 0" }}
        />

        {sharedData && (sharedData.input_data || sharedData.amt) && (
          <div style={{ marginBottom: 24 }}>
            <CalcSummaryCard
              regulation={sharedData.result_data?.regulation || sharedData.regulation}
              amt={sharedData.result_data?.amount
                ? `${sharedData.result_data.currency}${sharedData.result_data.amount.toLocaleString()}`
                : sharedData.amt}
              route={`${sharedData.input_data?.dep || sharedData.route?.split('→')[0]} → ${sharedData.input_data?.arr || sharedData.route?.split('→')[1]}`}
              locale={locale}
            />
          </div>
        )}

        <textarea 
          placeholder={t.postContentPh || "이곳에 후기를 자유롭게 남겨주세요."}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: "100%", minHeight: "50vh", border: "none", fontSize: 16, lineHeight: 1.8, outline: "none", resize: "none", padding: 0, color: "#333" }}
        />
      </div>
    </div>
  );
}
