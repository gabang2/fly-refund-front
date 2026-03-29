-- 결제 내역 테이블
create table public.purchases (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  calc_id uuid references public.calculations(id) on delete set null,
  product_type text not null check (product_type in ('email_draft', 'flight_alert')),
  status text not null default 'paid' check (status in ('paid', 'refunded')),
  price_label text,
  extra_data jsonb,
  created_at timestamptz default now()
);

alter table public.purchases enable row level security;

create policy "Users can view own purchases" on public.purchases
  for select using (auth.uid() = user_id);

create policy "Users can insert own purchases" on public.purchases
  for insert with check (auth.uid() = user_id);

create policy "Users can update own purchases" on public.purchases
  for update using (auth.uid() = user_id);
