-- 게시글 삭제 정책 추가 (작성자 본인만 삭제 가능)
create policy "Authors can delete own posts" on public.posts for delete using (auth.uid() = author_id);
