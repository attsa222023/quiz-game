/* ---------------- Data ---------------- */
const CATEGORIES = [
  {
    name: "Countries in the European Union",
    group: "Geography",
    answers: [
      "Austria","Belgium","Bulgaria","Croatia","Cyprus","Czech Republic","Denmark","Estonia",
      "Finland","France","Germany","Greece","Hungary","Ireland","Italy","Latvia","Lithuania",
      "Luxembourg","Malta","Netherlands","Poland","Portugal","Romania","Slovakia","Slovenia",
      "Spain","Sweden"
    ]
  },
  {
    name: "G20 Member Countries",
    group: "Geography",
    answers: [
      "Argentina","Australia","Brazil","Canada","China","France","Germany","India","Indonesia",
      "Italy","Japan","Mexico","Russia","Saudi Arabia","South Africa","South Korea","Turkey",
      "United Kingdom","United States","European Union"
    ],
    aliases: { "United States": ["USA","US","U.S.","America"], "United Kingdom": ["UK","U.K.","Britain"], "South Korea": ["Korea"] }
  },
  {
    name: "US States Bordering the Pacific Ocean or Canada",
    group: "Geography",
    answers: [
      "Washington","Oregon","California","Alaska","Hawaii","Idaho","Montana","North Dakota",
      "Minnesota","Michigan","New York","Vermont","New Hampshire","Maine"
    ]
  },
  {
    name: "All 50 US States",
    group: "Geography",
    answers: [
      "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware",
      "Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky",
      "Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi",
      "Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico",
      "New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania",
      "Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
      "Virginia","Washington","West Virginia","Wisconsin","Wyoming"
    ]
  },
  {
    name: "Japan Prefectures",
    group: "Geography",
    languages: {
      en: {
        answers: [
          "Hokkaido","Aomori","Iwate","Miyagi","Akita","Yamagata","Fukushima","Ibaraki","Tochigi",
          "Gunma","Saitama","Chiba","Tokyo","Kanagawa","Niigata","Toyama","Ishikawa","Fukui",
          "Yamanashi","Nagano","Gifu","Shizuoka","Aichi","Mie","Shiga","Kyoto","Osaka","Hyogo",
          "Nara","Wakayama","Tottori","Shimane","Okayama","Hiroshima","Yamaguchi","Tokushima",
          "Kagawa","Ehime","Kochi","Fukuoka","Saga","Nagasaki","Kumamoto","Oita","Miyazaki",
          "Kagoshima","Okinawa"
        ]
      },
      ja: {
        answers: [
          "北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県","茨城県","栃木県",
          "群馬県","埼玉県","千葉県","東京都","神奈川県","新潟県","富山県","石川県","福井県",
          "山梨県","長野県","岐阜県","静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県",
          "奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県","徳島県",
          "香川県","愛媛県","高知県","福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県",
          "鹿児島県","沖縄県"
        ],
        aliases: {
          "青森県": ["青森"], "岩手県": ["岩手"], "宮城県": ["宮城"], "秋田県": ["秋田"],
          "山形県": ["山形"], "福島県": ["福島"], "茨城県": ["茨城"], "栃木県": ["栃木"],
          "群馬県": ["群馬"], "埼玉県": ["埼玉"], "千葉県": ["千葉"], "東京都": ["東京"],
          "神奈川県": ["神奈川"], "新潟県": ["新潟"], "富山県": ["富山"], "石川県": ["石川"],
          "福井県": ["福井"], "山梨県": ["山梨"], "長野県": ["長野"], "岐阜県": ["岐阜"],
          "静岡県": ["静岡"], "愛知県": ["愛知"], "三重県": ["三重"], "滋賀県": ["滋賀"],
          "京都府": ["京都"], "大阪府": ["大阪"], "兵庫県": ["兵庫"], "奈良県": ["奈良"],
          "和歌山県": ["和歌山"], "鳥取県": ["鳥取"], "島根県": ["島根"], "岡山県": ["岡山"],
          "広島県": ["広島"], "山口県": ["山口"], "徳島県": ["徳島"], "香川県": ["香川"],
          "愛媛県": ["愛媛"], "高知県": ["高知"], "福岡県": ["福岡"], "佐賀県": ["佐賀"],
          "長崎県": ["長崎"], "熊本県": ["熊本"], "大分県": ["大分"], "宮崎県": ["宮崎"],
          "鹿児島県": ["鹿児島"], "沖縄県": ["沖縄"]
        }
      }
    }
  },
  {
    // Source: zh.wikipedia.org "台北捷運車站列表" - that page's table has 117
    // rows, but 9 stations (interchanges like 大安, 中山, 台北車站) get one row
    // per line they serve, so there are only 108 actually-unique station
    // names - which is what a naming quiz needs (a duplicate answer can't
    // be "found" twice). ZH only for now, structured with `languages` so an
    // English name set can be added later without reshaping this entry.
    name: "Taipei MRT Stations",
    group: "Geography",
    languages: {
      zh: {
        answers: [
          "動物園","木柵","萬芳社區","萬芳醫院","辛亥","麟光","六張犁","科技大樓","大安","忠孝復興",
          "南京復興","中山國中","松山機場","大直","劍南路","西湖","港墘","文德","內湖","大湖公園",
          "葫洲","東湖","南港軟體園區","南港展覽館","象山","台北101/世貿","信義安和","大安森林公園","東門","中正紀念堂",
          "台大醫院","台北車站","中山","雙連","民權西路","圓山","劍潭","士林","芝山","明德",
          "石牌","唭哩岸","奇岩","北投","新北投","復興崗","忠義","關渡","竹圍","紅樹林",
          "淡水","新店","新店區公所","七張","小碧潭","大坪林","景美","萬隆","公館","台電大樓",
          "古亭","小南門","西門","北門","松江南京","台北小巨蛋","南京三民","松山","南勢角","景安",
          "永安市場","頂溪","忠孝新生","行天宮","中山國小","大橋頭","台北橋","菜寮","三重","先嗇宮",
          "頭前庄","新莊","輔大","丹鳳","迴龍","三重國小","三和國中","徐匯中學","三民高中","蘆洲",
          "頂埔","永寧","土城","海山","亞東醫院","府中","板橋","新埔","江子翠","龍山寺",
          "善導寺","忠孝敦化","國父紀念館","市政府","永春","後山埤","昆陽","南港"
        ]
      }
    }
  },
  {
    // Scoped to the 94 naturally occurring elements (Hydrogen through
    // Plutonium) rather than the full periodic table - unifies EN/ZH at the
    // same answer count and also sidesteps the rare-character/unsettled-
    // naming risk of the synthetic "superheavy" elements entirely.
    name: "Naturally Occurring Elements (Periodic Table)",
    group: "Science",
    languages: {
      en: {
        answers: [
          "Hydrogen","Helium","Lithium","Beryllium","Boron","Carbon","Nitrogen","Oxygen","Fluorine","Neon",
          "Sodium","Magnesium","Aluminium","Silicon","Phosphorus","Sulfur","Chlorine","Argon","Potassium","Calcium",
          "Scandium","Titanium","Vanadium","Chromium","Manganese","Iron","Cobalt","Nickel","Copper","Zinc",
          "Gallium","Germanium","Arsenic","Selenium","Bromine","Krypton","Rubidium","Strontium","Yttrium","Zirconium",
          "Niobium","Molybdenum","Technetium","Ruthenium","Rhodium","Palladium","Silver","Cadmium","Indium","Tin",
          "Antimony","Tellurium","Iodine","Xenon","Caesium","Barium","Lanthanum","Cerium","Praseodymium","Neodymium",
          "Promethium","Samarium","Europium","Gadolinium","Terbium","Dysprosium","Holmium","Erbium","Thulium","Ytterbium",
          "Lutetium","Hafnium","Tantalum","Tungsten","Rhenium","Osmium","Iridium","Platinum","Gold","Mercury",
          "Thallium","Lead","Bismuth","Polonium","Astatine","Radon","Francium","Radium","Actinium","Thorium",
          "Protactinium","Uranium","Neptunium","Plutonium"
        ],
        // Accepts each element's official chemical symbol as an answer
        // alongside the full name (e.g. "Fe" for Iron), plus the common
        // American/British spelling variants - same alias mechanism used
        // elsewhere (e.g. G20's "USA" for "United States").
        aliases: {
          "Hydrogen": ["H"], "Helium": ["He"], "Lithium": ["Li"], "Beryllium": ["Be"], "Boron": ["B"],
          "Carbon": ["C"], "Nitrogen": ["N"], "Oxygen": ["O"], "Fluorine": ["F"], "Neon": ["Ne"],
          "Sodium": ["Na"], "Magnesium": ["Mg"], "Aluminium": ["Al", "Aluminum"], "Silicon": ["Si"],
          "Phosphorus": ["P"], "Sulfur": ["S", "Sulphur"], "Chlorine": ["Cl"], "Argon": ["Ar"],
          "Potassium": ["K"], "Calcium": ["Ca"], "Scandium": ["Sc"], "Titanium": ["Ti"],
          "Vanadium": ["V"], "Chromium": ["Cr"], "Manganese": ["Mn"], "Iron": ["Fe"], "Cobalt": ["Co"],
          "Nickel": ["Ni"], "Copper": ["Cu"], "Zinc": ["Zn"], "Gallium": ["Ga"], "Germanium": ["Ge"],
          "Arsenic": ["As"], "Selenium": ["Se"], "Bromine": ["Br"], "Krypton": ["Kr"],
          "Rubidium": ["Rb"], "Strontium": ["Sr"], "Yttrium": ["Y"], "Zirconium": ["Zr"],
          "Niobium": ["Nb"], "Molybdenum": ["Mo"], "Technetium": ["Tc"], "Ruthenium": ["Ru"],
          "Rhodium": ["Rh"], "Palladium": ["Pd"], "Silver": ["Ag"], "Cadmium": ["Cd"], "Indium": ["In"],
          "Tin": ["Sn"], "Antimony": ["Sb"], "Tellurium": ["Te"], "Iodine": ["I"], "Xenon": ["Xe"],
          "Caesium": ["Cs", "Cesium"], "Barium": ["Ba"], "Lanthanum": ["La"], "Cerium": ["Ce"],
          "Praseodymium": ["Pr"], "Neodymium": ["Nd"], "Promethium": ["Pm"], "Samarium": ["Sm"],
          "Europium": ["Eu"], "Gadolinium": ["Gd"], "Terbium": ["Tb"], "Dysprosium": ["Dy"],
          "Holmium": ["Ho"], "Erbium": ["Er"], "Thulium": ["Tm"], "Ytterbium": ["Yb"],
          "Lutetium": ["Lu"], "Hafnium": ["Hf"], "Tantalum": ["Ta"], "Tungsten": ["W", "Wolfram"],
          "Rhenium": ["Re"], "Osmium": ["Os"], "Iridium": ["Ir"], "Platinum": ["Pt"], "Gold": ["Au"],
          "Mercury": ["Hg"], "Thallium": ["Tl"], "Lead": ["Pb"], "Bismuth": ["Bi"], "Polonium": ["Po"],
          "Astatine": ["At"], "Radon": ["Rn"], "Francium": ["Fr"], "Radium": ["Ra"],
          "Actinium": ["Ac"], "Thorium": ["Th"], "Protactinium": ["Pa"], "Uranium": ["U"],
          "Neptunium": ["Np"], "Plutonium": ["Pu"]
        }
      },
      zh: {
        answers: [
          "氫","氦","鋰","鈹","硼","碳","氮","氧","氟","氖",
          "鈉","鎂","鋁","矽","磷","硫","氯","氬","鉀","鈣",
          "鈧","鈦","釩","鉻","錳","鐵","鈷","鎳","銅","鋅",
          "鎵","鍺","砷","硒","溴","氪","銣","鍶","釔","鋯",
          "鈮","鉬","鎝","釕","銠","鈀","銀","鎘","銦","錫",
          "銻","碲","碘","氙","銫","鋇","鑭","鈰","鐠","釹",
          "鉕","釤","銪","釓","鋱","鏑","鈥","鉺","銩","鐿",
          "鎦","鉿","鉭","鎢","錸","鋨","銥","鉑","金","汞",
          "鉈","鉛","鉍","釙","砈","氡","鍅","鐳","錒","釷",
          "鏷","鈾","錼","鈽"
        ],
        // The international chemical symbol (e.g. "Fe") is accepted here
        // too, since symbols are language-neutral and this is a nice bit of
        // free reuse from the English side's own symbol list.
        aliases: {
          "氫": ["H"], "氦": ["He"], "鋰": ["Li"], "鈹": ["Be"], "硼": ["B"],
          "碳": ["C"], "氮": ["N"], "氧": ["O"], "氟": ["F"], "氖": ["Ne"],
          "鈉": ["Na"], "鎂": ["Mg"], "鋁": ["Al"], "矽": ["Si"],
          "磷": ["P"], "硫": ["S"], "氯": ["Cl"], "氬": ["Ar"],
          "鉀": ["K"], "鈣": ["Ca"], "鈧": ["Sc"], "鈦": ["Ti"],
          "釩": ["V"], "鉻": ["Cr"], "錳": ["Mn"], "鐵": ["Fe"], "鈷": ["Co"],
          "鎳": ["Ni"], "銅": ["Cu"], "鋅": ["Zn"], "鎵": ["Ga"], "鍺": ["Ge"],
          "砷": ["As"], "硒": ["Se"], "溴": ["Br"], "氪": ["Kr"],
          "銣": ["Rb"], "鍶": ["Sr"], "釔": ["Y"], "鋯": ["Zr"],
          "鈮": ["Nb"], "鉬": ["Mo"], "鎝": ["Tc"], "釕": ["Ru"],
          "銠": ["Rh"], "鈀": ["Pd"], "銀": ["Ag"], "鎘": ["Cd"], "銦": ["In"],
          "錫": ["Sn"], "銻": ["Sb"], "碲": ["Te"], "碘": ["I"], "氙": ["Xe"],
          "銫": ["Cs"], "鋇": ["Ba"], "鑭": ["La"], "鈰": ["Ce"],
          "鐠": ["Pr"], "釹": ["Nd"], "鉕": ["Pm"], "釤": ["Sm"],
          "銪": ["Eu"], "釓": ["Gd"], "鋱": ["Tb"], "鏑": ["Dy"],
          "鈥": ["Ho"], "鉺": ["Er"], "銩": ["Tm"], "鐿": ["Yb"],
          "鎦": ["Lu"], "鉿": ["Hf"], "鉭": ["Ta"], "鎢": ["W"],
          "錸": ["Re"], "鋨": ["Os"], "銥": ["Ir"], "鉑": ["Pt"], "金": ["Au"],
          "汞": ["Hg"], "鉈": ["Tl"], "鉛": ["Pb"], "鉍": ["Bi"], "釙": ["Po"],
          "砈": ["At"], "氡": ["Rn"], "鍅": ["Fr"], "鐳": ["Ra"],
          "錒": ["Ac"], "釷": ["Th"], "鏷": ["Pa"], "鈾": ["U"],
          "錼": ["Np"], "鈽": ["Pu"]
        }
      }
    }
  },
  {
    // Source: en.wikipedia.org "IAU designated constellations" (names +
    // official 3-letter IAU abbreviations) and zh.wikipedia.org "星座列表"
    // (Traditional Chinese names) - both fetched as raw wikitext and cross-
    // matched by Latin name, same rigor as the elements/MRT/surname
    // categories, since a wrong constellation name is just as checkable.
    name: "88 IAU Constellations",
    group: "Science",
    languages: {
      en: {
        answers: [
          "Andromeda","Antlia","Apus","Aquarius","Aquila","Ara","Aries","Auriga","Boötes","Caelum",
          "Camelopardalis","Cancer","Canes Venatici","Canis Major","Canis Minor","Capricornus","Carina","Cassiopeia","Centaurus","Cepheus",
          "Cetus","Chamaeleon","Circinus","Columba","Coma Berenices","Corona Australis","Corona Borealis","Corvus","Crater","Crux",
          "Cygnus","Delphinus","Dorado","Draco","Equuleus","Eridanus","Fornax","Gemini","Grus","Hercules",
          "Horologium","Hydra","Hydrus","Indus","Lacerta","Leo","Leo Minor","Lepus","Libra","Lupus",
          "Lynx","Lyra","Mensa","Microscopium","Monoceros","Musca","Norma","Octans","Ophiuchus","Orion",
          "Pavo","Pegasus","Perseus","Phoenix","Pictor","Pisces","Piscis Austrinus","Puppis","Pyxis","Reticulum",
          "Sagitta","Sagittarius","Scorpius","Sculptor","Scutum","Serpens","Sextans","Taurus","Telescopium","Triangulum",
          "Triangulum Australe","Tucana","Ursa Major","Ursa Minor","Vela","Virgo","Volans","Vulpecula"
        ],
        // Official IAU 3-letter abbreviation accepted as an answer too -
        // same "acronym as answer" idea as the periodic table's chemical
        // symbols. Skips Ara/Leo since their abbreviation is identical to
        // the full name already.
        aliases: {
          "Andromeda": ["And"], "Antlia": ["Ant"], "Apus": ["Aps"], "Aquarius": ["Aqr"], "Aquila": ["Aql"],
          "Aries": ["Ari"], "Auriga": ["Aur"], "Boötes": ["Boo"], "Caelum": ["Cae"],
          "Camelopardalis": ["Cam"], "Cancer": ["Cnc"], "Canes Venatici": ["CVn"], "Canis Major": ["CMa"], "Canis Minor": ["CMi"],
          "Capricornus": ["Cap"], "Carina": ["Car"], "Cassiopeia": ["Cas"], "Centaurus": ["Cen"], "Cepheus": ["Cep"],
          "Cetus": ["Cet"], "Chamaeleon": ["Cha"], "Circinus": ["Cir"], "Columba": ["Col"], "Coma Berenices": ["Com"],
          "Corona Australis": ["CrA"], "Corona Borealis": ["CrB"], "Corvus": ["Crv"], "Crater": ["Crt"], "Crux": ["Cru"],
          "Cygnus": ["Cyg"], "Delphinus": ["Del"], "Dorado": ["Dor"], "Draco": ["Dra"], "Equuleus": ["Equ"],
          "Eridanus": ["Eri"], "Fornax": ["For"], "Gemini": ["Gem"], "Grus": ["Gru"], "Hercules": ["Her"],
          "Horologium": ["Hor"], "Hydra": ["Hya"], "Hydrus": ["Hyi"], "Indus": ["Ind"], "Lacerta": ["Lac"],
          "Leo Minor": ["LMi"], "Lepus": ["Lep"], "Libra": ["Lib"], "Lupus": ["Lup"],
          "Lynx": ["Lyn"], "Lyra": ["Lyr"], "Mensa": ["Men"], "Microscopium": ["Mic"], "Monoceros": ["Mon"],
          "Musca": ["Mus"], "Norma": ["Nor"], "Octans": ["Oct"], "Ophiuchus": ["Oph"], "Orion": ["Ori"],
          "Pavo": ["Pav"], "Pegasus": ["Peg"], "Perseus": ["Per"], "Phoenix": ["Phe"], "Pictor": ["Pic"],
          "Pisces": ["Psc"], "Piscis Austrinus": ["PsA"], "Puppis": ["Pup"], "Pyxis": ["Pyx"], "Reticulum": ["Ret"],
          "Sagitta": ["Sge"], "Sagittarius": ["Sgr"], "Scorpius": ["Sco"], "Sculptor": ["Scl"], "Scutum": ["Sct"],
          "Serpens": ["Ser"], "Sextans": ["Sex"], "Taurus": ["Tau"], "Telescopium": ["Tel"], "Triangulum": ["Tri"],
          "Triangulum Australe": ["TrA"], "Tucana": ["Tuc"], "Ursa Major": ["UMa"], "Ursa Minor": ["UMi"],
          "Vela": ["Vel"], "Virgo": ["Vir"], "Volans": ["Vol"], "Vulpecula": ["Vul"]
        }
      },
      zh: {
        answers: [
          "仙女座","唧筒座","天燕座","寶瓶座","天鷹座","天壇座","白羊座","御夫座","牧夫座","雕具座",
          "鹿豹座","巨蟹座","獵犬座","大犬座","小犬座","摩羯座","船底座","仙后座","半人馬座","仙王座",
          "鯨魚座","蝘蜓座","圓規座","天鴿座","后髮座","南冕座","北冕座","烏鴉座","巨爵座","南十字座",
          "天鵝座","海豚座","劍魚座","天龍座","小馬座","波江座","天爐座","雙子座","天鶴座","武仙座",
          "時鐘座","長蛇座","水蛇座","印第安座","蝎虎座","獅子座","小獅座","天兔座","天秤座","豺狼座",
          "天貓座","天琴座","山案座","顯微鏡座","麒麟座","蒼蠅座","矩尺座","南極座","蛇夫座","獵戶座",
          "孔雀座","飛馬座","英仙座","鳳凰座","繪架座","雙魚座","南魚座","船尾座","羅盤座","網罟座",
          "天箭座","人馬座","天蠍座","玉夫座","盾牌座","巨蛇座","六分儀座","金牛座","望遠鏡座","三角座",
          "南三角座","杜鵑座","大熊座","小熊座","船帆座","室女座","飛魚座","狐狸座"
        ],
        // Drops the trailing "座" (generic "constellation of ___" suffix) as
        // a shorthand answer - same idea as Japan Prefectures dropping its
        // 県/府/都 administrative suffix.
        aliases: {
          "仙女座": ["仙女"], "唧筒座": ["唧筒"], "天燕座": ["天燕"], "寶瓶座": ["寶瓶"], "天鷹座": ["天鷹"],
          "天壇座": ["天壇"], "白羊座": ["白羊"], "御夫座": ["御夫"], "牧夫座": ["牧夫"], "雕具座": ["雕具"],
          "鹿豹座": ["鹿豹"], "巨蟹座": ["巨蟹"], "獵犬座": ["獵犬"], "大犬座": ["大犬"], "小犬座": ["小犬"],
          "摩羯座": ["摩羯"], "船底座": ["船底"], "仙后座": ["仙后"], "半人馬座": ["半人馬"], "仙王座": ["仙王"],
          "鯨魚座": ["鯨魚"], "蝘蜓座": ["蝘蜓"], "圓規座": ["圓規"], "天鴿座": ["天鴿"], "后髮座": ["后髮"],
          "南冕座": ["南冕"], "北冕座": ["北冕"], "烏鴉座": ["烏鴉"], "巨爵座": ["巨爵"], "南十字座": ["南十字"],
          "天鵝座": ["天鵝"], "海豚座": ["海豚"], "劍魚座": ["劍魚"], "天龍座": ["天龍"], "小馬座": ["小馬"],
          "波江座": ["波江"], "天爐座": ["天爐"], "雙子座": ["雙子"], "天鶴座": ["天鶴"], "武仙座": ["武仙"],
          "時鐘座": ["時鐘"], "長蛇座": ["長蛇"], "水蛇座": ["水蛇"], "印第安座": ["印第安"], "蝎虎座": ["蝎虎"],
          "獅子座": ["獅子"], "小獅座": ["小獅"], "天兔座": ["天兔"], "天秤座": ["天秤"], "豺狼座": ["豺狼"],
          "天貓座": ["天貓"], "天琴座": ["天琴"], "山案座": ["山案"], "顯微鏡座": ["顯微鏡"], "麒麟座": ["麒麟"],
          "蒼蠅座": ["蒼蠅"], "矩尺座": ["矩尺"], "南極座": ["南極"], "蛇夫座": ["蛇夫"], "獵戶座": ["獵戶"],
          "孔雀座": ["孔雀"], "飛馬座": ["飛馬"], "英仙座": ["英仙"], "鳳凰座": ["鳳凰"], "繪架座": ["繪架"],
          "雙魚座": ["雙魚"], "南魚座": ["南魚"], "船尾座": ["船尾"], "羅盤座": ["羅盤"], "網罟座": ["網罟"],
          "天箭座": ["天箭"], "人馬座": ["人馬"], "天蠍座": ["天蠍"], "玉夫座": ["玉夫"], "盾牌座": ["盾牌"],
          "巨蛇座": ["巨蛇"], "六分儀座": ["六分儀"], "金牛座": ["金牛"], "望遠鏡座": ["望遠鏡"], "三角座": ["三角"],
          "南三角座": ["南三角"], "杜鵑座": ["杜鵑"], "大熊座": ["大熊"], "小熊座": ["小熊"], "船帆座": ["船帆"],
          "室女座": ["室女"], "飛魚座": ["飛魚"], "狐狸座": ["狐狸"]
        }
      }
    }
  },
  {
    name: "Countries that have Qualified for the FIFA World Cup",
    group: "Sports",
    answers: [
      "Brazil","Germany","Argentina","Italy","Mexico","Spain","England","France","Belgium","Uruguay",
      "Switzerland","Sweden","Serbia","South Korea","United States","Netherlands","Russia","Czech Republic",
      "Portugal","Scotland","Paraguay","Hungary","Poland","Slovakia","Chile","Japan","Cameroon","Austria",
      "Australia","Croatia","Iran","Saudi Arabia","Bulgaria","Morocco","Tunisia","Colombia","Romania",
      "Costa Rica","Nigeria","Denmark","Ghana","Ecuador","Algeria","Peru","Senegal","Ivory Coast","Norway",
      "South Africa","Egypt","Turkey","Canada","Northern Ireland","Honduras","Republic of Ireland","Greece",
      "New Zealand","Bolivia","DR Congo","Qatar","Haiti","Bosnia and Herzegovina","Panama","Iraq","Wales",
      "North Korea","El Salvador","Slovenia","Cuba","Indonesia","Israel","East Germany","Kuwait",
      "United Arab Emirates","Jamaica","China","Angola","Togo","Trinidad and Tobago","Ukraine","Iceland",
      "Cape Verde","Curaçao","Jordan","Uzbekistan"
    ],
    aliases: {
      "United States": ["USA","US","U.S.","America"],
      "South Korea": ["Korea","Korea Republic","Republic of Korea"],
      "North Korea": ["DPRK","Korea DPR"],
      "DR Congo": ["Democratic Republic of Congo","Democratic Republic of the Congo","DRC","Congo DR","Zaire"],
      "Czech Republic": ["Czechia"],
      "Russia": ["USSR","Soviet Union"],
      "Serbia": ["Yugoslavia"],
      "Germany": ["West Germany"],
      "Republic of Ireland": ["Ireland"],
      "Ivory Coast": ["Cote d'Ivoire","Cote dIvoire"],
      "United Arab Emirates": ["UAE"],
      "Curaçao": ["Curacao"],
      "Bosnia and Herzegovina": ["Bosnia"]
    }
  },
  {
    name: "MLB Teams",
    group: "Sports",
    languages: {
      en: {
        answers: [
          "Baltimore Orioles","Boston Red Sox","New York Yankees","Tampa Bay Rays","Toronto Blue Jays",
          "Chicago White Sox","Cleveland Guardians","Detroit Tigers","Kansas City Royals","Minnesota Twins",
          "Houston Astros","Los Angeles Angels","Oakland Athletics","Seattle Mariners","Texas Rangers",
          "Atlanta Braves","Miami Marlins","New York Mets","Philadelphia Phillies","Washington Nationals",
          "Chicago Cubs","Cincinnati Reds","Milwaukee Brewers","Pittsburgh Pirates","St. Louis Cardinals",
          "Arizona Diamondbacks","Colorado Rockies","Los Angeles Dodgers","San Diego Padres","San Francisco Giants"
        ],
        aliases: {
          "Baltimore Orioles": ["Orioles"],
          "Boston Red Sox": ["Red Sox"],
          "New York Yankees": ["Yankees","NY Yankees"],
          "Tampa Bay Rays": ["Rays"],
          "Toronto Blue Jays": ["Blue Jays"],
          "Chicago White Sox": ["White Sox"],
          "Cleveland Guardians": ["Guardians"],
          "Detroit Tigers": ["Tigers"],
          "Kansas City Royals": ["Royals"],
          "Minnesota Twins": ["Twins"],
          "Houston Astros": ["Astros"],
          "Los Angeles Angels": ["Angels","LA Angels","Anaheim Angels"],
          "Oakland Athletics": ["Athletics","A's","As"],
          "Seattle Mariners": ["Mariners"],
          "Texas Rangers": ["Rangers"],
          "Atlanta Braves": ["Braves"],
          "Miami Marlins": ["Marlins"],
          "New York Mets": ["Mets","NY Mets"],
          "Philadelphia Phillies": ["Phillies"],
          "Washington Nationals": ["Nationals","Nats"],
          "Chicago Cubs": ["Cubs"],
          "Cincinnati Reds": ["Reds"],
          "Milwaukee Brewers": ["Brewers"],
          "Pittsburgh Pirates": ["Pirates"],
          "St. Louis Cardinals": ["Cardinals","Saint Louis Cardinals"],
          "Arizona Diamondbacks": ["Diamondbacks","D-backs","Dbacks"],
          "Colorado Rockies": ["Rockies"],
          "Los Angeles Dodgers": ["Dodgers","LA Dodgers"],
          "San Diego Padres": ["Padres"],
          "San Francisco Giants": ["Giants","SF Giants"]
        }
      },
      zh: {
        answers: [
          "巴爾的摩金鶯","波士頓紅襪","紐約洋基","坦帕灣光芒","多倫多藍鳥",
          "芝加哥白襪","克里夫蘭守護者","底特律老虎","堪薩斯市皇家","明尼蘇達雙城",
          "休士頓太空人","洛杉磯天使","運動家","西雅圖水手","德州遊騎兵",
          "亞特蘭大勇士","邁阿密馬林魚","紐約大都會","費城費城人","華盛頓國民",
          "芝加哥小熊","辛辛那提紅人","密爾瓦基釀酒人","匹茲堡海盜","聖路易紅雀",
          "亞利桑那響尾蛇","科羅拉多洛磯","洛杉磯道奇","聖地牙哥教士","舊金山巨人"
        ],
        // Drops the city-name prefix, keeping just the mascot - same idea as
        // the English aliases above (e.g. "Yankees" for "New York Yankees").
        aliases: {
          "巴爾的摩金鶯": ["金鶯"],
          "波士頓紅襪": ["紅襪"],
          "紐約洋基": ["洋基"],
          "坦帕灣光芒": ["光芒"],
          "多倫多藍鳥": ["藍鳥"],
          "芝加哥白襪": ["白襪"],
          "克里夫蘭守護者": ["守護者"],
          "底特律老虎": ["老虎"],
          "堪薩斯市皇家": ["皇家"],
          "明尼蘇達雙城": ["雙城"],
          "休士頓太空人": ["太空人"],
          "洛杉磯天使": ["天使"],
          "西雅圖水手": ["水手"],
          "德州遊騎兵": ["遊騎兵"],
          "亞特蘭大勇士": ["勇士"],
          "邁阿密馬林魚": ["馬林魚"],
          "紐約大都會": ["大都會"],
          "費城費城人": ["費城人"],
          "華盛頓國民": ["國民"],
          "芝加哥小熊": ["小熊"],
          "辛辛那提紅人": ["紅人"],
          "密爾瓦基釀酒人": ["釀酒人"],
          "匹茲堡海盜": ["海盜"],
          "聖路易紅雀": ["紅雀"],
          "亞利桑那響尾蛇": ["響尾蛇"],
          "科羅拉多洛磯": ["洛磯"],
          "洛杉磯道奇": ["道奇"],
          "聖地牙哥教士": ["教士"],
          "舊金山巨人": ["巨人"]
        }
      }
    }
  },
  {
    name: "NBA Teams",
    group: "Sports",
    languages: {
      en: {
        answers: [
          "Boston Celtics","Brooklyn Nets","New York Knicks","Philadelphia 76ers","Toronto Raptors",
          "Chicago Bulls","Cleveland Cavaliers","Detroit Pistons","Indiana Pacers","Milwaukee Bucks",
          "Atlanta Hawks","Charlotte Hornets","Miami Heat","Orlando Magic","Washington Wizards",
          "Denver Nuggets","Minnesota Timberwolves","Oklahoma City Thunder","Portland Trail Blazers","Utah Jazz",
          "Golden State Warriors","LA Clippers","Los Angeles Lakers","Phoenix Suns","Sacramento Kings",
          "Dallas Mavericks","Houston Rockets","Memphis Grizzlies","New Orleans Pelicans","San Antonio Spurs"
        ],
        aliases: {
          "Boston Celtics": ["Celtics"],
          "Brooklyn Nets": ["Nets"],
          "New York Knicks": ["Knicks","NY Knicks"],
          "Philadelphia 76ers": ["76ers","Sixers"],
          "Toronto Raptors": ["Raptors"],
          "Chicago Bulls": ["Bulls"],
          "Cleveland Cavaliers": ["Cavaliers","Cavs"],
          "Detroit Pistons": ["Pistons"],
          "Indiana Pacers": ["Pacers"],
          "Milwaukee Bucks": ["Bucks"],
          "Atlanta Hawks": ["Hawks"],
          "Charlotte Hornets": ["Hornets"],
          "Miami Heat": ["Heat"],
          "Orlando Magic": ["Magic"],
          "Washington Wizards": ["Wizards"],
          "Denver Nuggets": ["Nuggets"],
          "Minnesota Timberwolves": ["Timberwolves","Wolves"],
          "Oklahoma City Thunder": ["Thunder","OKC Thunder"],
          "Portland Trail Blazers": ["Trail Blazers","Blazers"],
          "Utah Jazz": ["Jazz"],
          "Golden State Warriors": ["Warriors"],
          "LA Clippers": ["Clippers","Los Angeles Clippers"],
          "Los Angeles Lakers": ["Lakers","LA Lakers"],
          "Phoenix Suns": ["Suns"],
          "Sacramento Kings": ["Kings"],
          "Dallas Mavericks": ["Mavericks","Mavs"],
          "Houston Rockets": ["Rockets"],
          "Memphis Grizzlies": ["Grizzlies"],
          "New Orleans Pelicans": ["Pelicans"],
          "San Antonio Spurs": ["Spurs"]
        }
      },
      zh: {
        // Verified via zh.wikipedia's own zh-tw display variant per team
        // (not just simplified->traditional character mapping) - several
        // Taiwan broadcast names differ by more than script, e.g. Raptors
        // 暴龍 (not 猛龍), Pacers 溜馬 (not 步行者), Clippers 快艇 (not 快船).
        answers: [
          "波士頓塞爾提克","布魯克林籃網","紐約尼克","費城76人","多倫多暴龍",
          "芝加哥公牛","克里夫蘭騎士","底特律活塞","印第安納溜馬","密爾瓦基公鹿",
          "亞特蘭大老鷹","夏洛特黃蜂","邁阿密熱火","奧蘭多魔術","華盛頓巫師",
          "丹佛金塊","明尼蘇達灰狼","奧克拉荷馬雷霆","波特蘭拓荒者","猶他爵士",
          "金州勇士","洛杉磯快艇","洛杉磯湖人","鳳凰城太陽","沙加緬度國王",
          "達拉斯獨行俠","休士頓火箭","曼菲斯灰熊","紐奧良鵜鶘","聖安東尼奧馬刺"
        ],
        // Drops the city-name prefix, keeping just the mascot - same idea as
        // the English aliases above.
        aliases: {
          "波士頓塞爾提克": ["塞爾提克"],
          "布魯克林籃網": ["籃網"],
          "紐約尼克": ["尼克"],
          "費城76人": ["76人"],
          "多倫多暴龍": ["暴龍"],
          "芝加哥公牛": ["公牛"],
          "克里夫蘭騎士": ["騎士"],
          "底特律活塞": ["活塞"],
          "印第安納溜馬": ["溜馬"],
          "密爾瓦基公鹿": ["公鹿"],
          "亞特蘭大老鷹": ["老鷹"],
          "夏洛特黃蜂": ["黃蜂"],
          "邁阿密熱火": ["熱火"],
          "奧蘭多魔術": ["魔術"],
          "華盛頓巫師": ["巫師"],
          "丹佛金塊": ["金塊"],
          "明尼蘇達灰狼": ["灰狼"],
          "奧克拉荷馬雷霆": ["雷霆"],
          "波特蘭拓荒者": ["拓荒者"],
          "猶他爵士": ["爵士"],
          "金州勇士": ["勇士"],
          "洛杉磯快艇": ["快艇"],
          "洛杉磯湖人": ["湖人"],
          "鳳凰城太陽": ["太陽"],
          "沙加緬度國王": ["國王"],
          "達拉斯獨行俠": ["獨行俠"],
          "休士頓火箭": ["火箭"],
          "曼菲斯灰熊": ["灰熊"],
          "紐奧良鵜鶘": ["鵜鶘"],
          "聖安東尼奧馬刺": ["馬刺"]
        }
      }
    }
  },
  {
    name: "Active NBA All-Stars (2025-26)",
    group: "Sports",
    answers: [
      "LeBron James","Kevin Durant","Stephen Curry","James Harden","Giannis Antetokounmpo","Anthony Davis",
      "Paul George","Kyrie Irving","Damian Lillard","Russell Westbrook","Nikola Jokić","Joel Embiid",
      "Kawhi Leonard","Donovan Mitchell","Jimmy Butler","DeMar DeRozan","Luka Dončić","Jayson Tatum",
      "Karl-Anthony Towns","Devin Booker","Jaylen Brown","Al Horford","Kevin Love","Klay Thompson",
      "Anthony Edwards","Shai Gilgeous-Alexander","Draymond Green","Pascal Siakam","Trae Young",
      "Bam Adebayo","Bradley Beal","Jalen Brunson","Rudy Gobert","Khris Middleton","Julius Randle",
      "Domantas Sabonis","Scottie Barnes","Cade Cunningham","Andre Drummond","De'Aaron Fox",
      "Darius Garland","Tyrese Haliburton","Jrue Holiday","Brandon Ingram","Jaren Jackson Jr.",
      "Zach LaVine","Tyrese Maxey","Ja Morant","Alperen Şengün","Nikola Vučević","Victor Wembanyama",
      "Zion Williamson","Jarrett Allen","Deni Avdija","LaMelo Ball","Paolo Banchero","Mike Conley",
      "Jalen Duren","Tyler Herro","Chet Holmgren","Jalen Johnson","DeAndre Jordan","Brook Lopez",
      "Lauri Markkanen","Evan Mobley","Dejounte Murray","Jamal Murray","Kristaps Porziņģis",
      "Norman Powell","D'Angelo Russell","Fred VanVleet","Andrew Wiggins","Jalen Williams"
    ],
    aliases: {
      "LeBron James": ["LeBron"],
      "Giannis Antetokounmpo": ["Giannis"],
      "Nikola Jokić": ["Nikola Jokic","Jokic"],
      "Luka Dončić": ["Luka Doncic","Doncic"],
      "Karl-Anthony Towns": ["KAT"],
      "Shai Gilgeous-Alexander": ["SGA"],
      "Alperen Şengün": ["Alperen Sengun","Sengun"],
      "Nikola Vučević": ["Nikola Vucevic","Vucevic"],
      "Kristaps Porziņģis": ["Kristaps Porzingis","Porzingis"],
      "Jaren Jackson Jr.": ["Jaren Jackson"]
    }
  },
  {
    name: "Pixar Feature Films",
    group: "Entertainment",
    answers: [
      "Toy Story","A Bug's Life","Toy Story 2","Monsters, Inc.","Finding Nemo","The Incredibles",
      "Cars","Ratatouille","WALL-E","Up","Toy Story 3","Cars 2","Brave","Monsters University",
      "Inside Out","The Good Dinosaur","Finding Dory","Cars 3","Coco","Incredibles 2","Toy Story 4",
      "Onward","Soul","Luca","Turning Red","Lightyear","Elemental","Inside Out 2","Elio"
    ],
    aliases: {
      "Monsters, Inc.": ["Monsters Inc"],
      "WALL-E": ["Wall-E","Walle"]
    }
  },
  {
    // Theatrical MCU films only, through the most recently released one as
    // of writing (The Fantastic Four: First Steps, 2025) - excludes
    // upcoming/unreleased titles (e.g. Spider-Man: Brand New Day, Avengers:
    // Doomsday) so answers don't go stale before they've even come out.
    name: "Marvel Cinematic Universe Films",
    group: "Entertainment",
    answers: [
      "Iron Man","The Incredible Hulk","Iron Man 2","Thor","Captain America: The First Avenger","The Avengers",
      "Iron Man 3","Thor: The Dark World","Captain America: The Winter Soldier","Guardians of the Galaxy","Avengers: Age of Ultron","Ant-Man",
      "Captain America: Civil War","Doctor Strange","Guardians of the Galaxy Vol. 2","Spider-Man: Homecoming","Thor: Ragnarok","Black Panther",
      "Avengers: Infinity War","Ant-Man and the Wasp","Captain Marvel","Avengers: Endgame","Spider-Man: Far From Home",
      "Black Widow","Shang-Chi and the Legend of the Ten Rings","Eternals","Spider-Man: No Way Home",
      "Doctor Strange in the Multiverse of Madness","Thor: Love and Thunder","Black Panther: Wakanda Forever",
      "Ant-Man and the Wasp: Quantumania","Guardians of the Galaxy Vol. 3","The Marvels","Deadpool & Wolverine",
      "Captain America: Brave New World","Thunderbolts*","The Fantastic Four: First Steps"
    ],
    aliases: {
      "The Incredible Hulk": ["Incredible Hulk","Hulk"],
      "Captain America: The First Avenger": ["First Avenger"],
      "The Avengers": ["Avengers"],
      "Thor: The Dark World": ["Dark World"],
      "Captain America: The Winter Soldier": ["Winter Soldier"],
      "Guardians of the Galaxy": ["GOTG"],
      "Captain America: Civil War": ["Civil War"],
      "Guardians of the Galaxy Vol. 2": ["Guardians of the Galaxy 2","GOTG Vol 2","GOTG 2"],
      "Spider-Man: Homecoming": ["Homecoming"],
      "Thor: Ragnarok": ["Ragnarok"],
      "Avengers: Age of Ultron": ["Age of Ultron"],
      "Avengers: Infinity War": ["Infinity War"],
      "Ant-Man and the Wasp": ["Ant-Man 2"],
      "Avengers: Endgame": ["Endgame"],
      "Spider-Man: Far From Home": ["Far From Home"],
      "Shang-Chi and the Legend of the Ten Rings": ["Shang-Chi"],
      "Spider-Man: No Way Home": ["No Way Home"],
      "Doctor Strange in the Multiverse of Madness": ["Doctor Strange 2","Multiverse of Madness"],
      "Thor: Love and Thunder": ["Love and Thunder"],
      "Black Panther: Wakanda Forever": ["Wakanda Forever"],
      "Ant-Man and the Wasp: Quantumania": ["Quantumania","Ant-Man 3"],
      "Guardians of the Galaxy Vol. 3": ["Guardians of the Galaxy 3","GOTG Vol 3","GOTG 3"],
      "The Marvels": ["Marvels"],
      "Deadpool & Wolverine": ["Deadpool and Wolverine"],
      "Captain America: Brave New World": ["Brave New World"],
      "The Fantastic Four: First Steps": ["Fantastic Four","First Steps"]
    }
  },
  {
    // Source: zh.wikipedia.org "第一世代寶可夢列表", raw wikitext parsed for
    // the (Chinese name, Japanese name, English name) header triple listed
    // for each of the 151 Kanto Pokemon - excludes MissingNo. (the last
    // entry on that page), which is explicitly a glitch/error-handler, not
    // a real Pokemon.
    name: "First Generation Pokémon (151)",
    group: "Entertainment",
    languages: {
      en: {
        answers: [
          "Bulbasaur","Ivysaur","Venusaur","Charmander","Charmeleon","Charizard","Squirtle","Wartortle","Blastoise","Caterpie",
          "Metapod","Butterfree","Weedle","Kakuna","Beedrill","Pidgey","Pidgeotto","Pidgeot","Rattata","Raticate",
          "Spearow","Fearow","Ekans","Arbok","Pikachu","Raichu","Sandshrew","Sandslash","Nidoran♀","Nidorina",
          "Nidoqueen","Nidoran♂","Nidorino","Nidoking","Clefairy","Clefable","Vulpix","Ninetales","Jigglypuff","Wigglytuff",
          "Zubat","Golbat","Oddish","Gloom","Vileplume","Paras","Parasect","Venonat","Venomoth","Diglett",
          "Dugtrio","Meowth","Persian","Psyduck","Golduck","Mankey","Primeape","Growlithe","Arcanine","Poliwag",
          "Poliwhirl","Poliwrath","Abra","Kadabra","Alakazam","Machop","Machoke","Machamp","Bellsprout","Weepinbell",
          "Victreebel","Tentacool","Tentacruel","Geodude","Graveler","Golem","Ponyta","Rapidash","Slowpoke","Slowbro",
          "Magnemite","Magneton","Farfetch'd","Doduo","Dodrio","Seel","Dewgong","Grimer","Muk","Shellder",
          "Cloyster","Gastly","Haunter","Gengar","Onix","Drowzee","Hypno","Krabby","Kingler","Voltorb",
          "Electrode","Exeggcute","Exeggutor","Cubone","Marowak","Hitmonlee","Hitmonchan","Lickitung","Koffing","Weezing",
          "Rhyhorn","Rhydon","Chansey","Tangela","Kangaskhan","Horsea","Seadra","Goldeen","Seaking","Staryu",
          "Starmie","Mr. Mime","Scyther","Jynx","Electabuzz","Magmar","Pinsir","Tauros","Magikarp","Gyarados",
          "Lapras","Ditto","Eevee","Vaporeon","Jolteon","Flareon","Porygon","Omanyte","Omastar","Kabuto",
          "Kabutops","Aerodactyl","Snorlax","Articuno","Zapdos","Moltres","Dratini","Dragonair","Dragonite","Mewtwo",
          "Mew"
        ],
        // Nidoran's two forms are official separate Pokedex entries (#29
        // female, #32 male) distinguished only by a gender symbol suffix -
        // normalize() strips ♀/♂ entirely (they're Unicode symbols, not
        // letters), so both would otherwise collapse to the same
        // normalized string and one would become unreachable. These
        // ASCII-safe aliases (the standard competitive-Pokemon notation)
        // are the only realistic way to type them anyway.
        aliases: {
          "Nidoran♀": ["Nidoran F"],
          "Nidoran♂": ["Nidoran M"]
        }
      },
      ja: {
        answers: [
          "フシギダネ","フシギソウ","フシギバナ","ヒトカゲ","リザード","リザードン","ゼニガメ","カメール","カメックス","キャタピー",
          "トランセル","バタフリー","ビードル","コクーン","スピアー","ポッポ","ピジョン","ピジョット","コラッタ","ラッタ",
          "オニスズメ","オニドリル","アーボ","アーボック","ピカチュウ","ライチュウ","サンド","サンドパン","ニドラン♀","ニドリーナ",
          "ニドクイン","ニドラン♂","ニドリーノ","ニドキング","ピッピ","ピクシー","ロコン","キュウコン","プリン","プクリン",
          "ズバット","ゴルバット","ナゾノクサ","クサイハナ","ラフレシア","パラス","パラセクト","コンパン","モルフォン","ディグダ",
          "ダグトリオ","ニャース","ペルシアン","コダック","ゴルダック","マンキー","オコリザル","ガーディ","ウインディ","ニョロモ",
          "ニョロゾ","ニョロボン","ケーシィ","ユンゲラー","フーディン","ワンリキー","ゴーリキー","カイリキー","マダツボミ","ウツドン",
          "ウツボット","メノクラゲ","ドククラゲ","イシツブテ","ゴローン","ゴローニャ","ポニータ","ギャロップ","ヤドン","ヤドラン",
          "コイル","レアコイル","カモネギ","ドードー","ドードリオ","パウワウ","ジュゴン","ベトベター","ベトベトン","シェルダー",
          "パルシェン","ゴース","ゴースト","ゲンガー","イワーク","スリープ","スリーパー","クラブ","キングラー","ビリリダマ",
          "マルマイン","タマタマ","ナッシー","カラカラ","ガラガラ","サワムラー","エビワラー","ベロリンガ","ドガース","マタドガス",
          "サイホーン","サイドン","ラッキー","モンジャラ","ガルーラ","タッツー","シードラ","トサキント","アズマオウ","ヒトデマン",
          "スターミー","バリヤード","ストライク","ルージュラ","エレブー","ブーバー","カイロス","ケンタロス","コイキング","ギャラドス",
          "ラプラス","メタモン","イーブイ","シャワーズ","サンダース","ブースター","ポリゴン","オムナイト","オムスター","カブト",
          "カブトプス","プテラ","カビゴン","フリーザー","サンダー","ファイヤー","ミニリュウ","ハクリュー","カイリュー","ミュウツー",
          "ミュウ"
        ],
        // Same Nidoran gender-symbol collision as the English side (♀/♂ are
        // stripped by normalize() since they're symbols, not letters) - the
        // Japanese-language equivalent of an ASCII-safe fallback: メス/オス
        // (female/male animal) are the standard way to refer to these when
        // the gender symbol itself isn't typed.
        aliases: {
          "ニドラン♀": ["ニドランメス"],
          "ニドラン♂": ["ニドランオス"]
        }
      },
      zh: {
        answers: [
          "妙蛙種子","妙蛙草","妙蛙花","小火龍","火恐龍","噴火龍","傑尼龜","卡咪龜","水箭龜","綠毛蟲",
          "鐵甲蛹","巴大蝶","獨角蟲","鐵殼蛹","大針蜂","波波","比比鳥","大比鳥","小拉達","拉達",
          "烈雀","大嘴雀","阿柏蛇","阿柏怪","皮卡丘","雷丘","穿山鼠","穿山王","尼多蘭","尼多娜",
          "尼多后","尼多朗","尼多力諾","尼多王","皮皮","皮可西","六尾","九尾","胖丁","胖可丁",
          "超音蝠","大嘴蝠","走路草","臭臭花","霸王花","派拉斯","派拉斯特","毛球","摩魯蛾","地鼠",
          "三地鼠","喵喵","貓老大","可達鴨","哥達鴨","猴怪","火爆猴","卡蒂狗","風速狗","蚊香蝌蚪",
          "蚊香君","蚊香泳士","凱西","勇基拉","胡地","腕力","豪力","怪力","喇叭芽","口呆花",
          "大食花","瑪瑙水母","毒刺水母","小拳石","隆隆石","隆隆岩","小火馬","烈焰馬","呆呆獸","呆殼獸",
          "小磁怪","三合一磁怪","大蔥鴨","嘟嘟","嘟嘟利","小海獅","白海獅","臭泥","臭臭泥","大舌貝",
          "刺甲貝","鬼斯","鬼斯通","耿鬼","大岩蛇","催眠貘","引夢貘人","大鉗蟹","巨鉗蟹","霹靂電球",
          "頑皮雷彈","蛋蛋","椰蛋樹","卡拉卡拉","嘎啦嘎啦","飛腿郎","快拳郎","大舌頭","瓦斯彈","雙彈瓦斯",
          "獨角犀牛","鑽角犀獸","吉利蛋","蔓藤怪","袋獸","墨海馬","海刺龍","角金魚","金魚王","海星星",
          "寶石海星","魔牆人偶","飛天螳螂","迷唇姐","電擊獸","鴨嘴火獸","凱羅斯","肯泰羅","鯉魚王","暴鯉龍",
          "拉普拉斯","百變怪","伊布","水伊布","雷伊布","火伊布","多邊獸","菊石獸","多刺菊石獸","化石盔",
          "鐮刀盔","化石翼龍","卡比獸","急凍鳥","閃電鳥","火焰鳥","迷你龍","哈克龍","快龍","超夢",
          "夢幻"
        ]
      }
    }
  },
  {
    name: "Best Picture Oscar Winners (1927-2025)",
    group: "Entertainment",
    answers: [
      "Wings","The Broadway Melody","All Quiet on the Western Front","Cimarron","Grand Hotel",
      "Cavalcade","It Happened One Night","Mutiny on the Bounty","The Great Ziegfeld",
      "The Life of Emile Zola","You Can't Take It with You","Gone with the Wind","Rebecca",
      "How Green Was My Valley","Mrs. Miniver","Casablanca","Going My Way","The Lost Weekend",
      "The Best Years of Our Lives","Gentleman's Agreement","Hamlet","All the King's Men",
      "All About Eve","An American in Paris","The Greatest Show on Earth","From Here to Eternity",
      "On the Waterfront","Marty","Around the World in 80 Days","The Bridge on the River Kwai",
      "Gigi","Ben-Hur","The Apartment","West Side Story","Lawrence of Arabia","Tom Jones",
      "My Fair Lady","The Sound of Music","A Man for All Seasons","In the Heat of the Night",
      "Oliver!","Midnight Cowboy","Patton","The French Connection","The Godfather","The Sting",
      "The Godfather Part II","One Flew Over the Cuckoo's Nest","Rocky","Annie Hall",
      "The Deer Hunter","Kramer vs. Kramer","Ordinary People","Chariots of Fire","Gandhi",
      "Terms of Endearment","Amadeus","Out of Africa","Platoon","The Last Emperor","Rain Man",
      "Driving Miss Daisy","Dances with Wolves","The Silence of the Lambs","Unforgiven",
      "Schindler's List","Forrest Gump","Braveheart","The English Patient","Titanic",
      "Shakespeare in Love","American Beauty","Gladiator","A Beautiful Mind","Chicago",
      "The Lord of the Rings: The Return of the King","Million Dollar Baby","Crash",
      "The Departed","No Country for Old Men","Slumdog Millionaire","The Hurt Locker",
      "The King's Speech","The Artist","Argo","12 Years a Slave","Birdman","Spotlight",
      "Moonlight","The Shape of Water","Green Book","Parasite","Nomadland","CODA",
      "Everything Everywhere All at Once","Oppenheimer","Anora","One Battle After Another"
    ],
    aliases: {
      "The Broadway Melody": ["Broadway Melody"],
      "The Great Ziegfeld": ["Great Ziegfeld"],
      "The Life of Emile Zola": ["Life of Emile Zola"],
      "The Best Years of Our Lives": ["Best Years of Our Lives"],
      "The Greatest Show on Earth": ["Greatest Show on Earth"],
      "The Bridge on the River Kwai": ["Bridge on the River Kwai"],
      "The Apartment": ["Apartment"],
      "The Sound of Music": ["Sound of Music"],
      "The Godfather": ["Godfather"],
      "The Sting": ["Sting"],
      "The Godfather Part II": ["Godfather Part 2","Godfather II","Godfather 2"],
      "The Deer Hunter": ["Deer Hunter"],
      "The Last Emperor": ["Last Emperor"],
      "The Silence of the Lambs": ["Silence of the Lambs"],
      "The English Patient": ["English Patient"],
      "The Lord of the Rings: The Return of the King": ["Lord of the Rings: The Return of the King","The Return of the King","Return of the King"],
      "The Departed": ["Departed"],
      "The Hurt Locker": ["Hurt Locker"],
      "The King's Speech": ["King's Speech"],
      "The Artist": ["Artist"],
      "The Shape of Water": ["Shape of Water"]
    }
  },
  {
    // Source: zh.wikipedia.org "台灣姓氏列表", ranked 依中華民國內政部 2023年10月
    // 全國姓名統計分析. Several ranked entries are variant-character forms of
    // what's etymologically the same surname (e.g. 溫/温, 黃/黄, 鍾/鐘,
    // 塗/涂/凃) - the source explicitly counts these as separate ranked
    // entries (Taiwan's household registry recorded them as distinct
    // characters), so they're kept as separate answers here too rather than
    // merged, matching the source's own methodology. ZH only for now,
    // structured with `languages` so an English/pinyin set could be added
    // later without reshaping this entry.
    name: "Taiwanese Surnames (Top 150)",
    group: "Culture",
    languages: {
      zh: {
        answers: [
          "陳","林","黃","張","李","王","吳","劉","蔡","楊",
          "許","鄭","謝","洪","郭","邱","曾","廖","賴","徐",
          "周","葉","蘇","莊","江","呂","何","蕭","羅","高",
          "潘","簡","朱","鍾","游","彭","詹","胡","施","沈",
          "余","盧","梁","趙","顏","柯","翁","魏","孫","戴",
          "范","方","宋","鄧","杜","侯","傅","曹","薛","阮",
          "丁","卓","馬","温","董","藍","古","石","紀","唐",
          "蔣","姚","連","歐","馮","程","湯","田","康","黄",
          "姜","白","汪","尤","鄒","黎","巫","鐘","涂","龔",
          "嚴","韓","袁","金","童","陸","柳","凃","夏","邵",
          "錢","伍","倪","溫","駱","譚","于","甘","熊","任",
          "秦","章","毛","官","顧","史","萬","俞","粘","雷",
          "饒","張簡","闕","凌","武","孔","尹","崔","辛","歐陽",
          "辜","陶","段","易","龍","韋","池","葛","褚","孟",
          "麥","殷","莫","文","賀","賈","管","關","包","向"
        ]
      }
    }
  }
];
