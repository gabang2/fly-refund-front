export interface Profile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  email?: string;
  updated_at?: string;
}

export interface Purchase {
  id?: string;
  user_id?: string;
  calc_id?: string | null;
  product_type: 'email_draft' | 'detailed_analysis' | 'flight_alert';
  status: 'paid' | 'refunded';
  price_label?: string;
  extra_data?: {
    email_content?: string;
    calc_input?: any;
    [key: string]: any;
  };
  created_at?: string;
}

export interface Calculation {
  id?: string;
  user_id?: string;
  input_data: any;
  result_data: any;
  created_at?: string;
}

export interface Post {
  id?: number;
  author_id?: string;
  title: string;
  content?: string;
  tag?: string;
  airline?: string;
  route?: string;
  success?: boolean;
  amt?: string;
  locale?: string;
  created_at?: string;
  comment_count?: number;
  // Join 데이터 (profiles)
  author?: Profile;
}

export interface Comment {
  id?: number;
  post_id: number;
  author_id: string;
  content: string;
  created_at?: string;
  // Join 데이터
  author?: Profile;
  post?: Post;
}
