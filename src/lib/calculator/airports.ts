export interface AirportInfo {
  iata: string;
  country: string;
  lat: number;
  lon: number;
  city: string;      // English city name
  cityKr: string;    // Korean city name
  name: string;      // Airport name (English)
}

// EU 27개 회원국 + EEA(IS, NO, LI) + 스위스(CH, EU261 적용)
export const EU_EEA_COUNTRIES = new Set([
  'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR',
  'DE','GR','HU','IE','IT','LV','LT','LU','MT','NL',
  'PL','PT','RO','SK','SI','ES','SE',
  'IS','NO','LI','CH',
]);

export const UK_COUNTRIES = new Set(['GB']);

type RawAirport = { country: string; lat: number; lon: number; city: string; cityKr: string; name: string };

const AIRPORTS: Record<string, RawAirport> = {
  // ── 한국 ──────────────────────────────────────────────────────────────────
  ICN: { country:'KR', lat:37.4602, lon:126.4407, city:'Seoul',     cityKr:'서울 (인천)',  name:'Incheon International Airport' },
  GMP: { country:'KR', lat:37.5584, lon:126.7942, city:'Seoul',     cityKr:'서울 (김포)',  name:'Gimpo International Airport' },
  PUS: { country:'KR', lat:35.1795, lon:128.9382, city:'Busan',     cityKr:'부산',        name:'Gimhae International Airport' },
  CJU: { country:'KR', lat:33.5113, lon:126.4930, city:'Jeju',      cityKr:'제주',        name:'Jeju International Airport' },
  TAE: { country:'KR', lat:35.8938, lon:128.6589, city:'Daegu',     cityKr:'대구',        name:'Daegu International Airport' },
  CJJ: { country:'KR', lat:36.7166, lon:127.4991, city:'Cheongju',  cityKr:'청주',        name:'Cheongju International Airport' },
  KWJ: { country:'KR', lat:35.1236, lon:126.8088, city:'Gwangju',   cityKr:'광주',        name:'Gwangju Airport' },
  RSU: { country:'KR', lat:34.8428, lon:127.6166, city:'Yeosu',     cityKr:'여수',        name:'Yeosu Airport' },
  WJU: { country:'KR', lat:37.4382, lon:127.9596, city:'Wonju',     cityKr:'원주',        name:'Wonju Airport' },
  USN: { country:'KR', lat:35.5935, lon:129.3517, city:'Ulsan',     cityKr:'울산',        name:'Ulsan Airport' },

  // ── 일본 ──────────────────────────────────────────────────────────────────
  NRT: { country:'JP', lat:35.7720, lon:140.3929, city:'Tokyo',    cityKr:'도쿄 (나리타)', name:'Narita International Airport' },
  HND: { country:'JP', lat:35.5494, lon:139.7798, city:'Tokyo',    cityKr:'도쿄 (하네다)', name:'Haneda Airport' },
  KIX: { country:'JP', lat:34.4347, lon:135.2440, city:'Osaka',    cityKr:'오사카 (간사이)', name:'Kansai International Airport' },
  ITM: { country:'JP', lat:34.7854, lon:135.4381, city:'Osaka',    cityKr:'오사카 (이타미)', name:'Itami Airport' },
  FUK: { country:'JP', lat:33.5858, lon:130.4508, city:'Fukuoka',  cityKr:'후쿠오카',    name:'Fukuoka Airport' },
  CTS: { country:'JP', lat:42.7752, lon:141.6922, city:'Sapporo',  cityKr:'삿포로',      name:'New Chitose Airport' },
  NGO: { country:'JP', lat:34.8583, lon:136.8054, city:'Nagoya',   cityKr:'나고야',      name:'Chubu Centrair International Airport' },
  OKA: { country:'JP', lat:26.1958, lon:127.6461, city:'Okinawa',  cityKr:'오키나와',    name:'Naha Airport' },
  HIJ: { country:'JP', lat:34.4361, lon:132.9194, city:'Hiroshima',cityKr:'히로시마',    name:'Hiroshima Airport' },

  // ── 중국 ──────────────────────────────────────────────────────────────────
  PEK: { country:'CN', lat:40.0799, lon:116.6031, city:'Beijing',   cityKr:'베이징 (수도)', name:'Beijing Capital International Airport' },
  PKX: { country:'CN', lat:39.5097, lon:116.4105, city:'Beijing',   cityKr:'베이징 (다싱)', name:'Beijing Daxing International Airport' },
  PVG: { country:'CN', lat:31.1443, lon:121.8083, city:'Shanghai',  cityKr:'상하이 (푸동)', name:'Shanghai Pudong International Airport' },
  SHA: { country:'CN', lat:31.1979, lon:121.3368, city:'Shanghai',  cityKr:'상하이 (훙차오)', name:'Shanghai Hongqiao International Airport' },
  CAN: { country:'CN', lat:23.3924, lon:113.2988, city:'Guangzhou', cityKr:'광저우',      name:'Guangzhou Baiyun International Airport' },
  CTU: { country:'CN', lat:30.5785, lon:103.9467, city:'Chengdu',   cityKr:'청두',        name:'Chengdu Tianfu International Airport' },
  SZX: { country:'CN', lat:22.6393, lon:113.8108, city:'Shenzhen',  cityKr:'선전',        name:'Shenzhen Bao\'an International Airport' },
  XIY: { country:'CN', lat:34.4471, lon:108.7516, city:"Xi'an",     cityKr:'시안',        name:"Xi'an Xianyang International Airport" },
  KMG: { country:'CN', lat:24.9924, lon:102.7433, city:'Kunming',   cityKr:'쿤밍',        name:'Kunming Changshui International Airport' },
  WUH: { country:'CN', lat:30.7838, lon:114.2081, city:'Wuhan',     cityKr:'우한',        name:'Wuhan Tianhe International Airport' },
  XMN: { country:'CN', lat:24.5440, lon:118.1277, city:'Xiamen',    cityKr:'샤먼',        name:'Xiamen Gaoqi International Airport' },
  HGH: { country:'CN', lat:30.2295, lon:120.4346, city:'Hangzhou',  cityKr:'항저우',      name:'Hangzhou Xiaoshan International Airport' },
  NKG: { country:'CN', lat:31.7420, lon:118.8620, city:'Nanjing',   cityKr:'난징',        name:'Nanjing Lukou International Airport' },
  DLC: { country:'CN', lat:38.9657, lon:121.5386, city:'Dalian',    cityKr:'다롄',        name:'Dalian Zhoushuizi International Airport' },
  HRB: { country:'CN', lat:45.6234, lon:126.2503, city:'Harbin',    cityKr:'하얼빈',      name:'Harbin Taiping International Airport' },

  // ── 홍콩 / 마카오 / 대만 ──────────────────────────────────────────────────
  HKG: { country:'HK', lat:22.3080, lon:113.9185, city:'Hong Kong', cityKr:'홍콩',        name:'Hong Kong International Airport' },
  MFM: { country:'MO', lat:22.1496, lon:113.5920, city:'Macau',     cityKr:'마카오',      name:'Macau International Airport' },
  TPE: { country:'TW', lat:25.0797, lon:121.2342, city:'Taipei',    cityKr:'타이베이 (타오위안)', name:'Taiwan Taoyuan International Airport' },
  TSA: { country:'TW', lat:25.0694, lon:121.5522, city:'Taipei',    cityKr:'타이베이 (쑹산)', name:'Taipei Songshan Airport' },
  KHH: { country:'TW', lat:22.5771, lon:120.3500, city:'Kaohsiung', cityKr:'가오슝',      name:'Kaohsiung International Airport' },

  // ── 동남아시아 ────────────────────────────────────────────────────────────
  SIN: { country:'SG', lat:1.3644,  lon:103.9915, city:'Singapore',        cityKr:'싱가포르',    name:'Singapore Changi Airport' },
  KUL: { country:'MY', lat:2.7456,  lon:101.7072, city:'Kuala Lumpur',     cityKr:'쿠알라룸푸르', name:'Kuala Lumpur International Airport' },
  BKK: { country:'TH', lat:13.6900, lon:100.7501, city:'Bangkok',          cityKr:'방콕 (수완나품)', name:'Suvarnabhumi Airport' },
  DMK: { country:'TH', lat:13.9126, lon:100.6067, city:'Bangkok',          cityKr:'방콕 (돈므앙)', name:"Don Mueang International Airport" },
  HKT: { country:'TH', lat:8.1132,  lon:98.3169,  city:'Phuket',           cityKr:'푸켓',        name:'Phuket International Airport' },
  CNX: { country:'TH', lat:18.7668, lon:98.9627,  city:'Chiang Mai',       cityKr:'치앙마이',    name:'Chiang Mai International Airport' },
  CGK: { country:'ID', lat:-6.1256, lon:106.6559, city:'Jakarta',          cityKr:'자카르타',    name:'Soekarno-Hatta International Airport' },
  DPS: { country:'ID', lat:-8.7482, lon:115.1670, city:'Bali',             cityKr:'발리',        name:'Ngurah Rai International Airport' },
  SUB: { country:'ID', lat:-7.3798, lon:112.7872, city:'Surabaya',         cityKr:'수라바야',    name:'Juanda International Airport' },
  MNL: { country:'PH', lat:14.5086, lon:121.0194, city:'Manila',           cityKr:'마닐라',      name:'Ninoy Aquino International Airport' },
  CEB: { country:'PH', lat:10.3075, lon:123.9791, city:'Cebu',             cityKr:'세부',        name:'Mactan-Cebu International Airport' },
  SGN: { country:'VN', lat:10.8188, lon:106.6520, city:'Ho Chi Minh City', cityKr:'호치민',      name:'Tan Son Nhat International Airport' },
  HAN: { country:'VN', lat:21.2212, lon:105.8072, city:'Hanoi',            cityKr:'하노이',      name:'Noi Bai International Airport' },
  DAD: { country:'VN', lat:16.0439, lon:108.1992, city:'Da Nang',          cityKr:'다낭',        name:'Da Nang International Airport' },
  RGN: { country:'MM', lat:16.9073, lon:96.1332,  city:'Yangon',           cityKr:'양곤',        name:'Yangon International Airport' },
  PNH: { country:'KH', lat:11.5466, lon:104.8440, city:'Phnom Penh',       cityKr:'프놈펜',      name:'Phnom Penh International Airport' },
  REP: { country:'KH', lat:13.4107, lon:103.8130, city:'Siem Reap',        cityKr:'씨엠립',      name:'Siem Reap International Airport' },

  // ── 인도 ──────────────────────────────────────────────────────────────────
  DEL: { country:'IN', lat:28.5562, lon:77.1000,  city:'Delhi',      cityKr:'델리',        name:'Indira Gandhi International Airport' },
  BOM: { country:'IN', lat:19.0896, lon:72.8656,  city:'Mumbai',     cityKr:'뭄바이',      name:'Chhatrapati Shivaji Maharaj International Airport' },
  MAA: { country:'IN', lat:12.9941, lon:80.1709,  city:'Chennai',    cityKr:'첸나이',      name:'Chennai International Airport' },
  CCU: { country:'IN', lat:22.6547, lon:88.4467,  city:'Kolkata',    cityKr:'콜카타',      name:'Netaji Subhas Chandra Bose International Airport' },
  HYD: { country:'IN', lat:17.2313, lon:78.4298,  city:'Hyderabad',  cityKr:'하이데라바드', name:'Rajiv Gandhi International Airport' },
  BLR: { country:'IN', lat:13.1986, lon:77.7066,  city:'Bengaluru',  cityKr:'벵갈루루',    name:'Kempegowda International Airport' },
  AMD: { country:'IN', lat:23.0772, lon:72.6347,  city:'Ahmedabad',  cityKr:'아마다바드',  name:'Sardar Vallabhbhai Patel International Airport' },
  GOI: { country:'IN', lat:15.3808, lon:73.8314,  city:'Goa',        cityKr:'고아',        name:'Goa International Airport' },

  // ── 중동 ──────────────────────────────────────────────────────────────────
  DXB: { country:'AE', lat:25.2532, lon:55.3657,  city:'Dubai',      cityKr:'두바이',      name:'Dubai International Airport' },
  AUH: { country:'AE', lat:24.4330, lon:54.6511,  city:'Abu Dhabi',  cityKr:'아부다비',    name:'Abu Dhabi International Airport' },
  SHJ: { country:'AE', lat:25.3286, lon:55.5172,  city:'Sharjah',    cityKr:'샤르자',      name:'Sharjah International Airport' },
  DOH: { country:'QA', lat:25.2731, lon:51.6083,  city:'Doha',       cityKr:'도하',        name:'Hamad International Airport' },
  RUH: { country:'SA', lat:24.9579, lon:46.6988,  city:'Riyadh',     cityKr:'리야드',      name:'King Khalid International Airport' },
  JED: { country:'SA', lat:21.6796, lon:39.1565,  city:'Jeddah',     cityKr:'제다',        name:'King Abdulaziz International Airport' },
  DMM: { country:'SA', lat:26.4712, lon:49.7979,  city:'Dammam',     cityKr:'담맘',        name:'King Fahd International Airport' },
  MED: { country:'SA', lat:24.5534, lon:39.7051,  city:'Medina',     cityKr:'메디나',      name:'Prince Mohammad Bin Abdulaziz Airport' },
  BAH: { country:'BH', lat:26.2708, lon:50.6336,  city:'Bahrain',    cityKr:'바레인',      name:'Bahrain International Airport' },
  KWI: { country:'KW', lat:29.2266, lon:47.9689,  city:'Kuwait City',cityKr:'쿠웨이트',    name:'Kuwait International Airport' },
  MCT: { country:'OM', lat:23.5933, lon:58.2844,  city:'Muscat',     cityKr:'무스카트',    name:'Muscat International Airport' },
  AMM: { country:'JO', lat:31.7226, lon:35.9932,  city:'Amman',      cityKr:'암만',        name:'Queen Alia International Airport' },
  TLV: { country:'IL', lat:32.0114, lon:34.8867,  city:'Tel Aviv',   cityKr:'텔아비브',    name:'Ben Gurion International Airport' },
  CAI: { country:'EG', lat:30.1219, lon:31.4056,  city:'Cairo',      cityKr:'카이로',      name:'Cairo International Airport' },
  IST: { country:'TR', lat:41.2753, lon:28.7519,  city:'Istanbul',   cityKr:'이스탄불',    name:'Istanbul Airport' },
  SAW: { country:'TR', lat:40.8985, lon:29.3092,  city:'Istanbul',   cityKr:'이스탄불 (사비하)', name:'Istanbul Sabiha Gökçen International Airport' },
  ESB: { country:'TR', lat:40.1281, lon:32.9951,  city:'Ankara',     cityKr:'앙카라',      name:'Esenboğa International Airport' },
  AYT: { country:'TR', lat:36.8987, lon:30.8005,  city:'Antalya',    cityKr:'안탈리아',    name:'Antalya Airport' },

  // ── 영국 ──────────────────────────────────────────────────────────────────
  LHR: { country:'GB', lat:51.4775, lon:-0.4614,  city:'London',     cityKr:'런던 (히드로)', name:'Heathrow Airport' },
  LGW: { country:'GB', lat:51.1537, lon:-0.1821,  city:'London',     cityKr:'런던 (개트윅)', name:'Gatwick Airport' },
  LTN: { country:'GB', lat:51.8747, lon:-0.3683,  city:'London',     cityKr:'런던 (루턴)',  name:'London Luton Airport' },
  STN: { country:'GB', lat:51.8850, lon:0.2350,   city:'London',     cityKr:'런던 (스탠스테드)', name:'London Stansted Airport' },
  MAN: { country:'GB', lat:53.3537, lon:-2.2750,  city:'Manchester', cityKr:'맨체스터',    name:'Manchester Airport' },
  EDI: { country:'GB', lat:55.9502, lon:-3.3725,  city:'Edinburgh',  cityKr:'에든버러',    name:'Edinburgh Airport' },
  GLA: { country:'GB', lat:55.8718, lon:-4.4331,  city:'Glasgow',    cityKr:'글래스고',    name:'Glasgow Airport' },
  BHX: { country:'GB', lat:52.4539, lon:-1.7480,  city:'Birmingham', cityKr:'버밍엄',      name:'Birmingham Airport' },
  BRS: { country:'GB', lat:51.3827, lon:-2.7191,  city:'Bristol',    cityKr:'브리스틀',    name:'Bristol Airport' },

  // ── 서유럽 (EU) ───────────────────────────────────────────────────────────
  CDG: { country:'FR', lat:49.0097, lon:2.5478,   city:'Paris',      cityKr:'파리 (CDG)',  name:'Paris-Charles de Gaulle Airport' },
  ORY: { country:'FR', lat:48.7233, lon:2.3794,   city:'Paris',      cityKr:'파리 (오를리)', name:'Paris-Orly Airport' },
  LYS: { country:'FR', lat:45.7256, lon:5.0811,   city:'Lyon',       cityKr:'리옹',        name:'Lyon-Saint Exupéry Airport' },
  NCE: { country:'FR', lat:43.6584, lon:7.2159,   city:'Nice',       cityKr:'니스',        name:"Nice Côte d'Azur Airport" },
  MRS: { country:'FR', lat:43.4393, lon:5.2214,   city:'Marseille',  cityKr:'마르세유',    name:'Marseille Provence Airport' },
  FRA: { country:'DE', lat:50.0379, lon:8.5622,   city:'Frankfurt',  cityKr:'프랑크푸르트', name:'Frankfurt Airport' },
  MUC: { country:'DE', lat:48.3537, lon:11.7750,  city:'Munich',     cityKr:'뮌헨',        name:'Munich Airport' },
  BER: { country:'DE', lat:52.3667, lon:13.5033,  city:'Berlin',     cityKr:'베를린',      name:'Berlin Brandenburg Airport' },
  DUS: { country:'DE', lat:51.2895, lon:6.7668,   city:'Düsseldorf', cityKr:'뒤셀도르프',  name:'Düsseldorf Airport' },
  HAM: { country:'DE', lat:53.6304, lon:9.9882,   city:'Hamburg',    cityKr:'함부르크',    name:'Hamburg Airport' },
  STR: { country:'DE', lat:48.6899, lon:9.2220,   city:'Stuttgart',  cityKr:'슈투트가르트', name:'Stuttgart Airport' },
  AMS: { country:'NL', lat:52.3086, lon:4.7639,   city:'Amsterdam',  cityKr:'암스테르담',  name:'Amsterdam Airport Schiphol' },
  MAD: { country:'ES', lat:40.4936, lon:-3.5668,  city:'Madrid',     cityKr:'마드리드',    name:'Adolfo Suárez Madrid–Barajas Airport' },
  BCN: { country:'ES', lat:41.2974, lon:2.0833,   city:'Barcelona',  cityKr:'바르셀로나',  name:'Barcelona–El Prat Airport' },
  AGP: { country:'ES', lat:36.6749, lon:-4.4991,  city:'Málaga',     cityKr:'말라가',      name:'Málaga Airport' },
  PMI: { country:'ES', lat:39.5517, lon:2.7388,   city:'Palma',      cityKr:'팔마',        name:'Palma de Mallorca Airport' },
  FCO: { country:'IT', lat:41.7999, lon:12.2462,  city:'Rome',       cityKr:'로마',        name:'Leonardo da Vinci–Fiumicino Airport' },
  MXP: { country:'IT', lat:45.6301, lon:8.7231,   city:'Milan',      cityKr:'밀라노 (말펜사)', name:'Milan Malpensa Airport' },
  LIN: { country:'IT', lat:45.4456, lon:9.2769,   city:'Milan',      cityKr:'밀라노 (리나테)', name:'Milan Linate Airport' },
  VCE: { country:'IT', lat:45.5053, lon:12.3519,  city:'Venice',     cityKr:'베네치아',    name:'Venice Marco Polo Airport' },
  NAP: { country:'IT', lat:40.8860, lon:14.2908,  city:'Naples',     cityKr:'나폴리',      name:'Naples International Airport' },
  VIE: { country:'AT', lat:48.1102, lon:16.5697,  city:'Vienna',     cityKr:'빈',          name:'Vienna International Airport' },
  BRU: { country:'BE', lat:50.9014, lon:4.4844,   city:'Brussels',   cityKr:'브뤼셀',      name:'Brussels Airport' },
  CPH: { country:'DK', lat:55.6180, lon:12.6508,  city:'Copenhagen', cityKr:'코펜하겐',    name:'Copenhagen Airport' },
  ARN: { country:'SE', lat:59.6519, lon:17.9186,  city:'Stockholm',  cityKr:'스톡홀름',    name:'Stockholm Arlanda Airport' },
  GOT: { country:'SE', lat:57.6628, lon:12.2798,  city:'Gothenburg', cityKr:'예테보리',    name:'Gothenburg Landvetter Airport' },
  HEL: { country:'FI', lat:60.3172, lon:24.9633,  city:'Helsinki',   cityKr:'헬싱키',      name:'Helsinki Airport' },
  WAW: { country:'PL', lat:52.1657, lon:20.9671,  city:'Warsaw',     cityKr:'바르샤바',    name:'Warsaw Chopin Airport' },
  KRK: { country:'PL', lat:50.0777, lon:19.7848,  city:'Kraków',     cityKr:'크라쿠프',    name:'Kraków John Paul II International Airport' },
  PRG: { country:'CZ', lat:50.1008, lon:14.2600,  city:'Prague',     cityKr:'프라하',      name:'Václav Havel Airport Prague' },
  BUD: { country:'HU', lat:47.4298, lon:19.2611,  city:'Budapest',   cityKr:'부다페스트',  name:'Budapest Ferenc Liszt International Airport' },
  ATH: { country:'GR', lat:37.9364, lon:23.9445,  city:'Athens',     cityKr:'아테네',      name:'Athens International Airport' },
  LIS: { country:'PT', lat:38.7742, lon:-9.1342,  city:'Lisbon',     cityKr:'리스본',      name:'Lisbon Humberto Delgado Airport' },
  OPO: { country:'PT', lat:41.2481, lon:-8.6814,  city:'Porto',      cityKr:'포르투',      name:'Francisco de Sá Carneiro Airport' },
  DUB: { country:'IE', lat:53.4273, lon:-6.2436,  city:'Dublin',     cityKr:'더블린',      name:'Dublin Airport' },
  OTP: { country:'RO', lat:44.5711, lon:26.0850,  city:'Bucharest',  cityKr:'부쿠레슈티',  name:'Henri Coandă International Airport' },
  SOF: { country:'BG', lat:42.6952, lon:23.4114,  city:'Sofia',      cityKr:'소피아',      name:'Sofia Airport' },
  ZAG: { country:'HR', lat:45.7429, lon:16.0688,  city:'Zagreb',     cityKr:'자그레브',    name:'Zagreb Airport' },
  VNO: { country:'LT', lat:54.6341, lon:25.2858,  city:'Vilnius',    cityKr:'빌뉴스',      name:'Vilnius International Airport' },
  RIX: { country:'LV', lat:56.9236, lon:23.9711,  city:'Riga',       cityKr:'리가',        name:'Riga International Airport' },
  TLL: { country:'EE', lat:59.4133, lon:24.8328,  city:'Tallinn',    cityKr:'탈린',        name:'Lennart Meri Tallinn Airport' },
  HEL2: { country:'FI', lat:60.3172, lon:24.9633, city:'Helsinki',   cityKr:'헬싱키',      name:'Helsinki Airport' },

  // ── 노르웨이 / 아이슬란드 (EEA) ───────────────────────────────────────────
  OSL: { country:'NO', lat:60.1939, lon:11.0998,  city:'Oslo',       cityKr:'오슬로',      name:'Oslo Airport, Gardermoen' },
  BGO: { country:'NO', lat:60.2934, lon:5.2181,   city:'Bergen',     cityKr:'베르겐',      name:'Bergen Airport' },
  KEF: { country:'IS', lat:63.9850, lon:-22.6056, city:'Reykjavik',  cityKr:'레이캬비크',  name:'Keflavík International Airport' },

  // ── 스위스 (EU261 적용) ───────────────────────────────────────────────────
  ZRH: { country:'CH', lat:47.4647, lon:8.5492,   city:'Zurich',     cityKr:'취리히',      name:'Zurich Airport' },
  GVA: { country:'CH', lat:46.2380, lon:6.1089,   city:'Geneva',     cityKr:'제네바',      name:'Geneva Airport' },

  // ── 미국 ──────────────────────────────────────────────────────────────────
  JFK: { country:'US', lat:40.6413, lon:-73.7781,  city:'New York',      cityKr:'뉴욕 (JFK)',      name:'John F. Kennedy International Airport' },
  EWR: { country:'US', lat:40.6925, lon:-74.1687,  city:'New York',      cityKr:'뉴욕 (EWR)',      name:'Newark Liberty International Airport' },
  LGA: { country:'US', lat:40.7769, lon:-73.8740,  city:'New York',      cityKr:'뉴욕 (라과디아)',  name:'LaGuardia Airport' },
  LAX: { country:'US', lat:33.9425, lon:-118.4081, city:'Los Angeles',   cityKr:'로스앤젤레스',    name:'Los Angeles International Airport' },
  ORD: { country:'US', lat:41.9742, lon:-87.9073,  city:'Chicago',       cityKr:'시카고 (오헤어)',  name:"O'Hare International Airport" },
  MDW: { country:'US', lat:41.7868, lon:-87.7522,  city:'Chicago',       cityKr:'시카고 (미드웨이)', name:'Chicago Midway International Airport' },
  ATL: { country:'US', lat:33.6407, lon:-84.4277,  city:'Atlanta',       cityKr:'애틀랜타',        name:'Hartsfield–Jackson Atlanta International Airport' },
  SFO: { country:'US', lat:37.6213, lon:-122.3790, city:'San Francisco', cityKr:'샌프란시스코',    name:'San Francisco International Airport' },
  MIA: { country:'US', lat:25.7959, lon:-80.2870,  city:'Miami',         cityKr:'마이애미',        name:'Miami International Airport' },
  DFW: { country:'US', lat:32.8998, lon:-97.0403,  city:'Dallas',        cityKr:'댈러스',          name:'Dallas/Fort Worth International Airport' },
  BOS: { country:'US', lat:42.3656, lon:-71.0096,  city:'Boston',        cityKr:'보스턴',          name:'Boston Logan International Airport' },
  SEA: { country:'US', lat:47.4502, lon:-122.3088, city:'Seattle',       cityKr:'시애틀',          name:'Seattle-Tacoma International Airport' },
  DEN: { country:'US', lat:39.8561, lon:-104.6737, city:'Denver',        cityKr:'덴버',            name:'Denver International Airport' },
  LAS: { country:'US', lat:36.0840, lon:-115.1537, city:'Las Vegas',     cityKr:'라스베이거스',    name:'Harry Reid International Airport' },
  IAD: { country:'US', lat:38.9531, lon:-77.4565,  city:'Washington DC', cityKr:'워싱턴 DC (덜레스)', name:'Washington Dulles International Airport' },
  DCA: { country:'US', lat:38.8512, lon:-77.0402,  city:'Washington DC', cityKr:'워싱턴 DC (레이건)', name:'Ronald Reagan Washington National Airport' },
  MCO: { country:'US', lat:28.4312, lon:-81.3081,  city:'Orlando',       cityKr:'올랜도',          name:'Orlando International Airport' },
  PHX: { country:'US', lat:33.4373, lon:-112.0078, city:'Phoenix',       cityKr:'피닉스',          name:'Phoenix Sky Harbor International Airport' },
  IAH: { country:'US', lat:29.9902, lon:-95.3368,  city:'Houston',       cityKr:'휴스턴',          name:'George Bush Intercontinental Airport' },
  MSP: { country:'US', lat:44.8848, lon:-93.2223,  city:'Minneapolis',   cityKr:'미니애폴리스',    name:'Minneapolis–Saint Paul International Airport' },
  DTW: { country:'US', lat:42.2124, lon:-83.3534,  city:'Detroit',       cityKr:'디트로이트',      name:'Detroit Metropolitan Wayne County Airport' },
  PHL: { country:'US', lat:39.8729, lon:-75.2437,  city:'Philadelphia',  cityKr:'필라델피아',      name:'Philadelphia International Airport' },
  CLT: { country:'US', lat:35.2140, lon:-80.9431,  city:'Charlotte',     cityKr:'샬럿',            name:'Charlotte Douglas International Airport' },
  SAN: { country:'US', lat:32.7338, lon:-117.1933, city:'San Diego',     cityKr:'샌디에이고',      name:'San Diego International Airport' },
  PDX: { country:'US', lat:45.5887, lon:-122.5975, city:'Portland',      cityKr:'포틀랜드',        name:'Portland International Airport' },
  HNL: { country:'US', lat:21.3187, lon:-157.9225, city:'Honolulu',      cityKr:'호놀룰루',        name:'Daniel K. Inouye International Airport' },
  ANC: { country:'US', lat:61.1744, lon:-149.9982, city:'Anchorage',     cityKr:'앵커리지',        name:'Ted Stevens Anchorage International Airport' },

  // ── 캐나다 ────────────────────────────────────────────────────────────────
  YYZ: { country:'CA', lat:43.6777, lon:-79.6248,  city:'Toronto',    cityKr:'토론토',      name:'Toronto Pearson International Airport' },
  YVR: { country:'CA', lat:49.1939, lon:-123.1844, city:'Vancouver',  cityKr:'밴쿠버',      name:'Vancouver International Airport' },
  YUL: { country:'CA', lat:45.4706, lon:-73.7408,  city:'Montreal',   cityKr:'몬트리올',    name:'Montréal-Trudeau International Airport' },
  YYC: { country:'CA', lat:51.1215, lon:-114.0133, city:'Calgary',    cityKr:'캘거리',      name:'Calgary International Airport' },
  YEG: { country:'CA', lat:53.3097, lon:-113.5800, city:'Edmonton',   cityKr:'에드먼턴',    name:'Edmonton International Airport' },
  YOW: { country:'CA', lat:45.3225, lon:-75.6692,  city:'Ottawa',     cityKr:'오타와',      name:'Ottawa Macdonald–Cartier International Airport' },
  YHZ: { country:'CA', lat:44.8808, lon:-63.5086,  city:'Halifax',    cityKr:'핼리팩스',    name:'Halifax Stanfield International Airport' },

  // ── 호주 / 뉴질랜드 ──────────────────────────────────────────────────────
  SYD: { country:'AU', lat:-33.9399, lon:151.1753, city:'Sydney',     cityKr:'시드니',      name:'Sydney Kingsford Smith Airport' },
  MEL: { country:'AU', lat:-37.6690, lon:144.8410, city:'Melbourne',  cityKr:'멜버른',      name:'Melbourne Airport' },
  BNE: { country:'AU', lat:-27.3842, lon:153.1175, city:'Brisbane',   cityKr:'브리즈번',    name:'Brisbane Airport' },
  PER: { country:'AU', lat:-31.9403, lon:115.9669, city:'Perth',      cityKr:'퍼스',        name:'Perth Airport' },
  ADL: { country:'AU', lat:-34.9450, lon:138.5308, city:'Adelaide',   cityKr:'애들레이드',  name:'Adelaide Airport' },
  AKL: { country:'NZ', lat:-37.0082, lon:174.7917, city:'Auckland',   cityKr:'오클랜드',    name:'Auckland Airport' },
  CHC: { country:'NZ', lat:-43.4894, lon:172.5322, city:'Christchurch',cityKr:'크라이스트처치', name:'Christchurch Airport' },

  // ── 아프리카 ──────────────────────────────────────────────────────────────
  JNB: { country:'ZA', lat:-26.1392, lon:28.2460,  city:'Johannesburg',  cityKr:'요하네스버그', name:'OR Tambo International Airport' },
  CPT: { country:'ZA', lat:-33.9715, lon:18.6021,  city:'Cape Town',     cityKr:'케이프타운',  name:'Cape Town International Airport' },
  ADD: { country:'ET', lat:8.9779,   lon:38.7993,  city:'Addis Ababa',   cityKr:'아디스아바바', name:'Addis Ababa Bole International Airport' },
  NBO: { country:'KE', lat:-1.3192,  lon:36.9275,  city:'Nairobi',       cityKr:'나이로비',    name:'Jomo Kenyatta International Airport' },
  LOS: { country:'NG', lat:6.5774,   lon:3.3216,   city:'Lagos',         cityKr:'라고스',      name:'Murtala Muhammed International Airport' },
  CMN: { country:'MA', lat:33.3675,  lon:-7.5897,  city:'Casablanca',    cityKr:'카사블랑카',  name:'Mohammed V International Airport' },
  CAI2: { country:'EG', lat:30.1219, lon:31.4056,  city:'Cairo',         cityKr:'카이로',      name:'Cairo International Airport' },

  // ── 중남미 ────────────────────────────────────────────────────────────────
  GRU: { country:'BR', lat:-23.4356, lon:-46.4731, city:'São Paulo',         cityKr:'상파울루',        name:'São Paulo/Guarulhos International Airport' },
  GIG: { country:'BR', lat:-22.8099, lon:-43.2505, city:'Rio de Janeiro',    cityKr:'리우데자네이루',  name:'Rio de Janeiro/Galeão International Airport' },
  BSB: { country:'BR', lat:-15.8711, lon:-47.9186, city:'Brasília',          cityKr:'브라질리아',      name:'Brasília International Airport' },
  MEX: { country:'MX', lat:19.4363,  lon:-99.0721, city:'Mexico City',       cityKr:'멕시코시티',      name:'Mexico City International Airport' },
  BOG: { country:'CO', lat:4.7016,   lon:-74.1469, city:'Bogotá',            cityKr:'보고타',          name:'El Dorado International Airport' },
  LIM: { country:'PE', lat:-12.0219, lon:-77.1143, city:'Lima',              cityKr:'리마',            name:'Jorge Chávez International Airport' },
  EZE: { country:'AR', lat:-34.8222, lon:-58.5358, city:'Buenos Aires',      cityKr:'부에노스아이레스', name:'Ministro Pistarini International Airport' },
  SCL: { country:'CL', lat:-33.3930, lon:-70.7858, city:'Santiago',          cityKr:'산티아고',        name:'Arturo Merino Benítez International Airport' },
  GYE: { country:'EC', lat:-2.1574,  lon:-79.8836, city:'Guayaquil',         cityKr:'과야킬',          name:'José Joaquín de Olmedo International Airport' },

  // ── 러시아 / 중앙아시아 ───────────────────────────────────────────────────
  SVO: { country:'RU', lat:55.9726, lon:37.4146,  city:'Moscow',     cityKr:'모스크바 (셰레메티예보)', name:'Sheremetyevo International Airport' },
  DME: { country:'RU', lat:55.4088, lon:37.9063,  city:'Moscow',     cityKr:'모스크바 (도모데도보)',   name:'Domodedovo International Airport' },
  LED: { country:'RU', lat:59.8003, lon:30.2625,  city:'St Petersburg', cityKr:'상트페테르부르크',  name:'Pulkovo Airport' },
  ALA: { country:'KZ', lat:43.3521, lon:77.0405,  city:'Almaty',     cityKr:'알마티',      name:'Almaty International Airport' },
};

// ── 공개 API ────────────────────────────────────────────────────────────────

export function getAirport(iata: string): AirportInfo | null {
  const code = iata.toUpperCase().trim();
  const data = AIRPORTS[code];
  if (!data) return null;
  return { iata: code, ...data };
}

// 검색용 전체 목록 (드롭다운용)
export function getAllAirports(): AirportInfo[] {
  return Object.entries(AIRPORTS).map(([iata, data]) => ({ iata, ...data }));
}

export function searchAirports(query: string, locale: string): AirportInfo[] {
  if (!query || query.trim().length < 1) return [];
  const q = query.trim().toLowerCase();
  const all = getAllAirports();

  return all.filter(a => {
    const iataMatch = a.iata.toLowerCase().startsWith(q);
    const cityMatch = a.city.toLowerCase().includes(q);
    const nameMatch = a.name.toLowerCase().includes(q);
    const cityKrMatch = locale === 'kr' && a.cityKr.includes(query.trim());
    return iataMatch || cityMatch || nameMatch || cityKrMatch;
  }).slice(0, 8); // 최대 8개
}

export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
