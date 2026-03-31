-- flight_alert 제거를 위해 product_type 체크 제약 조건 업데이트
ALTER TABLE public.purchases
  DROP CONSTRAINT IF EXISTS purchases_product_type_check;

ALTER TABLE public.purchases
  ADD CONSTRAINT purchases_product_type_check
    CHECK (product_type IN ('email_draft', 'detailed_analysis'));
