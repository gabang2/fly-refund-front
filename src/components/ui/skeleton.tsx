import React from "react";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: number;
  style?: React.CSSProperties;
}

export function Skeleton({ width = "100%", height = 16, borderRadius = 6, style }: SkeletonProps) {
  return (
    <div style={{
      width, height, borderRadius,
      background: "linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)",
      backgroundSize: "200% 100%",
      animation: "skeleton-shimmer 1.4s infinite",
      flexShrink: 0,
      ...style
    }} />
  );
}

export function PostCardSkeleton() {
  return (
    <div style={{
      background: "#fff", borderRadius: 16, padding: "18px 20px",
      border: "1px solid #f0f0f0", display: "flex", flexDirection: "column", gap: 10
    }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Skeleton width={100} height={12} />
        <Skeleton width={60} height={12} />
      </div>
      <Skeleton width="75%" height={18} />
      <Skeleton width="100%" height={13} />
      <Skeleton width="60%" height={13} />
      <Skeleton width={50} height={11} />
    </div>
  );
}

// index.html에 keyframe이 없으면 여기서 주입
if (typeof document !== "undefined") {
  const id = "skeleton-keyframe";
  if (!document.getElementById(id)) {
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @keyframes skeleton-shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `;
    document.head.appendChild(style);
  }
}
