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
    group: "Chemistry",
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
  {
    name: "NBA Teams",
    group: "Sports",
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
  }
];
