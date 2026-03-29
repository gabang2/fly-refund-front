import { supabase } from './supabaseClient';
import { Calculation } from '@/types/database';

/**
 * 특정 ID의 계산 결과 조회
 */
export const getCalculationById = async (id: string) => {
  const { data, error } = await supabase
    .from('calculations')
    .select('*')
    .eq('id', id)
    .single();
  return { data: data as Calculation, error };
};

/**
 * 계산 결과 저장
 */
export const saveCalculation = async (calc: Calculation) => {
  const { data, error } = await supabase
    .from('calculations')
    .insert([calc])
    .select()
    .single();
  return { data: data as Calculation, error };
};

/**
 * 사용자의 이전 계산 기록 조회
 */
export const getMyCalculations = async (userId: string) => {
  const { data, error } = await supabase
    .from('calculations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data: data as Calculation[], error };
};
