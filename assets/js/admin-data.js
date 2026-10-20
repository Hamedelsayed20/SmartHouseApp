/* ============================================================================
   SMART HOUSE | سمارت هاوس — بيانات تجريبية (DEMO DATA)
   ----------------------------------------------------------------------------
   ⚠ كل الأرقام هنا بيانات عرض (Sample) لأغراض القالب فقط — ليست نتائج فعلية.
   عند الربط الفعلي تُستبدل بنداءات ASP.NET Core 8 Web API:
     GET /api/products            GET /api/categories
     GET /api/customers           GET /api/inquiries
     GET /api/quotations          GET /api/identity/users
   وتُدار الصلاحيات عبر ASP.NET Core Identity + JWT.
   ============================================================================ */
"use strict";

/* ------------------------------ التصنيفات ------------------------------ */
const CATEGORIES = [
  { id: 1, name: "أبواب مصفحة تركية",   desc: "أبواب مدخل مصفحة بفولاذ تركي معتمد",      active: true,  products: 6 },
  { id: 2, name: "أبواب داخلية PVC",    desc: "أبواب غرف مقاومة للرطوبة بأسعار منافسة",  active: true,  products: 5 },
  { id: 3, name: "أبواب شرفات PVC",     desc: "أبواب منزلق ومفصلات للشرفات المغلقة",     active: true,  products: 3 },
  { id: 4, name: "مطابخ MDF حديثة",     desc: "مطابخ مودرن بضمان عشر سنوات على الخامة",  active: true,  products: 6 },
  { id: 5, name: "إكسسوارات ومفصلات",   desc: "أقفال ذكية، مفصلات هيدروليك، مقابض فاخرة", active: false, products: 2 }
];

