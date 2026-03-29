import React from "react";
import { Card } from "@/components/ui/card";
import { C } from "@/lib/constants";
import { Post } from "@/api/posts";

interface PostListProps {
  posts: Post[];
  t: any;
  onPostClick: (post: Post) => void;
}

export function PostList({ posts, t, onPostClick }: PostListProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {posts?.map(post => (
        <button 
          key={post.id} 
          onClick={() => onPostClick(post)} 
          style={{ background: "none", border: "none", textAlign: "left", padding: 0, cursor: "pointer", width: "100%" }}
        >
          <Card style={{ padding: "18px 20px", transition: "transform 0.1s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: post.success ? C.success : C.textSecondary, background: post.success ? C.successLight : "#f0f0f0", padding: "2px 8px", borderRadius: 4 }}>
                  {post.tag}
                </span>
                <span style={{ fontSize: 12, color: C.textSecondary, fontWeight: 500 }}>{post.airline} · {post.route}</span>
              </div>
              <div style={{ fontSize: 11, color: C.textSecondary }}>{new Date(post.created_at).toLocaleDateString()}</div>
            </div>
            
            <div style={{ fontSize: 16, fontWeight: 700, color: C.textPrimary, lineHeight: 1.4, marginBottom: 6 }}>
              {post.title}
            </div>
            
            <div style={{ fontSize: 14, color: C.textSecondary, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.5, marginBottom: 12 }}>
              {post.content}
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: C.textSecondary, display: "flex", alignItems: "center", gap: 4 }}>
                💬 {post.comment_count || 0}
              </span>
            </div>
          </Card>
        </button>
      ))}
    </div>
  );
}
