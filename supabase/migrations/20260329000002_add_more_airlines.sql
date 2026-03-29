-- 추가 항공사 데이터 삽입 (60+ 항공사)
INSERT INTO public.airlines (name_kr, name_en, code, country_code, is_eu_carrier, is_uk_carrier, appr_size) VALUES

-- ── 한국 LCC / 중소형 ──────────────────────────────────────────────────────
('티웨이항공',      'T''way Air',           'TW', 'KR', FALSE, FALSE, 'small'),
('진에어',          'Jin Air',              'LJ', 'KR', FALSE, FALSE, 'small'),
('에어부산',        'Air Busan',            'BX', 'KR', FALSE, FALSE, 'small'),
('에어서울',        'Air Seoul',            'RS', 'KR', FALSE, FALSE, 'small'),
('이스타항공',      'Eastar Jet',           'ZE', 'KR', FALSE, FALSE, 'small'),
('에어로케이',      'Air Roc',              'RF', 'KR', FALSE, FALSE, 'small'),
('에어프레미아',    'Air Premia',           'YP', 'KR', FALSE, FALSE, 'small'),

-- ── 일본 ──────────────────────────────────────────────────────────────────
('전일본공수',      'All Nippon Airways (ANA)', 'NH', 'JP', FALSE, FALSE, 'large'),
('일본항공',        'Japan Airlines (JAL)',     'JL', 'JP', FALSE, FALSE, 'large'),
('피치항공',        'Peach Aviation',           'MM', 'JP', FALSE, FALSE, 'small'),
('젯스타재팬',      'Jetstar Japan',            'GK', 'JP', FALSE, FALSE, 'small'),

-- ── 중국 ──────────────────────────────────────────────────────────────────
('중국국제항공',    'Air China',              'CA', 'CN', FALSE, FALSE, 'large'),
('중국남방항공',    'China Southern Airlines', 'CZ', 'CN', FALSE, FALSE, 'large'),
('중국동방항공',    'China Eastern Airlines',  'MU', 'CN', FALSE, FALSE, 'large'),
('샤먼항공',        'Xiamen Airlines',         'MF', 'CN', FALSE, FALSE, 'large'),
('하이난항공',      'Hainan Airlines',         'HU', 'CN', FALSE, FALSE, 'large'),
('선전항공',        'Shenzhen Airlines',       'ZH', 'CN', FALSE, FALSE, 'small'),

-- ── 홍콩 / 대만 ───────────────────────────────────────────────────────────
('캐세이퍼시픽',    'Cathay Pacific',    'CX', 'HK', FALSE, FALSE, 'large'),
('에바항공',        'EVA Air',           'BR', 'TW', FALSE, FALSE, 'large'),
('중화항공',        'China Airlines',    'CI', 'TW', FALSE, FALSE, 'large'),

-- ── 동남아시아 ────────────────────────────────────────────────────────────
('타이항공',        'Thai Airways',               'TG', 'TH', FALSE, FALSE, 'large'),
('타이에어아시아',  'Thai AirAsia',               'FD', 'TH', FALSE, FALSE, 'small'),
('베트남항공',      'Vietnam Airlines',            'VN', 'VN', FALSE, FALSE, 'large'),
('비엣젯항공',      'VietJet Air',                'VJ', 'VN', FALSE, FALSE, 'small'),
('필리핀항공',      'Philippine Airlines',         'PR', 'PH', FALSE, FALSE, 'large'),
('세부퍼시픽',      'Cebu Pacific',                '5J', 'PH', FALSE, FALSE, 'small'),
('가루다인도네시아', 'Garuda Indonesia',            'GA', 'ID', FALSE, FALSE, 'large'),
('라이온에어',      'Lion Air',                    'JT', 'ID', FALSE, FALSE, 'small'),
('에어아시아',      'AirAsia',                     'AK', 'MY', FALSE, FALSE, 'large'),
('말레이시아항공',  'Malaysia Airlines',           'MH', 'MY', FALSE, FALSE, 'large'),
('스쿠트',          'Scoot',                       'TR', 'SG', FALSE, FALSE, 'small'),

-- ── 인도 ──────────────────────────────────────────────────────────────────
('에어인디아',      'Air India',     'AI', 'IN', FALSE, FALSE, 'large'),
('인디고',          'IndiGo',        '6E', 'IN', FALSE, FALSE, 'large'),
('스파이스젯',      'SpiceJet',      'SG', 'IN', FALSE, FALSE, 'small'),

-- ── 중동 ──────────────────────────────────────────────────────────────────
('에티하드항공',    'Etihad Airways',  'EY', 'AE', FALSE, FALSE, 'large'),
('플라이두바이',    'flydubai',        'FZ', 'AE', FALSE, FALSE, 'small'),
('사우디아',        'Saudia',          'SV', 'SA', FALSE, FALSE, 'large'),
('플라이나스',      'flynas',          'XY', 'SA', FALSE, FALSE, 'small'),
('걸프에어',        'Gulf Air',        'GF', 'BH', FALSE, FALSE, 'small'),
('쿠웨이트항공',    'Kuwait Airways',  'KU', 'KW', FALSE, FALSE, 'small'),
('오만에어',        'Oman Air',        'WY', 'OM', FALSE, FALSE, 'small'),
('로얄요르단',      'Royal Jordanian', 'RJ', 'JO', FALSE, FALSE, 'small'),
('이스라엘항공',    'El Al',           'LY', 'IL', FALSE, FALSE, 'small'),
('이집트항공',      'EgyptAir',        'MS', 'EG', FALSE, FALSE, 'small'),
('터키항공',        'Turkish Airlines','TK', 'TR', FALSE, FALSE, 'large'),
('페가수스항공',    'Pegasus Airlines','PC', 'TR', FALSE, FALSE, 'small'),