/* ------------------------------ المنتجات ------------------------------ */
const ADMIN_PRODUCTS = [
  { id: 1,  code: "DR-1001", name: "باب داخلي فاخر — طراز كلاسيكي",    catId: 1, material: "خشب طبيعي",    priceFrom: 1850,  status: "منشور", views: 4820, createdAt: "2026-01-12", image: "assets/img/dr-1001.jpg" },
  { id: 2,  code: "DR-1002", name: "باب مدخل رئيسي مصفح — فولاذ مكسو", catId: 1, material: "فولاذ + بخشب", priceFrom: 4820,  status: "منشور", views: 3915, createdAt: "2026-01-18", image: "assets/img/dr-1002.jpg" },
  { id: 3,  code: "DR-1003", name: "باب منزلق سحب — زجاج مركب",        catId: 3, material: "زجاج + ألمنيوم", priceFrom: 3350, status: "منشور", views: 2740, createdAt: "2026-02-02", image: "assets/img/dr-1003.jpg" },
  { id: 4,  code: "DR-1004", name: "باب سرجي جبلي — PVC نوردك",        catId: 2, material: "PVC مضلل",      priceFrom: 1450,  status: "منشور", views: 3120, createdAt: "2026-02-09", image: "assets/img/dr-1004.jpg" },
  { id: 5,  code: "DR-1005", name: "باب مقسم شطرين — تفاصيل ستيني",    catId: 2, material: "MDF مقاوم",     priceFrom: 2750,  status: "منشور", views: 1880, createdAt: "2026-02-21", image: "assets/img/dr-1005.jpg" },
  { id: 6,  code: "DR-1006", name: "باب حمام صغير — معالج للماء",      catId: 2, material: "PVC مضاد للماء", priceFrom: 890,   status: "منشور", views: 1505, createdAt: "2026-03-01", image: "assets/img/dr-1006.jpg" },
  { id: 7,  code: "KT-2001", name: "مطبخ مودرن — MDF عالي اللمعان",    catId: 4, material: "MDF لامع",      priceFrom: 24000, status: "منشور", views: 5210, createdAt: "2026-01-05", image: "assets/img/kt-2001.jpg" },
  { id: 8,  code: "KT-2002", name: "مطبخ كلاسيكي — جوز داكن",          catId: 4, material: "خشب جوز",       priceFrom: 32000, status: "منشور", views: 4460, createdAt: "2026-01-25", image: "assets/img/kt-2002.jpg" },
  { id: 9,  code: "KT-2003", name: "مطبخ مينيمال — أبيض مطفي",         catId: 4, material: "MDF مطفي",      priceFrom: 19500, status: "منشور", views: 3870, createdAt: "2026-02-14", image: "assets/img/kt-2003.jpg" },
  { id: 10, code: "KT-2004", name: "مطبخ بأبواب زجاجية — عرض الأواني", catId: 4, material: "زجاج + MDF",    priceFrom: 27500, status: "منشور", views: 2980, createdAt: "2026-02-27", image: "assets/img/kt-2004.jpg" },
  { id: 11, code: "KT-2005", name: "مطبخ L — جراي كولد",               catId: 4, material: "MDF رمادي",     priceFrom: 23800, status: "منشور", views: 2510, createdAt: "2026-03-08", image: "assets/img/kt-2005.jpg" },
  { id: 12, code: "KT-2006", name: "مطبخ جزيرة وسطى — فاخر",           catId: 4, material: "خشب طبيعي",     priceFrom: 56000, status: "منشور", views: 6120, createdAt: "2026-03-15", image: "assets/img/kt-2006.jpg" },
  { id: 13, code: "AC-3001", name: "قفل ذكي ببصمة — إصدار 2026",        catId: 5, material: "ستانلس ستيل",   priceFrom: 1250,  status: "منشور", views: 940,  createdAt: "2026-03-20", image: "assets/img/dr-1002.jpg" },
  { id: 14, code: "AC-3002", name: "مفصلة هيدروليكية ثلاثية",          catId: 5, material: "نحاس مطلي",     priceFrom: 210,   status: "منشور", views: 610,  createdAt: "2026-03-22", image: "assets/img/dr-1006.jpg" },
  { id: 15, code: "DR-1007", name: "باب مصفح تركي — طراز إسطنبول",     catId: 1, material: "فولاذ تركي",    priceFrom: 5400,  status: "مسودة", views: 0,    createdAt: "2026-09-30", image: "assets/img/dr-1002.jpg" },
  { id: 16, code: "DR-1008", name: "باب مصفح مزدوج — فلل فاخرة",       catId: 1, material: "فولاذ + MDF",   priceFrom: 7900,  status: "مسودة", views: 0,    createdAt: "2026-10-02", image: "assets/img/dr-1001.jpg" },
  { id: 17, code: "KT-2007", name: "مطبخ صغير — اصفراري ذهبي",         catId: 4, material: "MDF ذهبي",      priceFrom: 16800, status: "مخفي",  views: 320,  createdAt: "2026-08-11", image: "assets/img/kt-2003.jpg" },
  { id: 18, code: "DR-1009", name: "باب شرفة منزلق عريض — 3 أجنحة",    catId: 3, material: "PVC + زجاج",    priceFrom: 4100,  status: "منشور", views: 1230, createdAt: "2026-07-19", image: "assets/img/dr-1003.jpg" },
  { id: 19, code: "DR-1010", name: "باب غرفة أطفال — رسومات مخصصة",    catId: 2, material: "MDF مطلي",      priceFrom: 1650,  status: "مخفي",  views: 280,  createdAt: "2026-06-05", image: "assets/img/dr-1005.jpg" },
  { id: 20, code: "KT-2008", name: "مطبخ مفتوح — رخامي إيطالي",        catId: 4, material: "MDF + رخام",    priceFrom: 48000, status: "منشور", views: 3560, createdAt: "2026-04-17", image: "assets/img/kt-2001.jpg" }
];

