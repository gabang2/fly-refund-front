-- 항공사 테이블에 관할권 판단용 컬럼 추가
ALTER TABLE public.airlines
  ADD COLUMN IF NOT EXISTS country_code CHAR(2),
  ADD COLUMN IF NOT EXISTS is_eu_carrier BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_uk_carrier BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS appr_size TEXT CHECK (appr_size IN ('large', 'small'));

-- 기존 13개 항공사 데이터 업데이트
UPDATE public.airlines SET country_code = 'KR', is_eu_carrier = FALSE, is_uk_carrier = FALSE, appr_size = 'large' WHERE code = 'KE';
UPDATE public.airlines SET country_code = 'KR', is_eu_carrier = FALSE, is_uk_carrier = FALSE, appr_size = 'large' WHERE code = 'OZ';
UPDATE public.airlines SET country_code = 'KR', is_eu_carrier = FALSE, is_uk_carrier = FALSE, appr_size = 'small' WHERE code = '7C';
UPDATE public.airlines SET country_code = 'DE', is_eu_carrier = TRUE,  is_uk_carrier = FALSE, appr_size = 'large' WHERE code = 'LH';
UPDATE public.airlines SET country_code = 'FR', is_eu_carrier = TRUE,  is_uk_carrier = FALSE, appr_size = 'large' WHERE code = 'AF';
UPDATE public.airlines SET country_code = 'NL', is_eu_carrier = TRUE,  is_uk_carrier = FALSE, appr_size = 'large' WHERE code = 'KL';
UPDATE public.airlines SET country_code = 'GB', is_eu_carrier = FALSE, is_uk_carrier = TRUE,  appr_size = 'large' WHERE code = 'BA';
UPDATE public.airlines SET country_code = 'US', is_eu_carrier = FALSE, is_uk_carrier = FALSE, appr_size = 'large' WHERE code = 'AA';
UPDATE public.airlines SET country_code = 'US', is_eu_carrier = FALSE, is_uk_carrier = FALSE, appr_size = 'large' WHERE code = 'DL';
UPDATE public.airlines SET country_code = 'US', is_eu_carrier = FALSE, is_uk_carrier = FALSE, appr_size = 'large' WHERE code = 'UA';
UPDATE public.airlines SET country_code = 'AE', is_eu_carrier = FALSE, is_uk_carrier = FALSE, appr_size = 'large' WHERE code = 'EK';
UPDATE public.airlines SET country_code = 'QA', is_eu_carrier = FALSE, is_uk_carrier = FALSE, appr_size = 'large' WHERE code = 'QR';
UPDATE public.airlines SET country_code = 'SG', is_eu_carrier = FALSE, is_uk_carrier = FALSE, appr_size = 'large' WHERE code = 'SQ';
