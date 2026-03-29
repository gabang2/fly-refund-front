-- calculations 테이블: 본인 기록만 삭제 가능하도록 정책 추가
-- (RLS가 이미 활성화되어 있으므로 정책만 추가)
create policy "Users can delete own calculations" on public.calculations
  for delete using (auth.uid() = user_id);