/* ------------------------------ العملاء ------------------------------ */
const CUSTOMERS = [
  { id: 1,  name: "محمود الطرشوبي",   phone: "01012345678", email: "mahmoud@example.com", city: "طنطا",          registeredAt: "2026-01-08", inquiries: 4, status: "نشط" },
  { id: 2,  name: "سلمى الشناوي",     phone: "01198765432", email: "salma@example.com",   city: "طنطا",          registeredAt: "2026-01-15", inquiries: 3, status: "نشط" },
  { id: 3,  name: "أحمد عرفة",        phone: "01234567890", email: "ahmed@example.com",   city: "المحلة الكبرى", registeredAt: "2026-01-22", inquiries: 2, status: "نشط" },
  { id: 4,  name: "سارة عبد العال",   phone: "01077774444", email: "sara@example.com",    city: "طنطا",          registeredAt: "2026-02-03", inquiries: 1, status: "نشط" },
  { id: 5,  name: "خالد عبد الحميد",  phone: "01144443333", email: "khaled@example.com",  city: "طنطا",          registeredAt: "2026-02-11", inquiries: 5, status: "نشط" },
  { id: 6,  name: "ريم الديب",        phone: "01223232123", email: "reem@example.com",    city: "القاهرة",       registeredAt: "2026-02-18", inquiries: 0, status: "غير نشط" },
  { id: 7,  name: "فهد الجندي",       phone: "01522226666", email: "fahad@example.com",   city: "القاهرة",       registeredAt: "2026-03-01", inquiries: 2, status: "نشط" },
  { id: 8,  name: "لمى رشاد",         phone: "01066060560", email: "lama@example.com",    city: "الإسكندرية",    registeredAt: "2026-03-09", inquiries: 1, status: "نشط" },
  { id: 9,  name: "طارق سليمان",      phone: "01177778888", email: "tarek@example.com",   city: "طنطا",          registeredAt: "2026-03-17", inquiries: 3, status: "نشط" },
  { id: 10, name: "هند بدوي",         phone: "01244556677", email: "hind@example.com",    city: "طنطا",          registeredAt: "2026-03-25", inquiries: 0, status: "غير نشط" },
  { id: 11, name: "ياسر فرغلي",       phone: "01066665999", email: "yasser@example.com",  city: "المحلة الكبرى", registeredAt: "2026-04-02", inquiries: 2, status: "نشط" },
  { id: 12, name: "جواهر السباعي",    phone: "01132322335", email: "jawaher@example.com", city: "طنطا",          registeredAt: "2026-04-10", inquiries: 1, status: "نشط" },
  { id: 13, name: "بلال فتحي",        phone: "01221212121", email: "bilal@example.com",   city: "طنطا",          registeredAt: "2026-04-19", inquiries: 4, status: "نشط" },
  { id: 14, name: "شهد كمال",         phone: "01518181818", email: "shahd@example.com",   city: "القاهرة",       registeredAt: "2026-05-01", inquiries: 0, status: "غير نشط" },
  { id: 15, name: "ماجد زكي",         phone: "01090909091", email: "majed@example.com",   city: "طنطا",          registeredAt: "2026-05-14", inquiries: 2, status: "نشط" },
  { id: 16, name: "داليا سعيد",       phone: "01270707071", email: "dalia@example.com",   city: "الجيزة",        registeredAt: "2026-05-28", inquiries: 1, status: "نشط" },
  { id: 17, name: "سامي الهواري",     phone: "01161616161", email: "sami@example.com",    city: "الإسكندرية",    registeredAt: "2026-06-09", inquiries: 3, status: "نشط" },
  { id: 18, name: "أسماء قنديل",      phone: "01041414141", email: "asma@example.com",    city: "طنطا",          registeredAt: "2026-06-23", inquiries: 0, status: "غير نشط" },
  { id: 19, name: "كريم طلعت",        phone: "01253535353", email: "karim@example.com",   city: "المنصورة",      registeredAt: "2026-07-07", inquiries: 2, status: "نشط" },
  { id: 20, name: "غادة المليجي",     phone: "01125252525", email: "ghada@example.com",   city: "طنطا",          registeredAt: "2026-07-21", inquiries: 1, status: "نشط" },
  { id: 21, name: "إبراهيم الدسوقي",  phone: "01513131313", email: "ibrahim@example.com", city: "دمنهور",        registeredAt: "2026-08-04", inquiries: 0, status: "نشط" },
  { id: 22, name: "لمياء فؤاد",       phone: "01009090909", email: "lamia@example.com",   city: "الإسكندرية",    registeredAt: "2026-08-18", inquiries: 2, status: "نشط" },
  { id: 23, name: "وليد الحلو",       phone: "01181282180", email: "walid@example.com",   city: "القاهرة",       registeredAt: "2026-09-01", inquiries: 1, status: "نشط" },
  { id: 24, name: "أروى العمدة",      phone: "01269696969", email: "arwa@example.com",    city: "طنطا",          registeredAt: "2026-09-15", inquiries: 0, status: "غير نشط" }
];

