import React from "react";
import { C } from "@/lib/constants";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          minHeight: "100vh", padding: "40px 24px", textAlign: "center", background: "#fff"
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✈️</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.textPrimary, marginBottom: 8 }}>
            잠시 문제가 발생했어요
          </div>
          <div style={{ fontSize: 14, color: C.textSecondary, marginBottom: 32 }}>
            페이지를 새로고침하면 해결될 수 있어요.
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: C.accent, color: "#fff", border: "none", borderRadius: 12,
              padding: "12px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer"
            }}
          >
            새로고침
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
