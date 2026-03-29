-- product_type 제약 업데이트: detailed_analysis 추가
ALTER TABLE public.purchases
  DROP CONSTRAINT IF EXISTS purchases_product_type_check;

ALTER TABLE public.purchases
  ADD CONSTRAINT purchases_product_type_check
    CHECK (product_type IN ('email_draft', 'flight_alert', 'detailed_analysis'));