/* ------------------------------ الاستفسارات ------------------------------ */
const INQUIRIES = [
  { id: 1,  customer: "محمود الطرشوبي", subject: "استفسار عن باب مصفح فلل",   product: "DR-1002", channel: "واتساب",      status: "جديد",         priority: "عالية", date: "2026-10-18" },
  { id: 2,  customer: "سلمى الشناوي",   subject: "مطبخ MDF كامل 3×4م",        product: "KT-2002", channel: "نموذج الموقع", status: "جديد",         priority: "عالية", date: "2026-10-18" },
  { id: 3,  customer: "خالد عبد الحميد",  subject: "أسعار الأبواب المنزلقة",     product: "DR-1003", channel: "هاتف",        status: "قيد المعالجة", priority: "متوسطة", date: "2026-10-17" },
  { id: 4,  customer: "طارق سليمان",    subject: "قفل ذكي ببصمة للباب الرئيسي", product: "AC-3001", channel: "واتساب",      status: "قيد المعالجة", priority: "متوسطة", date: "2026-10-16" },
  { id: 5,  customer: "أحمد عرفة",      subject: "باب حمام مضاد للماء",        product: "DR-1006", channel: "نموذج الموقع", status: "تم الرد",      priority: "عادية",  date: "2026-10-15" },
  { id: 6,  customer: "بلال فتحي",      subject: "مطبخ جزيرة وسطى — عرض سعر",  product: "KT-2006", channel: "واتساب",      status: "تم الرد",      priority: "عالية", date: "2026-10-14" },
  { id: 7,  customer: "سارة عبد العال",  subject: "باب غرفة أطفال مخصص",        product: "DR-1010", channel: "هاتف",        status: "مغلق",         priority: "عادية",  date: "2026-10-12" },
  { id: 8,  customer: "ماجد زكي",       subject: "باب شرفة 3 أجنحة",           product: "DR-1009", channel: "نموذج الموقع", status: "جديد",         priority: "متوسطة", date: "2026-10-19" },
  { id: 9,  customer: "وليد الحلو",     subject: "زارة مطبخ فاخر بالرخام",     product: "KT-2008", channel: "واتساب",      status: "قيد المعالجة", priority: "عالية", date: "2026-10-19" },
  { id: 10, customer: "لمياء فؤاد",     subject: "باب مصفح مزدوج للفلل",       product: "DR-1008", channel: "هاتف",        status: "جديد",         priority: "متوسطة", date: "2026-10-19" },
  { id: 11, customer: "سامي الهواري",   subject: "مفصلات هيدروليكية للباب",    product: "AC-3002", channel: "واتساب",      status: "مغلق",         priority: "عادية",  date: "2026-10-08" },
  { id: 12, customer: "غادة المليجي",   subject: "استفسار عن الضمان",          product: "—",       channel: "نموذج الموقع", status: "تم الرد",      priority: "عادية",  date: "2026-10-11" },
  { id: 13, customer: "كريم طلعت",      subject: "باب PVC سرجي للمخزن",        product: "DR-1004", channel: "واتساب",      status: "قيد المعالجة", priority: "عادية",  date: "2026-10-10" },
  { id: 14, customer: "داليا سعيد",     subject: "مطبخ مينيمال أبيض",          product: "KT-2003", channel: "نموذج الموقع", status: "تم الرد",      priority: "متوسطة", date: "2026-10-09" },
  { id: 15, customer: "ياسر فرغلي",     subject: "معاينة منزلية للأبواب",      product: "—",       channel: "هاتف",        status: "مغلق",         priority: "عادية",  date: "2026-10-06" }
];

/* ------------------------------ عروض الأسعار ------------------------------ */
const QUOTES = [
  { id: 1,  code: "Q-2026-041", customer: "محمود الطرشوبي",  items: "باب مصفح + قفل ذكي",   total: 6070,  status: "مرسلة",   date: "2026-10-18", validUntil: "2026-11-01" },
  { id: 2,  code: "Q-2026-040", customer: "سلمى الشناوي",    items: "مطبخ كلاسيكي كامل",    total: 32000, status: "مقبولة",  date: "2026-10-17", validUntil: "2026-10-31" },
  { id: 3,  code: "Q-2026-039", customer: "خالد عبد الحميد",   items: "بابان منزلقان",        total: 6700,  status: "مرسلة",   date: "2026-10-16", validUntil: "2026-10-30" },
  { id: 4,  code: "Q-2026-038", customer: "بلال فتحي",     items: "مطبخ جزيرة وسطى",      total: 56000, status: "مقبولة",  date: "2026-10-14", validUntil: "2026-10-28" },
  { id: 5,  code: "Q-2026-037", customer: "وليد الحلو",    items: "مطبخ رخامي إيطالي",    total: 48000, status: "مرسلة",   date: "2026-10-13", validUntil: "2026-10-27" },
  { id: 6,  code: "Q-2026-036", customer: "سامي الهواري",     items: "مفصلات + تركيب",       total: 840,   status: "مقبولة",  date: "2026-10-09", validUntil: "2026-10-23" },
  { id: 7,  code: "Q-2026-035", customer: "أحمد عرفة",    items: "باب حمام + تركيب",     total: 890,   status: "مرفوضة",  date: "2026-10-07", validUntil: "2026-10-21" },
  { id: 8,  code: "Q-2026-034", customer: "كريم طلعت",   items: "باب PVC سرجي ×2",      total: 2900,  status: "مرسلة",   date: "2026-10-05", validUntil: "2026-10-19" },
  { id: 9,  code: "Q-2026-033", customer: "داليا سعيد",      items: "مطبخ مينيمال",         total: 19500, status: "منتهية",  date: "2026-09-28", validUntil: "2026-10-12" },
  { id: 10, code: "Q-2026-032", customer: "طارق سليمان",     items: "قفل ذكي + تركيب",      total: 1250,  status: "مقبولة",  date: "2026-09-24", validUntil: "2026-10-08" },
  { id: 11, code: "Q-2026-031", customer: "غادة المليجي",    items: "باب داخلي + مقبض فاخر", total: 2050,  status: "مسودة",   date: "2026-10-19", validUntil: "—" },
  { id: 12, code: "Q-2026-030", customer: "ماجد زكي",    items: "باب شرفة عريض",        total: 4100,  status: "مرسلة",   date: "2026-10-19", validUntil: "2026-11-02" }
];

