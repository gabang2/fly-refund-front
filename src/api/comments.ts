import { supabase } from './supabaseClient';
import { Comment } from '@/types/database';

/**
 * 게시글별 댓글 목록 조회
 */
export const getCommentsByPostId = async (postId: number) => {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      author:profiles (id, full_name, avatar_url, email)
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });
    
  return { data: data as Comment[], error };
};

/**
 * 댓글 작성
 */
export const createComment = async (comment: Comment) => {
  const { data, error } = await supabase
    .from('comments')
    .insert([comment])
    .select()
    .single();
    
  return { data: data as Comment, error };
};

/**
 * 내가 쓴 댓글 목록 조회
 */
export const getMyComments = async (userId: string) => {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      post:posts (id, title)
    `)
    .eq('author_id', userId)
    .order('created_at', { ascending: false });
    
  return { data: data as Comment[], error };
};

/**
 * 댓글 삭제
 */
export const deleteComment = async (id: number) => {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', id);
    
  return { error };
};
