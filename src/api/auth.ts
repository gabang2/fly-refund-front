import { supabase } from './supabaseClient';

/**
 * 이메일을 통한 매직 링크 로그인 요청
 */
export const signInWithEmail = async (email: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // 로그인 후 돌아올 URL 설정 (현재 도메인 기준)
      emailRedirectTo: window.location.origin,
    },
  });
  return { data, error };
};

/**
 * 구글 계정으로 로그인 (OAuth)
 */
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
  return { data, error };
};

/**
 * 로그아웃
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

/**
 * 현재 세션 정보 가져오기
 */
export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
};

/**
 * 사용자 상태 변경 감지
 */
export const onAuthStateChange = (callback: (session: any) => void) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return subscription;
};
