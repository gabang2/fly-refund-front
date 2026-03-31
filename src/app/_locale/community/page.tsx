import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { PostList } from "@/components/community/post-list";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { C } from "@/lib/constants";
import { getPosts, Post } from "@/api/posts";
import { PostCardSkeleton } from "@/components/ui/skeleton";

interface CommunityPageProps {
  t: any;
  locale: string;
  onLocaleChange: (l: string) => void;
  onWrite: () => void;
  onPostClick: (post: any) => void;
}

export default function CommunityPage({ t, locale, onLocaleChange, onWrite, onPostClick }: CommunityPageProps) {
  const location = useLocation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useCallback((node: any) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const fetchPosts = async (isNew: boolean = false) => {
    setLoading(true);
    const currentPage = isNew ? 0 : page;
    
    // 이전에 호출된 API 응답이 뒤늦게 도착하여 목록이 꼬이는 것을 방지하기 위해 
    // 새로운 조회가 시작될 때 상태를 명확히 제어합니다.
    const { data, error } = await getPosts({
      locale,
      search,
      page: currentPage,
      limit: 10
    });

    if (error) {
      setHasMore(false);
    } else if (data) {
      if (isNew) {
        setPosts([...data]);
        setPage(0);
      } else {
        setPosts(prev => {
          const newPosts = data.filter(item => !prev.some(p => p.id === item.id));
          return [...prev, ...newPosts];
        });
      }
      setHasMore(data.length === 10);
    }
    setLoading(false);
  };

  // 컴포넌트 마운트 시 및 경로 변경 시(탭 클릭 포함) 강제 새로고침
  useEffect(() => {
    setPosts([]);
    setPage(0);
    setHasMore(true);
    fetchPosts(true);
  }, [locale, search, location.key]);

  useEffect(() => {
    if (page > 0) fetchPosts();
  }, [page]);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div style={{ background: C.bg, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px" }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: C.textPrimary }}>{t.community}</span>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <LocaleSwitcher currentLocale={locale} onLocaleChange={onLocaleChange} />
            <button onClick={onWrite} style={{ background: C.accent, border: "none", color: "#fff", fontSize: 13, fontWeight: 600, padding: "7px 14px", borderRadius: 8, cursor: "pointer" }}>{t.writeBtn}</button>
          </div>
        </div>
        
        <div style={{ padding: "0 20px 12px" }}>
          <div style={{ position: "relative" }}>
            <input 
              type="text" 
              placeholder={t.searchPh || "검색어를 입력하세요..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", height: 40, border: `1px solid ${C.border}`, borderRadius: 10, padding: "0 36px 0 12px", fontSize: 14, outline: "none", background: C.surface, boxSizing: "border-box" }}
            />
            <svg style={{ position: "absolute", right: 12, top: 11 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.textSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </div>
        </div>

        <div style={{ height: 1, background: C.border }} />
      </div>

      <div style={{ padding: "12px 20px 100px" }}>
        {loading && posts.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {Array.from({ length: 5 }).map((_, i) => <PostCardSkeleton key={i} />)}
          </div>
        ) : (
          <PostList posts={posts} t={t} onPostClick={onPostClick} />
        )}
        <div ref={lastPostElementRef} style={{ height: 20 }} />
        {loading && posts.length > 0 && <div style={{ textAlign: "center", padding: 20, color: C.textSecondary }}>{t.loading}</div>}
        {!hasMore && posts.length > 0 && <div style={{ textAlign: "center", padding: 20, color: C.textSecondary, fontSize: 12 }}>{t.lastPost}</div>}
        {posts.length === 0 && !loading && (
          <div style={{ textAlign: "center", padding: "100px 0", color: C.textSecondary }}>
            {t.noPosts}
          </div>
        )}
      </div>
    </div>
  );
}
