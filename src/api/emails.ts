import { supabase } from './supabaseClient';

export interface SentEmail {
  id?: string;
  user_id: string;
  calculation_id?: string;
  recipient_email: string;
  subject: string;
  content: string;
  sent_at?: string;
}

/**
 * 이메일 발송 기록을 저장합니다. (실제 발송은 시뮬레이션)
 */
export const sendComplaintEmail = async (email: SentEmail) => {
  const { data, error } = await supabase
    .from('sent_emails')
    .insert([email])
    .select()
    .single();
    
  if (!error) {
    console.log("Email sent (simulated):", email);
    // 여기서 실제 이메일 발송 서비스(SendGrid, Resend 등)를 연동할 수 있습니다.
  }
  
  return { data, error };
};
