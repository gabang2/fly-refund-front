import { supabase } from './supabaseClient';

export interface Airline {
  id: number;
  name_kr: string;
  name_en: string;
  code: string;
  active: boolean;
  country_code: string | null;
  is_eu_carrier: boolean | null;
  is_uk_carrier: boolean | null;
  appr_size: 'large' | 'small' | null;
}

/**
 * 활성화된 항공사 리스트를 가져옵니다.
 */
export const getAirlines = async () => {
  const { data, error } = await supabase
    .from('airlines')
    .select('*')
    .eq('active', true)
    .order('name_kr', { ascending: true });
    
  return { data: data as Airline[], error };
};
