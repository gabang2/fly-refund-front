import { supabase } from './supabaseClient';

export const analyzeCompensation = async (flightDetails: any, locale: string): Promise<{ 
  analysis_kr?: string; 
  analysis_en?: string; 
  error: string | null 
}> => {
  const { data, error } = await supabase.functions.invoke('analyze-compensation', {
    body: { flightDetails, locale },
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
    }
  });

  if (error) return { error: error.message };
  if (data?.error) return { error: data.error };
  return { 
    analysis_kr: data?.analysis_kr, 
    analysis_en: data?.analysis_en, 
    error: null 
  };
};

export const generateAIEmail = async (flightDetails: any, locale: string): Promise<{ 
  email_kr?: string; 
  email_en?: string; 
  error: string | null 
}> => {
  const { data, error } = await supabase.functions.invoke('generate-email', {
    body: { flightDetails, locale },
  });

  if (error) return { error: error.message };
  if (data?.error) return { error: data.error };
  return { 
    email_kr: data?.email_kr, 
    email_en: data?.email_en, 
    error: null 
  };
};
