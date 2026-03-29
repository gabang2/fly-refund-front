import { supabase } from './supabaseClient';
import { Profile } from '@/types/database';

/**
 * 특정 사용자의 프로필 조회
 */
export const getProfile = async (id: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();
  return { data: data as Profile, error };
};

/**
 * 프로필 정보 업데이트
 */
export const updateProfile = async (profile: Partial<Profile> & { id: string }) => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile)
    .select()
    .single();
  return { data: data as Profile, error };
};
