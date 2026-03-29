import { useState, useCallback, useMemo } from "react";
import kr from "@/messages/kr.json";
import en from "@/messages/en.json";

const translations: any = { kr, en };

export function useLang() {
  const [lang, setLang] = useState("kr");

  const t = useMemo(() => translations[lang] || translations["kr"], [lang]);
  
  const handleLocaleChange = useCallback((newLang: string) => {
    const validLangs = ["kr", "en"];
    if (validLangs.includes(newLang)) {
      setLang(newLang);
    }
  }, []);

  return { lang, t, setLang: handleLocaleChange };
}
