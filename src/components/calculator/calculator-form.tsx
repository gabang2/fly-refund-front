import React, { useState, useEffect, useRef } from "react";
import { AirportField } from "@/components/ui/airport-field";
import { Chip } from "@/components/ui/chip";
import { Btn } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { C } from "@/lib/constants";
import { getAirlines, Airline } from "@/api/airlines";
import type { ReasonKey, TimingKey, TicketCurrency } from "@/lib/calculator/engine";

const CURRENCIES: { value: TicketCurrency; label: string }[] = [
  { value: 'KRW', label: '₩ KRW' },
  { value: 'USD', label: '$ USD' },
  { value: 'EUR', label: '€ EUR' },
  { value: 'JPY', label: '¥ JPY' },
  { value: 'GBP', label: '£ GBP' },
  { value: 'CNY', label: '¥ CNY' },
  { value: 'CAD', label: 'CA$ CAD' },
  { value: 'AUD', label: 'A$ AUD' },
  { value: 'SGD', label: 'S$ SGD' },
  { value: 'THB', label: '฿ THB' },
];

const REASON_KEYS: ReasonKey[] = ['airline_fault', 'weather', 'extraordinary'];
const TIMING_KEYS: TimingKey[] = ['under7days', '7to14days', 'over14days'];

interface CalculatorFormProps {
  t: any;
  locale: string;
  onCalculate: (data: any) => void;
  savedResult?: any;
}

