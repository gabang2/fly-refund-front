import React, { useState, useEffect } from "react";
import { Btn } from "@/components/ui/button";
import { C } from "@/lib/constants";
import { getCommentsByPostId, createComment, deleteComment } from "@/api/comments";
import { Comment } from "@/types/database";

interface PostDetailProps {
  user?: any;
  post: any;
  t: any;
  onEdit?: (post: any) => void;
  onDelete?: (id: number) => void;
}

export function PostDetail({ user, post, t, onEdit, onDelete }: PostDetailProps) {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [activeCommentMenu, setActiveCommentMenu] = useState<number | null>(null);
  
  const isPostAuthor = user?.id && post?.author_id && user.id === post.author_id;

  const fetchComments = async () => {
    if (post?.id) {
      setLoading(true);
      const { data, error } = await getCommentsByPostId(post.id);
      if (!error && data) setComments(data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [post?.id]);

  const handlePostComment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!commentText.trim() || !user || !post || submitting) return;
    
    setSubmitting(true);
    try {
      const { error } = await createComment({
        post_id: Number(post.id),
        author_id: user.id,
        content: commentText.trim()
      } as any);
      
      if (!error) {
        setCommentText("");
        fetchComments();
      } else {
        alert(error.message);
      }
    } catch (e) {
      alert("Error posting comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (id: number) => {
    if (!window.confirm(t.confirmDelete || "정말 삭제하시겠습니까?")) return;
    const { error } = await deleteComment(id);
    if (!error) fetchComments();
    setActiveCommentMenu(null);
  };

  if (!post) return null;

  const authorName = post.author?.full_name || post.author?.email?.split('@')[0] || "User";

  return (
    <div style={{ padding: "24px 20px 180px", background: "#fff", minHeight: "100%", boxSizing: "border-box" }}>
      
      {/* 1. 카테고리 & 더보기 메뉴 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: post.success ? C.success : C.textSecondary, background: post.success ? C.successLight : "#f0f0f0", padding: "2px 8px", borderRadius: 4 }}>
            {post.tag}
          </span>
          <span style={{ fontSize: 13, color: C.textSecondary, fontWeight: 500 }}>{post.airline} · {post.route}</span>
        </div>

        {isPostAuthor && (
          <div style={{ position: "relative" }}>
            <button 
              onClick={() => setShowPostMenu(!showPostMenu)}
              style={{ background: "none", border: "none", color: C.textSecondary, fontSize: 20, cursor: "pointer", padding: "0 4px" }}
            >
              ⋮
            </button>
            {showPostMenu && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setShowPostMenu(false)} />
                <div style={{ 
                  position: "absolute", top: 24, right: 0, background: "#fff", borderRadius: 12, 
                  boxShadow: "0 4px 20px rgba(0,0,0,0.12)", zIndex: 11, minWidth: 120, 
                  overflow: "hidden", border: `1px solid ${C.border}`
                }}>
                  <button 
                    onClick={() => { setShowPostMenu(false); onEdit?.(post); }}
                    style={{ width: "100%", padding: "12px 16px", textAlign: "left", background: "none", border: "none", fontSize: 14, color: C.textPrimary, cursor: "pointer" }}
                  >
                    {t.edit || "수정하기"}
                  </button>
                  <button 
                    onClick={() => { setShowPostMenu(false); if (window.confirm(t.deleteConfirm || "정말 삭제하시겠습니까?")) onDelete?.(post.id); }}
                    style={{ width: "100%", padding: "12px 16px", textAlign: "left", background: "none", border: "none", fontSize: 14, color: "#ff4d4f", cursor: "pointer", borderTop: `1px solid #f0f0f0` }}
                  >
                    {t.delete || "삭제하기"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* 2. 제목 */}
      <h1 style={{ fontSize: 22, fontWeight: 800, color: C.textPrimary, margin: "0 0 12px", lineHeight: 1.4 }}>
        {post.title}
      </h1>

      {/* 3. 작성자 및 날짜 */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{authorName}</span>
        <span style={{ fontSize: 13, color: C.textSecondary }}>·</span>
        <span style={{ fontSize: 13, color: C.textSecondary }}>{new Date(post.created_at).toLocaleDateString()}</span>
      </div>

      {/* 4. 계산 결과 카드 */}
      {post.success && post.amt && (
        <div style={{ background: "#f8f9fa", borderRadius: 12, padding: "16px", marginBottom: 24, border: `1px solid #eee` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: C.accent, background: "#fff", padding: "2px 8px", borderRadius: 4, border: `1px solid ${C.accentLight}` }}>
              {t.regLabel || "확인된 보상 규정"}
            </span>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.success }}>
              {post.amt} {t.successBadge.replace(" ✓", "")}
            </div>
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: C.textPrimary }}>
            ✈️ {post.route}
          </div>
        </div>
      )}

      {/* 5. 본문 내용 */}
      <div style={{ fontSize: 16, color: "#333", lineHeight: 1.8, marginBottom: 48, whiteSpace: "pre-wrap" }}>
        {post.content}
      </div>

      <div style={{ height: 1, background: "#eee", marginBottom: 32 }} />

      {/* 댓글 영역 헤더 */}
      <div style={{ fontSize: 16, fontWeight: 700, color: C.textPrimary, marginBottom: 20 }}>
        {t.commentsLabel || "댓글"} {comments.length}
      </div>

      {/* 댓글 리스트 */}
      {loading && comments.length === 0 ? (
        <div style={{ textAlign: "center", padding: "20px 0", color: C.textSecondary }}>{t.loading}</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {comments.map((c: any) => {
            const isCommentAuthor = user?.id && c.author_id && user.id === c.author_id;
            const cAuthorName = c.author?.full_name || c.author?.email?.split('@')[0] || "User";
            
            return (
              <div key={c.id} style={{ display: "flex", flexDirection: "column", gap: 6, position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>{cAuthorName}</span>
                    <span style={{ fontSize: 11, color: C.textSecondary }}>{new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  {isCommentAuthor && (
                    <div style={{ position: "relative" }}>
                      <button 
                        onClick={() => setActiveCommentMenu(activeCommentMenu === c.id ? null : c.id)}
                        style={{ background: "none", border: "none", color: C.textSecondary, fontSize: 16, cursor: "pointer", padding: "4px" }}
                      >
                        ⋮
                      </button>
                      {activeCommentMenu === c.id && (
                        <>
                          <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setActiveCommentMenu(null)} />
                          <div style={{ 
                            position: "absolute", top: 24, right: 0, background: "#fff", borderRadius: 8, 
                            boxShadow: "0 2px 12px rgba(0,0,0,0.1)", zIndex: 11, minWidth: 100, 
                            overflow: "hidden", border: `1px solid ${C.border}`
                          }}>
                            <button 
                              onClick={() => handleDeleteComment(c.id)}
                              style={{ width: "100%", padding: "10px 12px", textAlign: "left", background: "none", border: "none", fontSize: 13, color: "#ff4d4f", cursor: "pointer" }}
                            >
                              {t.delete || "삭제하기"}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <p style={{ fontSize: 14, color: "#444", margin: 0, lineHeight: 1.5 }}>{c.content}</p>
              </div>
            );
          })}
          {!loading && comments.length === 0 && (
            <div style={{ textAlign: "center", padding: "20px 0", color: C.textSecondary, fontSize: 14 }}>
              {t.noComments}
            </div>
          )}
        </div>
      )}

      {/* 댓글 입력창 (하단 고정) */}
      <form 
        onSubmit={handlePostComment}
        style={{ 
          position: "fixed", 
          bottom: 72, 
          left: "50%", 
          transform: "translateX(-50%)", 
          width: "100%",
          maxWidth: 430,
          background: "#fff", 
          borderTop: `1px solid #eee`, 
          padding: "12px 16px env(safe-area-inset-bottom, 12px)",
          boxSizing: "border-box",
          zIndex: 1000
        }}
      >
        <div style={{ 
          display: "flex", 
          gap: 10, 
          background: "#f5f5f5", 
          padding: "4px 4px 4px 12px", 
          borderRadius: 24, 
          alignItems: "center"
        }}>
          <input 
            value={commentText} 
            onChange={e => setCommentText(e.target.value)} 
            placeholder={user ? (t.commentPlaceholder || "댓글을 남겨보세요") : (t.loginRequired || "로그인 후 이용 가능합니다")} 
            disabled={!user || submitting}
            style={{ 
              flex: 1, border: "none", background: "none", fontSize: 14, outline: "none", height: 36, color: C.textPrimary,
              WebkitAppearance: "none"
            }} 
          />
          <button 
            type="submit"
            disabled={!user || !commentText.trim() || submitting}
            style={{ 
              background: (!user || !commentText.trim() || submitting) ? "#ccc" : C.accent, 
              color: "#fff", border: "none", borderRadius: 20, height: 32, padding: "0 16px", fontSize: 13, fontWeight: 600,
              cursor: (!user || !commentText.trim() || submitting) ? "default" : "pointer"
            }}
          >
            {submitting ? "..." : (t.commentBtn || "전송")}
          </button>
        </div>
      </form>
    </div>
  );
}
