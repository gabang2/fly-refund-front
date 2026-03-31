import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PostDetail } from "@/components/community/post-detail";
import { Header } from "@/components/layout/header";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { C } from "@/lib/constants";
import { getPostById, deletePost } from "@/api/posts";
import { Post } from "@/types/database";
import { useNavigate } from "react-router-dom";

interface PostDetailPageProps {
  user?: any;
  t: any;
  post?: Post;
  locale: string;
  onBack: () => void;
  onLocaleChange: (l: string) => void;
  onEditPost?: (post: any) => void;
}

export default function PostDetailPage({ user, t, post: initialPost, locale, onBack, onLocaleChange, onEditPost }: PostDetailPageProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | undefined>(initialPost);
  const [loading, setLoading] = useState(!initialPost);

  useEffect(() => {
    if (!initialPost && id) {
      setLoading(true);
      getPostById(Number(id)).then(({ data, error }) => {
        if (!error && data) {
          setPost(data);
        }
        setLoading(false);
      });
    }
  }, [id, initialPost]);

  const handleDelete = async (postId: number) => {
    const { error } = await deletePost(postId);
    if (!error) {
      alert(t.deleteSuccess || "삭제되었습니다.");
      // location.key를 이용한 목록 새로고침을 위해 navigate 호출
      navigate(`/${locale}/community`, { replace: true });
    } else {
      console.error("Delete failed:", error);
      alert(isKr ? "삭제에 실패했습니다. 권한이 없거나 오류가 발생했습니다." : "Failed to delete. No permission or error occurred.");
    }
  };

  const isKr = locale === 'kr';

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column" }}>
      <Header 
        onBack={{ label: t.resultBack.replace("다시 계산", "").replace("Recalculate", ""), onClick: onBack }} 
        right={<LocaleSwitcher currentLocale={locale} onLocaleChange={onLocaleChange} />} 
      />
      <div style={{ flex: 1, overflowY: "auto" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: C.textSecondary }}>{t.loading || "Loading..."}</div>
        ) : post ? (
          <PostDetail
            user={user}
            post={post}
            t={t}
            locale={locale}
            onEdit={() => onEditPost?.(post)}
            onDelete={handleDelete}
          />
        ) : (
          <div style={{ textAlign: "center", padding: "40px 0", color: C.textSecondary }}>{t.notFound || "Post not found."}</div>
        )}
      </div>
    </div>
  );
}
