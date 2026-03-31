import { supabase } from './supabaseClient';
import type { Post } from '@/types/database';
export type { Post };

/**
 * 게시글 목록 조회 (필터 및 언어 적용)
 */
export const getPosts = async (params: { 
  locale: string; 
  search?: string; 
  tag?: string;
  page?: number;
  limit?: number;
}) => {
  const { locale, search, tag, page = 0, limit = 10 } = params;
  
  let query = supabase
    .from('posts')
    .select(`
      *,
      author:profiles (id, full_name, avatar_url),
      comments:comments(count)
    `, { count: 'exact' })
    .eq('locale', locale)
    .not('id', 'is', null) // 추가: ID가 있는(삭제되지 않은) 데이터만 명시적으로 조회
    .order('created_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);

  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,airline.ilike.%${search}%`);
  }

  if (tag && tag !== '전체' && tag !== 'All') {
    query = query.eq('tag', tag);
  }

  const { data, error, count } = await query;

  // 416: range가 전체 데이터 수를 초과 → 더 이상 데이터 없음으로 처리
  if (error && (error as any).code === 'PGRST103') {
    return { data: [] as Post[], error: null, count };
  }

  // 댓글 수 매핑: comments: [{ count: n }] -> comment_count: n
  const mappedData = data?.map(post => ({
    ...post,
    comment_count: (post.comments as any)?.[0]?.count || 0
  })) as Post[];

  return { data: mappedData, error, count };
};

/**
 * 내가 쓴 게시글 목록 조회
 */
export const getMyPosts = async (userId: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      comments:comments(count)
    `)
    .eq('author_id', userId)
    .not('id', 'is', null) // 추가
    .order('created_at', { ascending: false });
    
  const mappedData = data?.map(post => ({
    ...post,
    comment_count: (post.comments as any)?.[0]?.count || 0
  })) as Post[];

  return { data: mappedData, error };
};

/**
 * 게시글 작성
 */
export const createPost = async (post: Post) => {
  const { data, error } = await supabase
    .from('posts')
    .insert([post])
    .select()
    .single();
  return { data: data as Post, error };
};

/**
 * 게시글 수정
 */
export const updatePost = async (id: number, post: Partial<Post>) => {
  const { data, error } = await supabase
    .from('posts')
    .update(post)
    .eq('id', id)
    .select()
    .single();
  return { data: data as Post, error };
};

/**
 * 게시글 삭제
 */
export const deletePost = async (id: number) => {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);
  return { error };
};

/**
 * 특정 게시글 상세 조회
 */
export const getPostById = async (id: number) => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:profiles (id, full_name, avatar_url),
      comments:comments(count)
    `)
    .eq('id', id)
    .single();
    
  if (data) {
    (data as any).comment_count = (data.comments as any)?.[0]?.count || 0;
  }

  return { data: data as Post, error };
};