/* ------------------------------ المستخدمون (Identity) ------------------------------ */
const USERS = [
  { id: 1, name: "أحمد المدير",    email: "admin@smarthouse.eg",    role: "مدير النظام",   status: "نشط", lastLogin: "2026-10-19 09:12" },
  { id: 2, name: "منى موظفة المبيعات", email: "sales@smarthouse.eg", role: "موظف مبيعات",  status: "نشط", lastLogin: "2026-10-19 08:47" },
  { id: 3, name: "سعيد المبيعات",  email: "saeed@smarthouse.eg",    role: "موظف مبيعات",   status: "نشط", lastLogin: "2026-10-18 16:30" },
  { id: 4, name: "ليلى محررة المحتوى", email: "content@smarthouse.eg", role: "محرر محتوى",  status: "نشط", lastLogin: "2026-10-17 11:05" },
  { id: 5, name: "حساب المخزون",   email: "stock@smarthouse.eg",    role: "موظف مبيعات",   status: "موقوف", lastLogin: "2026-09-02 10:00" },
  { id: 6, name: "محمود الطرشوبي", email: "abdullah@example.com",   role: "عميل",          status: "نشط", lastLogin: "2026-10-15 20:41" },
  { id: 7, name: "سلمى الشناوي",   email: "noura@example.com",      role: "عميل",          status: "نشط", lastLogin: "2026-10-16 14:22" },
  { id: 8, name: "فهد الجندي",     email: "fahad@example.com",      role: "عميل",          status: "موقوف", lastLogin: "2026-08-30 19:15" }
];

/* ------------------------------ سجل النشاط ------------------------------ */
const ACTIVITIES = [
  { icon: "bi-file-earmark-text", color: "gold",   text: "تم إرسال عرض السعر <b>Q-2026-041</b> إلى محمود الطرشوبي", time: "قبل 12 دقيقة" },
  { icon: "bi-person-plus",       color: "green",  text: "عميل جديد سجل في الموقع: <b>لمياء فؤاد</b>",              time: "قبل 40 دقيقة" },
  { icon: "bi-chat-dots",         color: "blue",   text: "استفسار واتساب جديد من <b>محمود الطرشوبي</b>",             time: "قبل ساعة" },
  { icon: "bi-check2-circle",     color: "green",  text: "العميل <b>سلمى الشناوي</b> قبلت عرض السعر Q-2026-040",      time: "قبل 3 ساعات" },
  { icon: "bi-box-seam",          color: "gold",   text: "أضيف منتج جديد للمسودات: <b>DR-1008</b>",                  time: "أمس" },
  { icon: "bi-pencil",            color: "gray",   text: "حدّثت ليلى محتوى صفحة <b>الخامات والتشطيبات</b>",          time: "أمس" },
  { icon: "bi-x-circle",          color: "red",    text: "العميل <b>أحمد عرفة</b> رفض عرض Q-2026-037 (السعر)",    time: "قبل يومين" },
  { icon: "bi-shield-lock",       color: "blue",   text: "تسجيل دخول ناجح من جهاز جديد للمدير <b>أحمد</b>",          time: "قبل 3 أيام" }
];

/* ------------------------------ إعدادات عامة ------------------------------ */
const DEMO_LABEL = "بيانات تجريبية";