-- ── 유럽 — 추가 EU 항공사 ────────────────────────────────────────────────
('핀에어',          'Finnair',            'AY', 'FI', TRUE,  FALSE, 'large'),
('SAS',             'SAS',                'SK', 'SE', TRUE,  FALSE, 'large'),
('이베리아',        'Iberia',             'IB', 'ES', TRUE,  FALSE, 'large'),
('뷰엘링',          'Vueling',            'VY', 'ES', TRUE,  FALSE, 'large'),
('TAP항공',         'TAP Air Portugal',   'TP', 'PT', TRUE,  FALSE, 'large'),
('ITA항공',         'ITA Airways',        'AZ', 'IT', TRUE,  FALSE, 'large'),
('오스트리아항공',  'Austrian Airlines',  'OS', 'AT', TRUE,  FALSE, 'large'),
('브뤼셀항공',      'Brussels Airlines',  'SN', 'BE', TRUE,  FALSE, 'large'),
('스위스국제항공',  'Swiss International Air Lines', 'LX', 'CH', TRUE, FALSE, 'large'),
('LOT폴란드항공',   'LOT Polish Airlines','LO', 'PL', TRUE,  FALSE, 'large'),
('체코항공',        'Czech Airlines',     'OK', 'CZ', TRUE,  FALSE, 'small'),
('라이언에어',      'Ryanair',            'FR', 'IE', TRUE,  FALSE, 'large'),
('에어링구스',      'Aer Lingus',         'EI', 'IE', TRUE,  FALSE, 'large'),
('트랜스아비아',    'Transavia',          'HV', 'NL', TRUE,  FALSE, 'large'),
('이지젯유럽',      'easyJet Europe',     'EC', 'AT', TRUE,  FALSE, 'large'),
('아에로플로트',    'Aeroflot',           'SU', 'RU', FALSE, FALSE, 'large'),

-- ── 영국 — 추가 UK 항공사 ────────────────────────────────────────────────
('이지젯',          'easyJet',            'U2', 'GB', FALSE, TRUE,  'large'),
('버진애틀랜틱',    'Virgin Atlantic',    'VS', 'GB', FALSE, TRUE,  'large'),

-- ── 미국 — 추가 ──────────────────────────────────────────────────────────
('사우스웨스트항공','Southwest Airlines', 'WN', 'US', FALSE, FALSE, 'large'),
('알래스카항공',    'Alaska Airlines',    'AS', 'US', FALSE, FALSE, 'large'),
('제트블루',        'JetBlue',            'B6', 'US', FALSE, FALSE, 'large'),
('스피릿항공',      'Spirit Airlines',    'NK', 'US', FALSE, FALSE, 'small'),
('프론티어항공',    'Frontier Airlines',  'F9', 'US', FALSE, FALSE, 'small'),
('하와이안항공',    'Hawaiian Airlines',  'HA', 'US', FALSE, FALSE, 'small'),
('선컨트리항공',    'Sun Country Airlines','SY', 'US', FALSE, FALSE, 'small'),

-- ── 캐나다 ───────────────────────────────────────────────────────────────
('에어캐나다',      'Air Canada',     'AC', 'CA', FALSE, FALSE, 'large'),
('웨스트젯',        'WestJet',        'WS', 'CA', FALSE, FALSE, 'large'),
('에어트랜샛',      'Air Transat',    'TS', 'CA', FALSE, FALSE, 'large'),
('포터항공',        'Porter Airlines','PD', 'CA', FALSE, FALSE, 'small'),

-- ── 호주 / 뉴질랜드 ────────────────────────────────────────────────────
('콴타스',          'Qantas',            'QF', 'AU', FALSE, FALSE, 'large'),
('젯스타',          'Jetstar',           'JQ', 'AU', FALSE, FALSE, 'small'),
('버진오스트레일리아','Virgin Australia', 'VA', 'AU', FALSE, FALSE, 'large'),
('에어뉴질랜드',    'Air New Zealand',   'NZ', 'NZ', FALSE, FALSE, 'large'),

-- ── 아프리카 ─────────────────────────────────────────────────────────────
('에티오피아항공',  'Ethiopian Airlines','ET', 'ET', FALSE, FALSE, 'large'),
('케냐항공',        'Kenya Airways',     'KQ', 'KE', FALSE, FALSE, 'small'),
('모로코항공',      'Royal Air Maroc',   'AT', 'MA', FALSE, FALSE, 'small'),
('사우스아프리칸',  'South African Airways', 'SA', 'ZA', FALSE, FALSE, 'small'),

-- ── 중남미 ───────────────────────────────────────────────────────────────
('LATAM항공',       'LATAM Airlines',    'LA', 'CL', FALSE, FALSE, 'large'),
('아비앙카',        'Avianca',           'AV', 'CO', FALSE, FALSE, 'large'),
('아에로멕시코',    'Aeromexico',        'AM', 'MX', FALSE, FALSE, 'large'),
('아르헨티나항공',  'Aerolíneas Argentinas', 'AR', 'AR', FALSE, FALSE, 'small');
