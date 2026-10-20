/*
====================================================================
  بيانات الكتالوج المصدرية (إصدار القالب)
  ------------------------------------------------------------------
  هذا مصفوفة JavaScript فقط لغرض عرض القالب بصورة كاملة.
  عند الربط مع ASP.NET Core 8:
    - غير المصفوفة بمكالمة fetch لـ /api/products
    - وكل حقل هنا يقابل عمودًا في جدول SQL Server:
        Products(Id, NameAr, Category, Style, Material, FinishAr,
                 PriceFrom, Badge, Rating, DimensionsRange, Sku,
                 ImageUrl, ColorsText, FeaturesJson)
====================================================================
*/

const PRODUCTS = [
  /* ============================================== أبواب ============================================== */
  {
    id: 1,
    sku: "DR-1001",
    image: "assets/img/dr-1001.jpg",
    name: "باب داخلي فاخر — طراز كلاسيكي بنقش محفور",
    category: "doors",
    style: "كلاسيكي",
    material: "خشب طبيعي",
    finish: "ورنيش لامع",
    priceFrom: 1850,
    badge: "الأكثر طلبًا",
    rating: 4.9,
    dimensionsRange: "عرض 80–95 سم × ارتفاع 210–240 سم",
    skuFull: "DR-1001-CL",
    colorsText: "عسلي، بني داكن، طبيعي",
    features: [
      "خشب بلوط طبيعي مصفح بطبقتين",
      "نقش محفور يدويًا (CNC + لمسة يدوية)",
      "إطار داخلي مجوف مضاد للتقوس",
      "توصيل وتركيب شامل داخل المملكة"
    ],
    tone: "#8a5a2b"
  },
  {
    id: 2,
    sku: "DR-1002",
    image: "assets/img/dr-1002.jpg",
    name: "باب مدخل رئيسي قوي — فولاذ مكسو بخشب",
    category: "doors",
    style: "عصري",
    material: "فولاذ + خشب",
    finish: "مكسو مانع للصدأ",
    priceFrom: 4200,
    badge: "أمان متقدم",
    rating: 4.8,
    dimensionsRange: "عرض 95–110 سم × ارتفاع 220–250 سم",
    skuFull: "DR-1002-ST",
    colorsText: "رمادي جرافيت، بني محروق",
    features: [
      "هيكل فولاذي سميك 1.5 مم",
      "قفل ذكي يعمل بالبصمة وكارت NFC",
      "عزل صوتي وصوان حر حتى 3 ساعات",
      "طلاء إلكتروستاتيك مقاوم للأمطار"
    ],
    tone: "#4a4a52"
  },
  {
    id: 3,
    sku: "DR-1003",
    image: "assets/img/dr-1003.jpg",
    name: "باب منزلق سحب — زجاج مركب بإطار ألمنيوم",
    category: "doors",
    style: "عصري",
    material: "ألمنيوم + زجاج",
    finish: "ألمنيوم مصقول",
    priceFrom: 2750,
    badge: null,
    rating: 4.6,
    dimensionsRange: "عرض 120–180 سم × ارتفاع 240 سم",
    skuFull: "DR-1003-AL",
    colorsText: "أسود مطفي، فضي",
    features: [
      "عجلات سحب صامتة (Soft Close)",
      "زجاج سكريت 8 مم مقاوم للكسر",
      "ملء الضوء دون فقدان الخصوصية",
      "تركيب مجاور للحائط أو داخل الحائط"
    ],
    tone: "#3c4a57"
  },
  {
    id: 4,
    sku: "DR-1004",
    image: "assets/img/dr-1004.jpg",
    name: "باب سرجي جبلي — سويد نوردكي متعدد التركيب",
    category: "doors",
    style: "سكندنافي",
    material: "MDF مقاوم",
    finish: "دهان حديث",
    priceFrom: 1450,
    badge: "الجديد",
    rating: 4.7,
    dimensionsRange: "عرض 70–90 سم × ارتفاع 200–220 سم",
    skuFull: "DR-1004-MF",
    colorsText: "أبيض لؤلؤي، رمادي فاتح",
    features: [
      "نواة MDF كثيف منع للرطوبة",
      "جهات مضادة للخدش والشمس",
      "مقابض سفلية بسيطة (Push Touch)",
      "تسليم سريع خلال 7 أيام"
    ],
    tone: "#b9a889"
  },
  {
    id: 5,
    sku: "DR-1005",
    image: "assets/img/dr-1005.jpg",
    name: "باب مقسم شطرين — تفاصيل ستيني مع زجاج",
    category: "doors",
    style: "مودرن كلاسيك",
    material: "خشب طبيعي",
    finish: "اختزان فاخر",
    priceFrom: 3350,
    badge: null,
    rating: 4.8,
    dimensionsRange: "عرض 85–100 سم × ارتفاع 230–250 سم",
    skuFull: "DR-1005-WD",
    colorsText: "بني محمر، كراميل",
    features: [
      "قطاعات دوارة (Pivot) ثقيلة",
      "زجاج مصنفر يسمح بمرور ضوء خافت",
      "تشطيب احتكاكي يدوي 5 طبقات",
      "ضمان 10 سنوات ضد التضخم"
    ],
    tone: "#7a3b1e"
  },
  {
    id: 6,
    sku: "DR-1006",
    image: "assets/img/dr-1006.jpg",
    name: "باب حمام صغير — معالج مضاد للماء",
    category: "doors",
    style: "عملي",
    material: "PVC مضاد للرطوبة",
    finish: "مكسو فورييل",
    priceFrom: 890,
    badge: "اقتصادي",
    rating: 4.5,
    dimensionsRange: "عرض 60–75 سم × ارتفاع 200 سم",
    skuFull: "DR-1006-PV",
    colorsText: "بيج، رمادي دخاني",
    features: [
      "مقاومة 100% للأبخرة والرطوبة",
      "تنظيف بمسحة رطبة فقط",
      "طرح مناسب للمشاريع السكنية",
      "تركيب خلال ساعة واحدة"
    ],
    tone: "#6d6255"
  },

  /* ============================================== مطابخ ============================================== */
  {
    id: 7,
    sku: "KT-2001",
    image: "assets/img/kt-2001.jpg",
    name: "مطبخ عصري مفتوح — واجهات بدون مقابض",
    category: "kitchens",
    style: "عصري",
    material: "خشب مطلي",
    finish: "دهان HD",
    priceFrom: 32000,
    badge: "الأكثر طلبًا",
    rating: 4.9,
    dimensionsRange: "مخصص حسب المساحة",
    skuFull: "KT-2001-HD",
    colorsText: "رمادي فحمي، كستنائي، أوف وايت",
    features: [
      "واجهات تعمل بالضغط (No Handle)",
      "أدراج سحب عالية التحمل (40 كجم)",
      "مغسلة غرانيت + خلاط سحب",
      "إضاءة داخلية حساسة للمس"
    ],
    tone: "#33383f"
  },
  {
    id: 8,
    sku: "KT-2002",
    image: "assets/img/kt-2002.jpg",
    name: "مطبخ كلاسيكي فاخر — خشب بلوط مع حجر رخام",
    category: "kitchens",
    style: "كلاسيكي",
    material: "خشب طبيعي",
    finish: "ورنيش يدوي",
    priceFrom: 48000,
    badge: "فاخر",
    rating: 5.0,
    dimensionsRange: "حسب التصميم ثلاثي الأبعاد",
    skuFull: "KT-2002-WD",
    colorsText: "بني عسلي، كريمي مرمري",
    features: [
      "كتلة جزيرة من رخام كالاكاتا",
      "واجهات بلوط حقيقي مقاشط يدويًا",
      "مفصلات إخفاء كاملة (Concealed)",
      "تصميم ثلاثي الأبعاد قبل التنفيذ"
    ],
    tone: "#8b6b3e"
  },
  {
    id: 9,
    sku: "KT-2003",
    image: "assets/img/kt-2003.jpg",
    name: "مطبخ مضغوط ذكي — حلول مساحات صغيرة",
    category: "kitchens",
    style: "عصري",
    material: "أكريليك",
    finish: "أكريليك لامع",
    priceFrom: 19500,
    badge: "مساحات صغيرة",
    rating: 4.7,
    dimensionsRange: "طول 2.5–3.5 متر بخيار الزاوية (L)",
    skuFull: "KT-2003-AC",
    colorsText: "أبيض لامع، تركواز، أنثراسيت",
    features: [
      "عربات قابلة للسحب والتنقل",
      "رفوف مثبتة على الحائط توفّر مساحة الأرضية",
      "سطح تشطيب مقاوم للحرارة",
      "أجهزة مدمجة بقياسات مضبوطة"
    ],
    tone: "#2f5d62"
  },
  {
    id: 10,
    sku: "KT-2004",
    image: "assets/img/kt-2004.jpg",
    name: "مطبخ جزيرة وسطية — مساحة عائلية مع مقاعد",
    category: "kitchens",
    style: "مودرن كلاسيك",
    material: "مركّب + كوارتز",
    finish: "مكسو كوارتز",
    priceFrom: 56000,
    badge: null,
    rating: 4.9,
    dimensionsRange: "مخصص بحسب مخطط المبنى",
    skuFull: "KT-2004-QZ",
    colorsText: "أوف وايت، بني هادئ",
    features: [
      "جزيرة كوارتز مع كراسي بار",
      "نقاط كهرباء مدمجة داخل الكاونتر",
      "دولاب تخزين علوي حتى السقف",
      "تأخير بصوت (Silent Damper)"
    ],
    tone: "#5c5044"
  },
  {
    id: 11,
    sku: "KT-2005",
    image: "assets/img/kt-2005.jpg",
    name: "مطبخ خارجي (بيت شعر) — مقاوم للشمس",
    category: "kitchens",
    style: "خارجي",
    material: "خشب معالج",
    finish: "طلاء بحري",
    priceFrom: 27500,
    badge: "الجديد",
    rating: 4.6,
    dimensionsRange: "طول 3–4.5 متر",
    skuFull: "KT-2005-OT",
    colorsText: "خشب محروق (شو سوغيبان)",
    features: [
      "ألواح شوي سوغيبان محروقة",
      "هيكل مقاوم للأمطار والحرارة",
      "حوض ستانلس صناعي ثقيل",
      "مفتاح غاز بأمان مزدوج"
    ],
    tone: "#241d16"
  },
  {
    id: 12,
    sku: "KT-2006",
    image: "assets/img/kt-2006.jpg",
    name: "مطبخ بأبواب زجاجية — عرض الأواني الفاخرة",
    category: "kitchens",
    style: "سكندنافي",
    material: "MDF + زجاج",
    finish: "دهان مطفي",
    priceFrom: 23800,
    badge: null,
    rating: 4.7,
    dimensionsRange: "حسب وحدات العرض والإظهار",
    skuFull: "KT-2006-GL",
    colorsText: "خمري، بيج دارك، أخضر حربي",
    features: [
      "واجهات زجاج شفاف مع إظهار الأواني الفاخرة",
      "أرفف زجاج معدني مقوس",
      "لمسات نحاسية عند القفول",
      "تنسيق مساحة شاي مع الخزائن"
    ],
    tone: "#31423a"
  }
];

/* الثيمات الحرفية التي تظهر في الأزرار
   (يمكن تحميلها من جدول Finishes في SQL Server لاحقًا) */
const FINISH_SWATCHES = [
  { name: "عسلي", css: "#9a6b33" },
  { name: "بني داكن", css: "#4d3320" },
  { name: "طبيعي فاتح", css: "#cfa872" },
  { name: "رمادي جرافيت", css: "#494b50" },
  { name: "أسود مطفي", css: "#1e1d1c" },
  { name: "أوف وايت", css: "#efe8da" },
  { name: "أخضر حربي", css: "#44523c" },
  { name: "أكريليك أحمر", css: "#7d2f2f" },
  { name: "بني محروق", css: "#5d3115" }
];
