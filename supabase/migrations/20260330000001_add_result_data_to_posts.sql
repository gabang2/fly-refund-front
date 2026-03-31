alter table public.posts
  add column if not exists result_data jsonb;
