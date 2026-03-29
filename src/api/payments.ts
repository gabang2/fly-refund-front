import { supabase } from './supabaseClient';

export interface Payment {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  item_type: 'detailed_result' | 'email_draft' | 'price_alert';
  target_id?: string; // calculation_id 등 관련 ID
  status: 'completed' | 'refunded';
  created_at: string;
}

// 결제 내역 가져오기
export const getMyPayments = async (userId: string) => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

// 결제하기 (시뮬레이션)
export const processPayment = async (payment: Omit<Payment, 'id' | 'created_at' | 'status'>) => {
  const { data, error } = await supabase
    .from('payments')
    .insert([{ ...payment, status: 'completed' }])
    .select()
    .single();
  return { data, error };
};

// 환불하기 (모든 요청 즉시 승인)
export const requestRefund = async (paymentId: string) => {
  const { data, error } = await supabase
    .from('payments')
    .update({ status: 'refunded' })
    .eq('id', paymentId)
    .select()
    .single();
  return { data, error };
};
