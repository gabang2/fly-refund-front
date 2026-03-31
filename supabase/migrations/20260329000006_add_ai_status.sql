-- purchases 테이블에 ai_status 컬럼 추가
ALTER TABLE public.purchases
  ADD COLUMN IF NOT EXISTS ai_status text DEFAULT 'PROCESSING'
    CHECK (ai_status IN ('PROCESSING', 'FAILED', 'FAILED_1', 'FAILED_2', 'FAILED_3', 'REFUND', 'COMPLETED'));

-- service_role이 ai_status와 extra_data를 업데이트할 수 있도록 정책 추가
-- (service_role은 RLS를 우회하므로 별도 정책 불필요, 하지만 명시적으로 추가)
-- 기존에 동일한 이름의 정책이 있을 수 있으므로 DROP 후 생성합니다.
DROP POLICY IF EXISTS "Service role can update purchases" ON public.purchases;
CREATE POLICY "Service role can update purchases" ON public.purchases
  FOR UPDATE USING (true);
