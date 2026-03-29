import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Btn } from "@/components/ui/button";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { C } from "@/lib/constants";
import { signOut } from "@/api/auth";
import { getMyCalculations } from "@/api/calculations";
import { getMyPurchases, refundPurchase } from "@/api/purchases";
import { getMyPosts } from "@/api/posts";
import { getMyComments } from "@/api/comments";
import { Calculation, Purchase, Post, Comment } from "@/types/database";
import { useNavigate } from "react-router-dom";
import { ShareActionCard } from "@/components/ui/share-action-card";

interface MyInfoPageProps {
  user: any;
  t: any;
  locale: string;
  onLocaleChange: (l: string) => void;
  onLogin: () => void;
  onHistoryClick?: (calc: any) => void;
  onShare?: (calc: any) => void;
  onPurchaseClick?: (purchase: Purchase) => void;
}

type TabType = 'history' | 'purchases' | 'posts' | 'comments';

export default function MyInfoPage({ user, t, locale, onLocaleChange, onLogin, onHistoryClick, onShare, onPurchaseClick }: MyInfoPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [history, setHistory] = useState<Calculation[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [myComments, setMyComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('history');

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([
        getMyCalculations(user.id),
        getMyPurchases(user.id),
        getMyPosts(user.id),
        getMyComments(user.id)
      ]).then(([calcRes, purchRes, postsRes, commRes]) => {
        if (!calcRes.error && calcRes.data) setHistory(calcRes.data);
        if (!purchRes.error && purchRes.data) setPurchases(purchRes.data);
        if (!postsRes.error && postsRes.data) setMyPosts(postsRes.data);
        if (!commRes.error && commRes.data) setMyComments(commRes.data);
        setLoading(false);
      });
    }
  }, [user, location.key]); // location.key를 추가하여 페이지 진입 시마다 데이터 갱신

  const handleRefund = async (purchase: Purchase) => {
    if (!purchase.id) return;
    const { data } = await refundPurchase(purchase.id);
    if (data) {
      setPurchases(prev => prev.map(p => p.id === purchase.id ? { ...p, status: 'refunded' } : p));
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!window.confirm(isKr ? '정말 삭제하시겠습니까?' : 'Are you sure you want to delete this post?')) return;
    const { deletePost } = await import('@/api/posts');
    const { error } = await deletePost(id);
    if (!error) {
      setMyPosts(prev => prev.filter(p => p.id !== id));
    } else {
      alert(isKr ? '삭제에 실패했습니다.' : 'Failed to delete.');
    }
  };

  const handleLogout = async () => { await signOut(); };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString();
  };

  const productLabel = (type: string) =>
    type === 'email_draft'
      ? (locale === 'kr' ? '이메일 초안' : 'Email Draft')
      : (locale === 'kr' ? '최저가 알림' : 'Price Alert');

  const isKr = locale === 'kr';

  const tabs: { label: string; value: TabType }[] = [
    { label: isKr ? '조회 기록' : 'History', value: 'history' },
    { label: isKr ? '결제 내역' : 'Purchases', value: 'purchases' },
    { label: isKr ? '내가 쓴 글' : 'Posts', value: 'posts' },
    { label: isKr ? '내가 쓴 댓글' : 'Comments', value: 'comments' }
  ];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div style={{ background: C.bg }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px" }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: C.textPrimary }}>{t.myInfo}</span>
          <LocaleSwitcher currentLocale={locale} onLocaleChange={onLocaleChange} />
        </div>
        <div style={{ height: 1, background: C.border }} />
      </div>

      <div style={{ padding: '16px 20px 100px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {!user ? (
          <Card style={{ padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>👤</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: C.textPrimary, marginBottom: 4 }}>{t.myInfoLoginTitle}</div>
            <div style={{ fontSize: 13, color: C.textSecondary, marginBottom: 16 }}>{t.myInfoLoginDesc}</div>
            <Btn onClick={onLogin} sx={{ width: '100%' }}>{t.myInfoLoginBtn}</Btn>
          </Card>
        ) : (
          <>
            {/* 프로필 카드 */}
            <Card style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{ fontSize: 40 }}>👤</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.textPrimary, wordBreak: 'break-all' }}>{user.email}</div>
                  <div style={{ fontSize: 13, color: C.textSecondary }}>{t.welcome || 'Welcome back!'}</div>
                </div>
              </div>
              <Btn onClick={handleLogout} sx={{ width: '100%', background: '#f0f0f0', color: C.textPrimary }}>
                {t.logout || 'Logout'}
              </Btn>
            </Card>

            {/* 탭 */}
            <div style={{ display: 'flex', gap: 4, background: C.surface, borderRadius: 10, padding: 4, overflowX: 'auto' }}>
              {tabs.map(tab => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  style={{
                    flex: 'none', minWidth: 80, height: 36, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                    background: activeTab === tab.value ? C.bg : 'transparent',
                    color: activeTab === tab.value ? C.textPrimary : C.textSecondary,
                    boxShadow: activeTab === tab.value ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                    padding: '0 12px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: C.textSecondary }}>{t.loading}</div>
            ) : (
              <div>
                {activeTab === 'history' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {history.length > 0 ? history.map((calc, idx) => {
                      const airline = calc.input_data?.airline;
                      const airlineName = airline
                        ? (typeof airline === 'string' ? airline : (isKr ? airline.name_kr : airline.name_en) ?? airline.name_kr ?? airline.name_en ?? '')
                        : '';
                      const amount = calc.result_data?.amount;
                      const currency = calc.result_data?.currency ?? '';
                      const canClick = !!onHistoryClick && !!calc.input_data?.airline;
                      return (
                        <div key={calc.id || idx}>
                          <Card style={{ padding: 16 }}>
                            <div
                              role={canClick ? 'button' : undefined}
                              tabIndex={canClick ? 0 : undefined}
                              onClick={canClick ? () => onHistoryClick!(calc) : undefined}
                              style={{ cursor: canClick ? 'pointer' : 'default' }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: C.accent }}>{calc.input_data?.dep} → {calc.input_data?.arr}</div>
                                <div style={{ fontSize: 12, color: C.textSecondary }}>{formatDate(calc.created_at)}</div>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div style={{ fontSize: 12, color: C.textSecondary }}>{airlineName}</div>
                                <div style={{ fontSize: 15, fontWeight: 700, color: C.success }}>
                                  {amount ? `${currency}${amount.toLocaleString()}` : calc.result_data?.regulation ?? '-'}
                                </div>
                              </div>
                            </div>
                            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              {canClick ? (
                                <button
                                  onClick={() => onHistoryClick!(calc)}
                                  style={{ background: 'none', border: 'none', color: C.accent, fontSize: 12, fontWeight: 500, cursor: 'pointer', padding: 0 }}
                                >
                                  {isKr ? '상세 결과 보기' : 'View Details'}
                                </button>
                              ) : <div />}
                              {onShare && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); onShare(calc); }}
                                  style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 8, 
                                    background: C.accentLight, 
                                    border: 'none', 
                                    color: C.accent, 
                                    fontSize: 12, 
                                    fontWeight: 700, 
                                    padding: '6px 14px', 
                                    borderRadius: 8, 
                                    cursor: 'pointer' 
                                  }}
                                >
                                  💬 {isKr ? '공유하기' : 'Share'}
                                  <span style={{ fontSize: 10, background: '#fff', padding: '1px 5px', borderRadius: 4, marginLeft: 2, border: `1px solid ${C.accent}` }}>
                                    {isKr ? '무료' : 'Free'}
                                  </span>
                                </button>
                              )}
                            </div>
                          </Card>
                        </div>
                      );
                    }) : (
                      <div style={{ textAlign: 'center', padding: '40px 0', background: C.surface, borderRadius: 12, border: `1px dashed ${C.border}`, color: C.textSecondary, fontSize: 13 }}>
                        {t.noHistory}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'purchases' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {purchases.length > 0 ? purchases.map((p, idx) => {
                      const calcInput = p.extra_data?.calc_input;
                      const isRefunded = p.status === 'refunded';
                      return (
                        <Card key={p.id || idx} style={{ padding: 16 }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                            <div style={{ fontSize: 28 }}>{p.product_type === 'email_draft' ? '📧' : '✈️'}</div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>{productLabel(p.product_type)}</div>
                                <div style={{
                                  fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 100,
                                  background: isRefunded ? C.surface : C.successLight,
                                  color: isRefunded ? C.textSecondary : C.success,
                                }}>
                                  {isRefunded ? (isKr ? '환불됨' : 'Refunded') : (isKr ? '결제완료' : 'Paid')}
                                </div>
                              </div>
                              {calcInput && (
                                <div style={{ fontSize: 12, color: C.textSecondary, marginBottom: 2 }}>
                                  {calcInput.dep} → {calcInput.arr}
                                  {calcInput.flightDate && ` · ${calcInput.flightDate}`}
                                </div>
                              )}
                              <div style={{ fontSize: 11, color: C.textSecondary }}>
                                {formatDate(p.created_at)} · {p.price_label}
                              </div>
                            </div>
                          </div>

                          {!isRefunded && (
                            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}`, display: 'flex', gap: 8 }}>
                              {onPurchaseClick && calcInput && (
                                <button
                                  onClick={() => onPurchaseClick(p)}
                                  style={{ flex: 1, height: 34, background: C.accentLight, border: 'none', borderRadius: 8, color: C.accent, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                                >
                                  {isKr ? '결과 보기' : 'View Result'}
                                </button>
                              )}
                              <button
                                onClick={() => handleRefund(p)}
                                style={{ flex: 1, height: 34, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.textSecondary, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                              >
                                {isKr ? '환불 신청' : 'Request Refund'}
                              </button>
                            </div>
                          )}
                        </Card>
                      );
                    }) : (
                      <div style={{ textAlign: 'center', padding: '40px 0', background: C.surface, borderRadius: 12, border: `1px dashed ${C.border}`, color: C.textSecondary, fontSize: 13 }}>
                        {t.payHistoryEmpty}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'posts' && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {myPosts.length > 0 ? myPosts.map(post => (
                      <Card key={post.id} style={{ padding: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <button onClick={() => navigate(`/${locale}/community/${post.id}`)} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0, flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, marginBottom: 4 }}>{post.title}</div>
                            <div style={{ fontSize: 12, color: C.textSecondary }}>{formatDate(post.created_at)} · {post.airline} · {post.route} · 💬 {post.comment_count || 0}</div>
                          </button>
                          <button 
                            onClick={() => post.id && handleDeletePost(post.id)}
                            style={{ background: "none", border: "none", color: "#ff4d4f", fontSize: 12, cursor: "pointer", marginLeft: 12 }}
                          >
                            {isKr ? '삭제' : 'Delete'}
                          </button>
                        </div>
                      </Card>
                    )) : (
                      <div style={{ textAlign: 'center', padding: '40px 0', background: C.surface, borderRadius: 12, border: `1px dashed ${C.border}`, color: C.textSecondary, fontSize: 13 }}>
                        {isKr ? '작성한 글이 없습니다.' : 'No posts yet.'}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'comments' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {myComments.filter(c => !!c.post).length > 0 ? myComments.filter(c => !!c.post).map(comment => (
                      <Card key={comment.id} style={{ padding: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <button onClick={() => navigate(`/${locale}/community/${comment.post_id}`)} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0, flex: 1 }}>
                            <div style={{ fontSize: 13, color: C.textPrimary, marginBottom: 6 }}>{comment.content}</div>
                            <div style={{ fontSize: 11, color: C.textSecondary }}>{isKr ? '원문' : 'Original'}: {comment.post?.title} · {formatDate(comment.created_at)}</div>
                          </button>
                          <button 
                            onClick={async () => {
                              const { deleteComment } = await import('@/api/comments');
                              if (!window.confirm(isKr ? '정말 삭제하시겠습니까?' : 'Are you sure you want to delete this?')) return;
                              const { error } = await deleteComment(comment.id);
                              if (!error) setMyComments(prev => prev.filter(c => c.id !== comment.id));
                            }} 
                            style={{ background: "none", border: "none", color: "#ff4d4f", fontSize: 12, cursor: "pointer", marginLeft: 12 }}
                          >
                            {isKr ? '삭제' : 'Delete'}
                          </button>
                        </div>
                      </Card>
                    )) : (
                      <div style={{ textAlign: 'center', padding: '40px 0', background: C.surface, borderRadius: 12, border: `1px dashed ${C.border}`, color: C.textSecondary, fontSize: 13 }}>
                        {isKr ? '작성한 댓글이 없습니다.' : 'No comments yet.'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
