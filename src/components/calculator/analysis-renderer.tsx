import React from "react";
import { C } from "@/lib/constants";

// 섹션 파싱: [섹션명] 기준으로 분리
function parseAnalysis(text: string) {
  const sectionRegex = /\[([^\]]+)\]/g;
  const parts: { type: 'summary' | 'section' | 'disclaimer'; title?: string; content: string }[] = [];

  const matches = [...text.matchAll(sectionRegex)];
  if (matches.length === 0) {
    // 섹션 없으면 그냥 텍스트
    return [{ type: 'section' as const, content: text }];
  }

  matches.forEach((match, i) => {
    const title = match[1];
    const start = match.index! + match[0].length;
    const end = matches[i + 1]?.index ?? text.length;
    const content = text.slice(start, end).trim();

    if (i === 0) {
      parts.push({ type: 'summary', title, content });
    } else {
      parts.push({ type: 'section', title, content });
    }
  });

  // * 로 시작하는 마지막 줄 → disclaimer
  const lastSection = parts[parts.length - 1];
  if (lastSection) {
    const disclaimerMatch = lastSection.content.match(/(\n\*[^*].+)$/s);
    if (disclaimerMatch) {
      const disclaimerText = disclaimerMatch[1].trim();
      lastSection.content = lastSection.content.slice(0, disclaimerMatch.index).trim();
      parts.push({ type: 'disclaimer', content: disclaimerText.replace(/^\*\s*/, '') });
    }
  }

  return parts;
}

function renderContent(content: string) {
  return content.split('\n').map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
      const text = trimmed.replace(/^[•\-]\s*/, '');
      const boldParts = text.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} style={{ fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      return (
        <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 6 }}>
          <span style={{ color: C.accent, fontWeight: 700, marginTop: 1, flexShrink: 0 }}>•</span>
          <span style={{ fontSize: 13, color: C.textPrimary, lineHeight: 1.7 }}>{boldParts}</span>
        </div>
      );
    }

    // **텍스트** → bold 처리
    const boldParts = trimmed.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j} style={{ fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    return (
      <p key={i} style={{ fontSize: 13, color: C.textPrimary, lineHeight: 1.8, margin: '0 0 6px' }}>
        {boldParts}
      </p>
    );
  });
}

interface AnalysisRendererProps {
  text: string;
}

export function AnalysisRenderer({ text }: AnalysisRendererProps) {
  if (!text) return null;
  const sections = parseAnalysis(text);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {sections.map((section, i) => {
        if (section.type === 'summary') {
          return (
            <div key={i} style={{
              background: C.accentLight,
              borderRadius: 10,
              padding: '12px 14px',
              borderLeft: `3px solid ${C.accent}`,
            }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: C.accent, lineHeight: 1.6, margin: 0 }}>
                {section.content}
              </p>
            </div>
          );
        }

        if (section.type === 'disclaimer') {
          return (
            <p key={i} style={{ fontSize: 11, color: C.textSecondary, lineHeight: 1.6, margin: 0, paddingTop: 4, borderTop: `1px solid ${C.border}` }}>
              * {section.content}
            </p>
          );
        }

        return (
          <div key={i}>
            {section.title && (
              <div style={{ fontSize: 12, fontWeight: 700, color: C.textSecondary, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>
                {section.title}
              </div>
            )}
            <div>{renderContent(section.content)}</div>
          </div>
        );
      })}
    </div>
  );
}