export function CalculatorForm({ t, locale, onCalculate, savedResult }: CalculatorFormProps) {
  const [dep, setDep] = useState(savedResult?.dep || "");
  const [arr, setArr] = useState(savedResult?.arr || "");
  const [selectedAirline, setSelectedAirline] = useState<Airline | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [reasonIdx, setReasonIdx] = useState(-1);
  const [timingIdx, setTimingIdx] = useState(-1);
  const [flightDate, setFlightDate] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [ticketCurrency, setTicketCurrency] = useState<TicketCurrency>('KRW');
  const [airlineList, setAirlineList] = useState<Airline[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getAirlines().then(({ data, error }) => {
      if (!error && data) {
        setAirlineList(data);
        const savedAirline = savedResult?.airline;
        if (savedAirline) {
          const savedId = typeof savedAirline === 'object' ? savedAirline.id : Number(savedAirline);
          const found = data.find((a: Airline) => a.id === savedId);
          if (found) {
            setSelectedAirline(found);
            setSearchTerm(locale === "kr" ? found.name_kr : found.name_en);
          }
        }
      }
    });

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [locale, savedResult]);

  const getAirlineName = (a: Airline) => locale === "kr" ? a.name_kr : a.name_en;

  const filteredAirlines = airlineList.filter(a => {
    const name = (getAirlineName(a) || "").toLowerCase();
    const search = String(searchTerm || "").toLowerCase();
    return name.includes(search);
  });

  const handleSelectAirline = (a: Airline) => {
    setSelectedAirline(a);
    setSearchTerm(getAirlineName(a));
    setIsOpen(false);
  };

  const isValidAirline = !!selectedAirline && getAirlineName(selectedAirline) === searchTerm;
  const isValidDep = dep.length === 3;
  const isValidArr = arr.length === 3;
  const isReasonSelected = reasonIdx >= 0;
  const isTimingSelected = timingIdx >= 0;
  const canSubmit = isValidAirline && isValidDep && isValidArr && isReasonSelected && isTimingSelected;

  const handleSubmit = () => {
    if (!canSubmit || !selectedAirline || reasonIdx < 0 || timingIdx < 0) return;
    
    // 콤마 제거 후 숫자로 변환
    const numericPrice = ticketPrice.replace(/,/g, "");
    
    onCalculate({
      dep,
      arr,
      airline: selectedAirline,
      reason: REASON_KEYS[reasonIdx],
      timing: TIMING_KEYS[timingIdx],
      flightDate: flightDate || undefined,
      ticketPrice: numericPrice ? Number(numericPrice) : undefined,
      ticketCurrency,
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) {
      setTicketPrice("");
      return;
    }

    // 숫자와 소수점만 허용
    let clean = val.replace(/[^0-9.]/g, "");
    
    // 소수점이 여러 개 찍히는 것 방지
    const parts = clean.split(".");
    if (parts.length > 2) clean = parts[0] + "." + parts.slice(1).join("");

    // 정수 부분에 콤마 추가
    const finalParts = clean.split(".");
    finalParts[0] = finalParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    setTicketPrice(finalParts.join("."));
  };

  const airportError = locale === 'kr' ? '목록에서 공항을 선택해 주세요.' : 'Please select an airport from the list.';

  return (
    <Card style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
        {t.formTitle}
      </div>

      {/* 출발·도착 공항 자동완성 */}
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <AirportField
            label={t.depLabel}
            placeholder={t.depPh}
            value={dep}
            onChange={setDep}
            locale={locale}
            errorMsg={airportError}
          />
        </div>
        <div style={{ flex: 1 }}>
          <AirportField
            label={t.arrLabel}
            placeholder={t.arrPh}
            value={arr}
            onChange={setArr}
            locale={locale}
            errorMsg={airportError}
          />
        </div>
      </div>
      <div style={{ fontSize: 12, color: C.textSecondary, background: C.accentLight, borderRadius: 8, padding: "8px 12px" }}>
        {t.directFlightNote}
      </div>

      {/* 항공사 드롭다운 */}
      <div ref={dropdownRef} style={{ display: "flex", flexDirection: "column", gap: 6, position: "relative" }}>
        <label style={{ fontSize: 12, fontWeight: 500, color: C.textSecondary }}>{t.airlineLabel}</label>
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder={t.airlinePh}
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setSelectedAirline(null); setIsOpen(true); }}
            onFocus={() => setIsOpen(true)}
            style={{
              width: "100%", height: 44,
              border: `1px solid ${!isValidAirline && searchTerm ? C.warn : C.border}`,
              borderRadius: 8, padding: "0 14px", fontSize: 14,
              color: C.textPrimary, background: C.bg, outline: "none", boxSizing: "border-box",
            }}
          />
          {isOpen && filteredAirlines.length > 0 && (
            <div style={{
              position: "absolute", top: "100%", left: 0, right: 0, zIndex: 100,
              maxHeight: 220, overflowY: "auto", background: C.bg,
              border: `1px solid ${C.border}`, borderRadius: "0 0 8px 8px",
              marginTop: -1, boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}>
              {filteredAirlines.map(a => (
                <div
                  key={a.id}
                  onClick={() => handleSelectAirline(a)}
                  style={{ padding: "10px 14px", fontSize: 14, color: C.textPrimary, cursor: "pointer", borderBottom: `1px solid ${C.border}` }}
                  onMouseOver={(e) => (e.currentTarget.style.background = C.accentLight)}
                  onMouseOut={(e) => (e.currentTarget.style.background = C.bg)}
                >
                  <span style={{ fontWeight: 600, fontSize: 12, color: C.textSecondary, marginRight: 8 }}>
                    {a.code}
                  </span>
                  {getAirlineName(a)}
                </div>
              ))}
            </div>
          )}
        </div>
        {!isValidAirline && searchTerm && (
          <span style={{ fontSize: 10, color: C.warn }}>
            {locale === "kr" ? "유효한 항공사를 선택해주세요." : "Please select a valid airline."}
          </span>
        )}
      </div>

      {/* 취소 사유 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <label style={{ fontSize: 12, fontWeight: 500, color: C.textSecondary }}>{t.reasonLabel}</label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {t.reasons.map((r: string, i: number) => (
            <Chip key={r} label={r} active={reasonIdx === i} onClick={() => setReasonIdx(i)} />
          ))}
        </div>
      </div>

      {/* 취소 통보 시점 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <label style={{ fontSize: 12, fontWeight: 500, color: C.textSecondary }}>{t.timingLabel}</label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {t.timings.map((tm: string, i: number) => (
            <Chip key={tm} label={tm} active={timingIdx === i} onClick={() => setTimingIdx(i)} />
          ))}
        </div>
      </div>

      {/* 항공편 날짜 (선택) */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ fontSize: 12, fontWeight: 500, color: C.textSecondary }}>{t.flightDateLabel}</label>
        <input
          type="date"
          value={flightDate}
          onChange={(e) => setFlightDate(e.target.value)}
          style={{
            height: 44, border: `1px solid ${C.border}`, borderRadius: 8,
            padding: "0 14px", fontSize: 14, color: C.textPrimary,
            background: C.bg, outline: "none", boxSizing: "border-box", width: "100%",
          }}
        />
      </div>

      {/* 티켓 금액 (선택) */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <label style={{ fontSize: 12, fontWeight: 500, color: C.textSecondary }}>{t.ticketPriceLabel}</label>
        <div style={{ display: "flex", gap: 6 }}>
          <select
            value={ticketCurrency}
            onChange={(e) => setTicketCurrency(e.target.value as TicketCurrency)}
            style={{
              height: 44, border: `1px solid ${C.border}`, borderRadius: 8,
              padding: "0 8px", fontSize: 13, color: C.textPrimary,
              background: C.bg, outline: "none", flexShrink: 0, cursor: "pointer",
            }}
          >
            {CURRENCIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder={t.ticketPricePh}
            value={ticketPrice}
            onChange={handlePriceChange}
            style={{
              flex: 1, height: 44, border: `1px solid ${C.border}`, borderRadius: 8,
              padding: "0 14px", fontSize: 14, color: C.textPrimary,
              background: C.bg, outline: "none", boxSizing: "border-box",
            }}
          />
        </div>
        <span style={{ fontSize: 11, color: C.textSecondary }}>{t.ticketPriceNote}</span>
      </div>

      <Btn
        onClick={handleSubmit}
        sx={{
          width: "100%",
          opacity: canSubmit ? 1 : 0.5,
          cursor: canSubmit ? "pointer" : "not-allowed",
        }}
      >
        {t.calcBtn}
      </Btn>
      <p style={{ textAlign: "center", fontSize: 12, color: C.textSecondary, margin: 0 }}>{t.calcSub}</p>
    </Card>
  );
}
