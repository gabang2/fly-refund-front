import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { PostList } from "@/components/community/post-list";
import { Chip } from "@/components/ui/chip";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { C } from "@/lib/constants";
import { getPosts, Post } from "@/api/posts";

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
  const [filter, setFilter] = useState(t.filters[0]);
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
      tag: filter,
      page: currentPage,
      limit: 10
    });

    if (!error && data) {
      if (isNew) {
        setPosts([...data]); // 새로운 배열로 교체하여 참조 변경 강제
        setPage(0);
      } else {
        setPosts(prev => {
          // 중복 데이터 방지 (ID 기준 필터링)
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
    setPosts([]); // 즉시 비우기
    setPage(0); // 페이지 초기화
    setHasMore(true); // 더 가져올 데이터 상태 초기화
    fetchPosts(true);
  }, [locale, filter, search, location.key]);

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
            <span style={{ position: "absolute", right: 12, top: 10, fontSize: 16 }}>🔍</span>
          </div>
        </div>

        <div style={{ height: 1, background: C.border }} />
        <div style={{ display: "flex", gap: 8, padding: "10px 20px", overflowX: "auto" }}>
          {t.filters.map((f: string) => <Chip key={f} label={f} active={filter === f} onClick={() => { setFilter(f); setPage(0); }} />)}
        </div>
        <div style={{ height: 1, background: C.border }} />
      </div>

      <div style={{ padding: "12px 20px 100px" }}>
        <PostList posts={posts} t={t} onPostClick={onPostClick} />
        <div ref={lastPostElementRef} style={{ height: 20 }} />
        {loading && <div style={{ textAlign: "center", padding: 20, color: C.textSecondary }}>{t.loading}</div>}
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
