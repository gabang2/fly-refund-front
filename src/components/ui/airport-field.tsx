import React, { useState, useRef, useEffect } from "react";
import { C } from "@/lib/constants";
import { searchAirports, AirportInfo } from "@/lib/calculator/airports";

interface AirportFieldProps {
  label: string;
  placeholder: string;
  value: string;           // IATA code
  onChange: (iata: string) => void;
  locale: string;
  errorMsg: string;
}

export function AirportField({ label, placeholder, value, onChange, locale, errorMsg }: AirportFieldProps) {
  const [query, setQuery] = useState(value ? formatDisplay(value, locale) : "");
  const [results, setResults] = useState<AirportInfo[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(!!value);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부에서 value 변경 시 동기화
  useEffect(() => {
    if (!value) { setQuery(""); setConfirmed(false); }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function formatDisplay(iata: string, loc: string): string {
    const results = searchAirports(iata, loc);
    const found = results.find(a => a.iata === iata.toUpperCase());
    if (!found) return iata.toUpperCase();
    return loc === 'kr'
      ? `${found.iata} — ${found.cityKr}`
      : `${found.iata} — ${found.city}`;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);
    setConfirmed(false);
    onChange(""); // 직접 입력 중에는 iata 초기화
    const found = searchAirports(v, locale);
    setResults(found);
    setIsOpen(found.length > 0);
  };

  const handleSelect = (airport: AirportInfo) => {
    const display = locale === 'kr'
      ? `${airport.iata} — ${airport.cityKr}`
      : `${airport.iata} — ${airport.city}`;
    setQuery(display);
    onChange(airport.iata);
    setConfirmed(true);
    setIsOpen(false);
    setResults([]);
  };

  const isError = query.length > 0 && !confirmed;
  const borderColor = isError ? C.warn : C.border;

  return (
    <div ref={dropdownRef} style={{ display: "flex", flexDirection: "column", gap: 6, position: "relative" }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: C.textSecondary }}>{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        onFocus={() => { if (results.length > 0) setIsOpen(true); }}
        style={{
          height: 44,
          border: `1px solid ${borderColor}`,
          borderRadius: 8,
          padding: "0 14px",
          fontSize: 14,
          color: C.textPrimary,
          background: C.bg,
          outline: "none",
          boxSizing: "border-box",
          width: "100%",
        }}
      />
      {isOpen && results.length > 0 && (
        <div style={{
          position: "absolute", top: "calc(100% - 4px)", left: 0, right: 0, zIndex: 100,
          background: C.bg, border: `1px solid ${C.border}`,
          borderRadius: "0 0 8px 8px", maxHeight: 220, overflowY: "auto",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}>
          {results.map(a => (
            <div
              key={a.iata}
              onClick={() => handleSelect(a)}
              style={{ padding: "10px 14px", cursor: "pointer", borderBottom: `1px solid ${C.border}` }}
              onMouseOver={(e) => (e.currentTarget.style.background = C.accentLight)}
              onMouseOut={(e) => (e.currentTarget.style.background = C.bg)}
            >
              <span style={{ fontWeight: 600, fontSize: 13, color: C.accent }}>{a.iata}</span>
              <span style={{ fontSize: 13, color: C.textPrimary, marginLeft: 8 }}>
                {locale === 'kr' ? a.cityKr : a.city}
              </span>
              <span style={{ fontSize: 11, color: C.textSecondary, marginLeft: 6 }}>
                {a.name}
              </span>
            </div>
          ))}
        </div>
      )}
      {isError && (
        <span style={{ fontSize: 10, color: C.warn }}>{errorMsg}</span>
      )}
    </div>
  );
}
