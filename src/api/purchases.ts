import { supabase } from './supabaseClient';
import type { Purchase } from '@/types/database';
export type { Purchase };

export const savePurchase = async (purchase: Purchase) => {
  const { data, error } = await supabase
    .from('purchases')
    .insert([purchase])
    .select()
    .single();
  return { data: data as Purchase, error };
};

export const getMyPurchases = async (userId: string) => {
  const { data, error } = await supabase
    .from('purchases')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data: data as Purchase[], error };
};

export const getPurchasesByCalcId = async (calcId: string) => {
  const { data, error } = await supabase
    .from('purchases')
    .select('*')
    .eq('calc_id', calcId);
  return { data: data as Purchase[], error };
};

export const refundPurchase = async (purchaseId: string) => {
  const { data, error } = await supabase.functions.invoke('refund-purchase', {
    body: { purchaseId },
  });
  if (error) return { data: null, error: error.message ?? 'Refund failed' };

  const { data: purchase, error: fetchError } = await supabase
    .from('purchases')
    .select('*')
    .eq('id', purchaseId)
    .single();
  return { data: purchase as Purchase, error: fetchError };
};
