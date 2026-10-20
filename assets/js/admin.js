/* ============================================================================
   SMART HOUSE | سمارت هاوس — محرك لوحة الإدارة + المصادقة (Front-End Prototype)
   ----------------------------------------------------------------------------
   نقاط الربط المستقبلية مع ASP.NET Core 8:
     - المصادقة: POST /api/auth/login | /api/auth/register | /api/auth/forgot-password
       (Identity + JWT — الجلسة الحالية هنا محاكاة في localStorage)
     - الجداول: GET /api/products?search=&category=&status=&page=&sort=
     - الإحصائيات: GET /api/reports/summary?range=
   ⚠ بيانات العرض من admin-data.js هي بيانات تجريبية وليست نتائج فعلية.
   ============================================================================ */
"use strict";

/* ============================ أدوات مساعدة ============================ */
const AR = "ar-EG";
const fmtN = n => new Intl.NumberFormat(AR).format(n);
const fmtEGP = n => new Intl.NumberFormat(AR).format(n) + " ج.م";
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

/* مولّد عشوائي بذري — بيانات ثابتة لكل نطاق زمني (ليس عشوائيًا كل مرة) */
function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

const STATUS_CLS = {
  "منشور": "st-green", "مسودة": "st-gray", "مخفي": "st-orange", "نشط": "st-green",
  "غير نشط": "st-gray", "موقوف": "st-red", "جديد": "st-blue", "قيد المعالجة": "st-gold",
  "تم الرد": "st-green", "مغلق": "st-gray", "مرسلة": "st-blue", "مقبولة": "st-green",
  "مرفوضة": "st-red", "منتهية": "st-gray", "عالية": "st-red", "متوسطة": "st-orange", "عادية": "st-gray"
};
const stBadge = s => `<span class="st ${STATUS_CLS[s] || "st-gray"}">${esc(s)}</span>`;

function toast(msg, type = "gold") {
  let host = $("#shToastHost");
  if (!host) { host = document.createElement("div"); host.id = "shToastHost";
    host.style.cssText = "position:fixed;bottom:1.2rem;inset-inline-start:1.2rem;z-index:2000;display:flex;flex-direction:column;gap:.5rem";
    document.body.appendChild(host); }
  const bg = { gold: "#25282B", success: "#2E8B57", danger: "#DC2626" }[type];
  const el = document.createElement("div");
  el.style.cssText = `background:${bg};color:#fff;font-weight:700;font-size:.82rem;padding:.7rem 1.1rem;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.25);display:flex;align-items:center;gap:.5rem`;
  el.innerHTML = `<i class="bi ${type === "success" ? "bi-check2-circle" : type === "danger" ? "bi-x-circle" : "bi-info-circle"}"></i> ${msg}`;
  host.appendChild(el);
  setTimeout(() => { el.style.opacity = "0"; el.style.transition = "opacity .4s"; setTimeout(() => el.remove(), 450); }, 2600);
}

/* ============================ الجلسة (محاكاة Identity) ============================ */
const SESSION_KEY = "sh_session";
function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
}
function setSession(s) { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); }
function logout() { localStorage.removeItem(SESSION_KEY); location.href = "login.html"; }

/* حارس الوصول: يمنع دخول الإدارة بدون جلسة إدارية (محاكاة [Authorize(Roles="Admin")]) */
function guardAdmin() {
  const s = getSession();
  if (!s) { location.href = "login.html"; return null; }
  if (s.role === "عميل") { location.href = "access-denied.html"; return null; }
  return s;
}

/* ============================ هيكل اللوحة ============================ */
const MENU = [
  { key: "dashboard",  label: "الرئيسية",            icon: "bi-speedometer2",     href: "admin.html" },
  { key: "products",   label: "المنتجات",            icon: "bi-box-seam",         href: "admin-products.html" },
  { key: "categories", label: "التصنيفات",           icon: "bi-diagram-3",        href: "admin-categories.html" },
  { key: "images",     label: "صور المنتجات",        icon: "bi-images",           href: "admin-images.html" },
  { key: "label1", label: "العملاء والمبيعات" },
  { key: "customers",  label: "العملاء",             icon: "bi-people",           href: "admin-customers.html" },
  { key: "inquiries",  label: "استفسارات العملاء",   icon: "bi-chat-dots",        href: "admin-inquiries.html", badge: INQUIRIES.filter(i => i.status === "جديد").length },
  { key: "quotations", label: "عروض الأسعار",        icon: "bi-file-earmark-text", href: "admin-quotations.html" },
  { key: "orders",     label: "الطلبات",             icon: "bi-bag-check",        disabled: true, note: "غير مفعّل" },
  { key: "reports",    label: "التقارير والإحصائيات", icon: "bi-graph-up-arrow",   href: "admin-reports.html" },
  { key: "label2", label: "النظام" },
  { key: "users",      label: "المستخدمون والصلاحيات", icon: "bi-person-gear",    href: "admin-users.html", adminOnly: true },
  { key: "content",    label: "محتوى الموقع",        icon: "bi-layout-text-window", href: "admin-content.html" },
  { key: "settings",   label: "الإعدادات",           icon: "bi-gear",             href: "admin-settings.html" },
  { key: "logout",     label: "تسجيل الخروج",        icon: "bi-box-arrow-right",  action: "logout" }
];

function buildShell(session, activeKey, title, crumbs) {
  const isManager = session.role === "مدير النظام";
  const links = MENU.filter(m => !m.adminOnly || isManager).map(m => {
    if (m.label && m.label.startsWith("label")) {
      return `<div class="side-label">${m.label === "label1" ? "العملاء والمبيعات" : "النظام"}</div>`;
    }
    if (m.action === "logout")
      return `<a href="#" class="side-link logout" data-act="logout"><i class="bi ${m.icon}"></i><span>${m.label}</span></a>`;
    const badge = m.badge ? `<span class="badge rounded-pill bg-danger">${m.badge}</span>` : "";
    const note = m.note ? `<span class="badge rounded-pill bg-secondary-subtle text-secondary" style="font-size:.6rem">${m.note}</span>` : "";
    return `<a href="${m.disabled ? "#" : m.href}" class="side-link ${m.key === activeKey ? "active" : ""}" ${m.disabled ? 'data-act="disabled"' : ""}>
      <i class="bi ${m.icon}"></i><span>${m.label}</span>${badge || note}</a>`;
  }).join("");

  const initials = session.name.trim().charAt(0);
  document.getElementById("app").innerHTML = `
  <div class="admin-shell" id="shell">
    <div class="sidebar-backdrop" id="backdrop"></div>
    <aside class="admin-sidebar" id="sidebar">
      <div class="side-brand">
        <img src="assets/img/logo.jpg" alt="لوجو سمارت هاوس" />
        <div class="t">سمارت هاوس<small>SMART HOUSE · لوحة الإدارة</small></div>
      </div>
      <nav class="side-nav">
        <div class="side-label">القائمة الرئيسية</div>
        ${links}
      </nav>
      <div class="side-foot">الإصدار 1.0 — قالب تجريبي<br>© 2026 سمارت هاوس</div>
    </aside>
    <div class="admin-main">
      <header class="admin-topbar">
        <button class="top-btn btn-sidebar-mobile" id="btnMobile" aria-label="فتح القائمة"><i class="bi bi-list"></i></button>
        <button class="top-btn d-none d-lg-grid" id="btnCollapse" aria-label="طي الشريط الجانبي"><i class="bi bi-layout-sidebar-inset"></i></button>
        <div>
          <h5 class="page-title">${esc(title)}</h5>
          <nav class="breadcrumb">
            <a href="admin.html">اللوحة</a>
            ${crumbs.map(c => ` <i class="bi bi-chevron-left" style="font-size:.55rem"></i> <span class="active">${esc(c)}</span>`).join("")}
          </nav>
        </div>
        <div class="input-group top-search ms-auto d-none d-md-flex">
          <span class="input-group-text"><i class="bi bi-search"></i></span>
          <input type="search" class="form-control" id="globalSearch" placeholder="بحث سريع…" aria-label="بحث">
        </div>
        <div class="dropdown">
          <button class="top-btn" data-bs-toggle="dropdown" aria-label="الإشعارات">
            <i class="bi bi-bell"></i><span class="dot"></span>
          </button>
          <div class="dropdown-menu dropdown-menu-start shadow" style="min-width:300px">
            <div class="px-3 py-2 fw-bold" style="font-size:.8rem">الإشعارات</div>
            <div class="dropdown-item small d-flex gap-2 py-2"><i class="bi bi-chat-dots text-warning"></i><span>3 استفسارات جديدة تنتظر الرد</span></div>
            <div class="dropdown-item small d-flex gap-2 py-2"><i class="bi bi-file-earmark-text text-primary"></i><span>عرض Q-2026-040 قُبل من العميل</span></div>
            <div class="dropdown-item small d-flex gap-2 py-2"><i class="bi bi-person-plus text-success"></i><span>عميل جديد: لمياء الشهري</span></div>
          </div>
        </div>
        <div class="dropdown">
          <button class="btn p-0 border-0 bg-transparent user-chip" data-bs-toggle="dropdown" aria-label="قائمة الحساب">
            <span class="avatar">${esc(initials)}</span>
            <span class="meta d-none d-sm-block"><span class="n d-block">${esc(session.name)}</span><span class="r">${esc(session.role)}</span></span>
            <i class="bi bi-chevron-down small text-secondary"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-start shadow">
            <li><a class="dropdown-item small" href="admin-settings.html"><i class="bi bi-gear me-2"></i>الإعدادات</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><button class="dropdown-item small text-danger" data-act="logout"><i class="bi bi-box-arrow-right me-2"></i>تسجيل الخروج</button></li>
          </ul>
        </div>
      </header>
      <main class="admin-content" id="pageContent"></main>
    </div>
  </div>`;

  /* الأحداث العامة */
  document.addEventListener("click", e => {
    const act = e.target.closest("[data-act]");
    if (!act) return;
    if (act.dataset.act === "logout") { e.preventDefault(); logout(); }
    if (act.dataset.act === "disabled") { e.preventDefault(); toast("إدارة الطلبات غير مفعّلة في هذه النسخة", "gold"); }
  });
  const shell = $("#shell"), sb = $("#sidebar"), bd = $("#backdrop");
  $("#btnMobile")?.addEventListener("click", () => { sb.classList.add("open"); bd.classList.add("show"); });
  bd.addEventListener("click", () => { sb.classList.remove("open"); bd.classList.remove("show"); });
  $("#btnCollapse")?.addEventListener("click", () => shell.classList.toggle("collapsed"));
  $("#globalSearch")?.addEventListener("keydown", e => {
    if (e.key === "Enter") { location.href = "admin-products.html?q=" + encodeURIComponent(e.target.value.trim()); }
  });
}

/* إعدادات Chart.js عامة */
function chartDefaults() {
  Chart.defaults.font.family = "Cairo, Tahoma, sans-serif";
  Chart.defaults.font.size = 11;
  Chart.defaults.color = "#737780";
  Chart.defaults.plugins.legend.rtl = true;
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.pointStyle = "circle";
  Chart.defaults.plugins.tooltip.rtl = true;
  Chart.defaults.plugins.tooltip.textDirection = "rtl";
  Chart.defaults.maintainAspectRatio = false;
}
const GOLD = "#C49A45", CHARCOAL = "#25282B", GRAY = "#737780", GREEN = "#2E8B57", BLUE = "#2563EB", RED = "#DC2626", ORANGE = "#D97706";
const PALETTE = [GOLD, CHARCOAL, GRAY, GREEN, BLUE, ORANGE, "#8E6BB8", "#3AA6A0"];

/* ============================ الصفحة: لوحة المعلومات ============================ */
function pageDashboard(session) {
  const content = $("#pageContent");

  /* قيم KPI من البيانات التجريبية */
  const published = ADMIN_PRODUCTS.filter(p => p.status === "منشور").length;
  const newInq = INQUIRIES.filter(i => i.status === "جديد").length;
  const sentQ = QUOTES.filter(q => q.status === "مرسلة").length;
  const accQ = QUOTES.filter(q => q.status === "مقبولة").length;
  const accValue = QUOTES.filter(q => q.status === "مقبولة").reduce((s, q) => s + q.total, 0);

  const KPIS = [
    { t: "إجمالي المنتجات", v: fmtN(ADMIN_PRODUCTS.length), sub: `${published} منشور`, icon: "bi-box-seam", cls: "", delta: "+2 هذا الشهر", up: true },
    { t: "إجمالي التصنيفات", v: fmtN(CATEGORIES.length), sub: `${CATEGORIES.filter(c => c.active).length} مفعّل`, icon: "bi-diagram-3", cls: "blue", delta: "ثابت", flat: true },
    { t: "إجمالي العملاء", v: fmtN(CUSTOMERS.length), sub: `${CUSTOMERS.filter(c => c.status === "نشط").length} نشط`, icon: "bi-people", cls: "green", delta: "+8.4%", up: true },
    { t: "استفسارات جديدة", v: fmtN(newInq), sub: "بحاجة لرد اليوم", icon: "bi-chat-dots", cls: "red", delta: "+3 أسبوعيًا", up: true },
    { t: "عروض الأسعار المرسلة", v: fmtN(sentQ), sub: "بانتظار رد العميل", icon: "bi-file-earmark-text", cls: "", delta: "+1", up: true },
    { t: "عروض مقبولة", v: fmtN(accQ), sub: "معدل القبول 27%", icon: "bi-check2-circle", cls: "green", delta: "+2", up: true },
    { t: "الطلبات المكتملة", v: "—", sub: "إدارة الطلبات غير مفعّلة", icon: "bi-bag-check", cls: "gray", disabled: true },
    { t: "قيمة العروض المقبولة", v: fmtEGP(accValue), sub: "ليست إيرادات فعلية", icon: "bi-graph-up", cls: "", delta: "+14%", up: true, demo: true }
  ];

  content.innerHTML = `
    <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
      <div>
        <h5 class="fw-bold mb-1">أهلًا ${esc(session.name.split(" ")[0])} 👋 — نظرة سريعة على الأداء</h5>
        <span class="text-secondary" style="font-size:.8rem">ملخص النشاط لثلاثين يومًا الأخيرة</span>
      </div>
      <span class="demo-tag"><i class="bi bi-database"></i> ${DEMO_LABEL}</span>
    </div>

    <!-- بطاقات المؤشرات -->
    <div class="row g-3 mb-4" id="kpiGrid">
      ${KPIS.map(k => `
      <div class="col-6 col-md-4 col-xxl-3">
        <div class="kpi-card ${k.disabled ? "kpi-disabled" : ""}">
          <div class="kpi-top"><span class="kpi-title">${k.t}</span><span class="kpi-icon ${k.cls}"><i class="bi ${k.icon}"></i></span></div>
          <div class="kpi-value">${k.v}</div>
          <div class="kpi-foot">
            <span class="kpi-note">${k.sub}</span>
            ${k.delta ? `<span class="trend ${k.up ? "up" : k.flat ? "flat" : "down"}"><i class="bi bi-arrow-${k.flat ? "right" : k.up ? "up" : "down"}"></i>${k.delta}</span>` : ""}
          </div>
          ${k.demo ? `<span class="demo-tag" style="position:absolute;top:.7rem;inset-inline-start:.9rem">تجريبي</span>` : ""}
          <canvas class="kpi-spark" width="90" height="34" data-seed="${k.t.length}"></canvas>
        </div>
      </div>`).join("")}
    </div>

    <!-- فلاتر النطاق الزمني -->
    <div class="sh-card mb-4">
      <div class="card-body-p d-flex flex-wrap align-items-center gap-2">
        <span class="fw-bold" style="font-size:.85rem"><i class="bi bi-funnel text-gold me-1"></i> نطاق البيانات:</span>
        <div id="rangeBtns" class="d-flex flex-wrap gap-2">
          <button class="range-chip" data-range="1">اليوم</button>
          <button class="range-chip active" data-range="7">آخر 7 أيام</button>
          <button class="range-chip" data-range="30">آخر 30 يومًا</button>
          <button class="range-chip" data-range="90">آخر 90 يومًا</button>
          <button class="range-chip" data-range="custom">فترة مخصصة</button>
        </div>
        <div id="customRange" class="d-none d-flex gap-2 align-items-center">
          <input type="date" class="form-control form-control-sm" id="dateFrom" style="max-width:150px">
          <span class="text-secondary small">إلى</span>
          <input type="date" class="form-control form-control-sm" id="dateTo" style="max-width:150px">
          <button class="btn-sh-gold btn-sm" id="applyCustom">تطبيق</button>
        </div>
        <span class="text-secondary ms-auto" style="font-size:.72rem" id="rangeInfo"></span>
      </div>
    </div>

    <!-- المخططات -->
    <div class="row g-3 mb-4">
      <div class="col-xl-8">
        <div class="sh-card h-100">
          <div class="card-head"><h6>استفسارات العملاء الشهرية</h6><span class="sub">خط زمني</span></div>
          <div class="card-body-p chart-box chart-h-fixed"><canvas id="chInqLine"></canvas></div>
        </div>
      </div>
      <div class="col-xl-4">
        <div class="sh-card h-100">
          <div class="card-head"><h6>توزيع المنتجات حسب التصنيف</h6></div>
          <div class="card-body-p chart-box chart-h-fixed"><canvas id="chCatDough"></canvas></div>
        </div>
      </div>
      <div class="col-xl-7">
        <div class="sh-card h-100">
          <div class="card-head"><h6>المنتجات الأكثر مشاهدة</h6><span class="sub">أعلى 6</span></div>
          <div class="card-body-p chart-box chart-h-fixed"><canvas id="chViews"></canvas></div>
        </div>
      </div>
      <div class="col-xl-5">
        <div class="sh-card h-100">
          <div class="card-head"><h6>حالات عروض الأسعار</h6></div>
          <div class="card-body-p chart-box chart-h-fixed"><canvas id="chQuoteDough"></canvas></div>
        </div>
      </div>
      <div class="col-xl-8">
        <div class="sh-card h-100">
          <div class="card-head"><h6>اتجاه الاستفسارات</h6><span class="sub">منطقة ممتلئة</span></div>
          <div class="card-body-p chart-box chart-h-fixed"><canvas id="chTrend"></canvas></div>
        </div>
      </div>
      <div class="col-xl-4">
        <div class="sh-card h-100">
          <div class="card-head"><h6>أحدث النشاطات</h6><i class="bi bi-activity text-gold"></i></div>
          <div class="card-body-p activity-feed">
            ${ACTIVITIES.map(a => `
            <div class="activity-item">
              <span class="a-icon ${a.color}"><i class="bi ${a.icon}"></i></span>
              <div><div class="a-text">${a.text}</div><span class="a-time">${a.time}</span></div>
            </div>`).join("")}
          </div>
        </div>
      </div>
    </div>`;

  /* --- المخططات --- */
  chartDefaults();
  const charts = [];

  /* خطوط صغيرة في بطاقات KPI */
  $$("#kpiGrid .kpi-spark").forEach(cv => {
    const rnd = seeded(42 + Number(cv.dataset.seed));
    const data = Array.from({ length: 14 }, () => 40 + rnd() * 60);
    charts.push(new Chart(cv, {
      type: "line",
      data: { labels: data.map((_, i) => i), datasets: [{ data, borderColor: GOLD, borderWidth: 1.6, pointRadius: 0, tension: .45, fill: false }] },
      options: { plugins: { legend: { display: false }, tooltip: { enabled: false } }, scales: { x: { display: false }, y: { display: false } } }
    }));
  });

  const labelsShort = ["ينا", "فبر", "مار", "أبر", "ماي", "يون", "يول", "أغس", "سبت", "أكت"];

  function drawAll(days) {
    charts.forEach(c => c.destroy());
    charts.length = 0;
    const rnd = seeded(days * 17 + 5);
    const months = days <= 7 ? 7 : Math.min(10, Math.round(days / 9));
    const lbl = Array.from({ length: months }, (_, i) =>
      days <= 7 ? ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"][i] : labelsShort[i]);

    /* 1) استفسارات شهرية — خط */
    charts.push(new Chart($("#chInqLine"), {
      type: "line",
      data: {
        labels: lbl,
        datasets: [{ label: "استفسارات", data: lbl.map(() => 8 + Math.round(rnd() * 22)), borderColor: GOLD, backgroundColor: "rgba(196,154,69,.14)", fill: true, tension: .4, pointRadius: 3, pointBackgroundColor: GOLD }]
      },
      options: { scales: { y: { beginAtZero: true, ticks: { precision: 0 } }, x: { grid: { display: false } } }, plugins: { legend: { display: false } } }
    }));

    /* 2) توزيع التصنيفات — دونات */
    charts.push(new Chart($("#chCatDough"), {
      type: "doughnut",
      data: {
        labels: CATEGORIES.map(c => c.name),
        datasets: [{ data: ADMIN_PRODUCTS.reduce((acc, p) => { const i = CATEGORIES.findIndex(c => c.id === p.catId); acc[i] = (acc[i] || 0) + 1; return acc; }, CATEGORIES.map(() => 0)), backgroundColor: PALETTE, borderWidth: 0, hoverOffset: 6 }]
      },
      options: { cutout: "62%", plugins: { legend: { position: "bottom", labels: { padding: 12, font: { size: 10 } } } } }
    }));

    /* 3) الأكثر مشاهدة — شرائح أفقية */
    const top = ADMIN_PRODUCTS.slice().sort((a, b) => b.views - a.views).slice(0, 6);
    charts.push(new Chart($("#chViews"), {
      type: "bar",
      data: {
        labels: top.map(p => p.code),
        datasets: [{ label: "مشاهدة", data: top.map(p => p.views), backgroundColor: GOLD, borderRadius: 7, maxBarThickness: 18 }]
      },
      options: { indexAxis: "y", scales: { x: { beginAtZero: true, grid: { color: "#F1EEE7" } }, y: { grid: { display: false } } }, plugins: { legend: { display: false } } }
    }));

    /* 5) حالات العروض — دونات */
    const qStatuses = ["مرسلة", "مقبولة", "مرفوضة", "منتهية", "مسودة"];
    charts.push(new Chart($("#chQuoteDough"), {
      type: "doughnut",
      data: {
        labels: qStatuses,
        datasets: [{ data: qStatuses.map(s => QUOTES.filter(q => q.status === s).length), backgroundColor: [BLUE, GREEN, RED, GRAY, ORANGE], borderWidth: 0, hoverOffset: 6 }]
      },
      options: { cutout: "62%", plugins: { legend: { position: "bottom", labels: { padding: 10, font: { size: 10 } } } } }
    }));

    /* 7) اتجاه الاستفسارات — منطقة */
    charts.push(new Chart($("#chTrend"), {
      type: "line",
      data: {
        labels: lbl,
        datasets: [
          { label: "مستلمة", data: lbl.map(() => 10 + Math.round(rnd() * 25)), borderColor: BLUE, backgroundColor: "rgba(37,99,235,.12)", fill: true, tension: .4, pointRadius: 0 },
          { label: "تم الرد عليها", data: lbl.map(() => 6 + Math.round(rnd() * 18)), borderColor: GREEN, backgroundColor: "rgba(46,139,87,.1)", fill: true, tension: .4, pointRadius: 0 }
        ]
      },
      options: { scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }, plugins: { legend: { position: "bottom" } } }
    }));
  }
  drawAll(7);

  /* فلاتر النطاق */
  $("#rangeBtns").addEventListener("click", e => {
    const b = e.target.closest(".range-chip"); if (!b) return;
    $$("#rangeBtns .range-chip").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    $("#customRange").classList.toggle("d-none", b.dataset.range !== "custom");
    if (b.dataset.range !== "custom") {
      drawAll(Number(b.dataset.range));
      $("#rangeInfo").textContent = b.textContent.trim();
    }
  });
  $("#applyCustom").addEventListener("click", () => {
    const from = $("#dateFrom").value, to = $("#dateTo").value;
    if (!from || !to) { toast("اختر التاريخين أولًا", "danger"); return; }
    const days = Math.max(1, Math.round((new Date(to) - new Date(from)) / 864e5));
    drawAll(Math.min(90, days));
    $("#rangeInfo").textContent = "فترة مخصصة (" + days + " يوم)";
  });
}

/* ============================ الصفحة: المنتجات ============================ */
function pageProducts(session) {
  const content = $("#pageContent");
  let state = {
    q: new URLSearchParams(location.search).get("q") || "",
    cat: "all", status: "all", material: "all",
    sort: "createdAt", dir: -1, page: 1, perPage: 6, editing: null
  };

  content.innerHTML = `
    <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
      <div class="d-flex align-items-center gap-2 flex-wrap">
        <span class="demo-tag"><i class="bi bi-database"></i> ${DEMO_LABEL}</span>
        <span class="text-secondary" style="font-size:.78rem" id="prodCount"></span>
      </div>
      <button class="btn-sh-gold" id="btnAdd"><i class="bi bi-plus-lg me-1"></i> منتج جديد</button>
    </div>

    <!-- الفلاتر -->
    <div class="sh-card mb-3">
      <div class="card-body-p row g-2 align-items-end">
        <div class="col-md-3"><label class="small fw-bold text-secondary mb-1">بحث بالاسم أو الكود</label>
          <input id="fSearch" class="form-control form-control-sm" placeholder="DR-10 أو مطبخ…" value="${esc(state.q)}"></div>
        <div class="col-6 col-md-2"><label class="small fw-bold text-secondary mb-1">التصنيف</label>
          <select id="fCat" class="form-select form-select-sm"><option value="all">كل التصنيفات</option>
            ${CATEGORIES.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join("")}</select></div>
        <div class="col-6 col-md-2"><label class="small fw-bold text-secondary mb-1">الخامة</label>
          <select id="fMat" class="form-select form-select-sm"><option value="all">كل الخامات</option>
            ${[...new Set(ADMIN_PRODUCTS.map(p => p.material))].map(m => `<option>${esc(m)}</option>`).join("")}</select></div>
        <div class="col-6 col-md-2"><label class="small fw-bold text-secondary mb-1">الحالة</label>
          <select id="fStatus" class="form-select form-select-sm"><option value="all">الكل</option>
            ${["منشور", "مسودة", "مخفي"].map(s => `<option>${s}</option>`).join("")}</select></div>
        <div class="col-6 col-md-3 d-flex gap-2 justify-content-end">
          <button class="btn-sh-ghost btn-sm" id="btnClear"><i class="bi bi-eraser me-1"></i> تصفير</button>
        </div>
      </div>
    </div>

    <!-- الجدول -->
    <div class="sh-card">
      <div class="sh-table-wrap">
        <table class="sh-table">
          <thead><tr>
            <th>المنتج</th>
            <th class="sortable" data-sort="code">الكود <i class="bi bi-arrow-down-up sort-ic"></i></th>
            <th class="sortable" data-sort="name">الاسم <i class="bi bi-arrow-down-up sort-ic"></i></th>
            <th>التصنيف</th><th>الخامة</th>
            <th class="sortable" data-sort="priceFrom">السعر يبدأ من <i class="bi bi-arrow-down-up sort-ic"></i></th>
            <th>الحالة</th>
            <th class="sortable" data-sort="views">المشاهدات <i class="bi bi-arrow-down-up sort-ic"></i></th>
            <th class="sortable" data-sort="createdAt">تاريخ الإضافة <i class="bi bi-arrow-down-up sort-ic"></i></th>
            <th>إجراءات</th>
          </tr></thead>
          <tbody id="prodBody"></tbody>
        </table>
      </div>
      <div class="card-body-p d-flex justify-content-between align-items-center flex-wrap gap-2" style="border-top:1px solid var(--sh-line)">
        <span class="text-secondary" style="font-size:.75rem" id="pageInfo"></span>
        <div class="sh-pagination" id="pager"></div>
      </div>
    </div>

    <!-- نافذة إضافة/تعديل -->
    <div class="modal fade" id="prodModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content" style="border-radius:16px;border:0">
          <div class="modal-header" style="border-bottom:1px solid var(--sh-line)">
            <h5 class="modal-title fw-bold" id="prodModalTitle">منتج جديد</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="إغلاق"></button>
          </div>
          <form id="prodForm" novalidate>
            <div class="modal-body row g-3">
              <div class="col-md-6"><label class="small fw-bold mb-1">اسم المنتج *</label>
                <input name="name" class="form-control" required><div class="field-error">الاسم مطلوب</div></div>
              <div class="col-md-6"><label class="small fw-bold mb-1">كود المنتج *</label>
                <input name="code" class="form-control" required placeholder="DR-1011"><div class="field-error">الكود مطلوب</div></div>
              <div class="col-md-6"><label class="small fw-bold mb-1">التصنيف *</label>
                <select name="catId" class="form-select">${CATEGORIES.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join("")}</select></div>
              <div class="col-md-6"><label class="small fw-bold mb-1">الخامة</label>
                <input name="material" class="form-control" placeholder="MDF، فولاذ…"></div>
              <div class="col-md-4"><label class="small fw-bold mb-1">السعر يبدأ من (ج.م) *</label>
                <input name="priceFrom" type="number" min="0" class="form-control" required><div class="field-error">أدخل سعرًا صحيحًا</div></div>
              <div class="col-md-4"><label class="small fw-bold mb-1">حالة النشر</label>
                <select name="status" class="form-select">${["منشور", "مسودة", "مخفي"].map(s => `<option>${s}</option>`).join("")}</select></div>
              <div class="col-md-4"><label class="small fw-bold mb-1">الصورة (مسار)</label>
                <input name="image" class="form-control" value="assets/img/dr-1001.jpg"></div>
              <div class="col-12"><label class="small fw-bold mb-1">وصف مختصر</label>
                <textarea name="desc" class="form-control" rows="2"></textarea></div>
              <div class="col-12 small text-secondary"><i class="bi bi-info-circle me-1"></i>
                عند الربط الفعلي: <code>POST /api/products</code> (مدير/موظف فقط) والصور عبر <code>POST /api/products/{id}/images</code>.</div>
            </div>
            <div class="modal-footer" style="border-top:1px solid var(--sh-line)">
              <button type="button" class="btn-sh-ghost" data-bs-dismiss="modal">إلغاء</button>
              <button type="submit" class="btn-sh-gold" id="prodSave"><i class="bi bi-check2 me-1"></i> حفظ المنتج</button>
            </div>
          </form>
        </div>
      </div>
    </div>`;

  const catName = id => (CATEGORIES.find(c => c.id === Number(id)) || {}).name || "—";

  function filtered() {
    let list = ADMIN_PRODUCTS.filter(p =>
      (state.cat === "all" || p.catId === Number(state.cat)) &&
      (state.status === "all" || p.status === state.status) &&
      (state.material === "all" || p.material === state.material) &&
      (!state.q || (p.name + p.code).includes(state.q)));
    const k = state.sort;
    list.sort((a, b) => typeof a[k] === "string" ? a[k].localeCompare(b[k], "ar") * state.dir : (a[k] - b[k]) * state.dir);
    return list;
  }

  function render() {
    const list = filtered();
    const pages = Math.max(1, Math.ceil(list.length / state.perPage));
    state.page = Math.min(state.page, pages);
    const slice = list.slice((state.page - 1) * state.perPage, state.page * state.perPage);

    $("#prodBody").innerHTML = slice.map(p => `
      <tr>
        <td><img src="${p.image}" class="prod-thumb" alt="${esc(p.name)}" onerror="this.src='data:image/svg+xml;utf8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2252%22 height=%2244%22%3E%3Crect fill=%22%23F1EEE7%22 width=%2252%22 height=%2244%22/%3E%3C/svg%3E'"></td>
        <td><span class="code-chip">${esc(p.code)}</span></td>
        <td class="fw-bold" style="font-size:.82rem">${esc(p.name)}</td>
        <td>${esc(catName(p.catId))}</td>
        <td class="text-secondary">${esc(p.material)}</td>
        <td class="fw-bold" style="color:#9A742B">${fmtEGP(p.priceFrom)}</td>
        <td>${stBadge(p.status)}</td>
        <td>${fmtN(p.views)}</td>
        <td class="text-secondary" dir="ltr">${p.createdAt}</td>
        <td>
          <button class="icon-act" data-edit="${p.id}" title="تعديل"><i class="bi bi-pencil"></i></button>
          <button class="icon-act" data-toggle="${p.id}" title="تبديل النشر"><i class="bi bi-eye${p.status === "منشور" ? "-slash" : ""}"></i></button>
          <button class="icon-act danger" data-del="${p.id}" title="حذف"><i class="bi bi-trash3"></i></button>
        </td>
      </tr>`).join("") || `<tr><td colspan="10" class="text-center text-secondary py-4">لا توجد نتائج مطابقة</td></tr>`;

    $("#prodCount").textContent = `${fmtN(list.length)} منتج`;
    $("#pageInfo").textContent = `صفحة ${fmtN(state.page)} من ${fmtN(pages)} — ${fmtN(list.length)} نتيجة`;
    const pager = $("#pager");
    pager.innerHTML = `<button ${state.page === 1 ? "disabled" : ""} data-p="${state.page - 1}"><i class="bi bi-chevron-right"></i></button>` +
      Array.from({ length: pages }, (_, i) => `<button class="${i + 1 === state.page ? "active" : ""}" data-p="${i + 1}">${fmtN(i + 1)}</button>`).join("") +
      `<button ${state.page === pages ? "disabled" : ""} data-p="${state.page + 1}"><i class="bi bi-chevron-left"></i></button>`;
  }

  /* الأحداث */
  let t;
  $("#fSearch").addEventListener("input", e => { clearTimeout(t); t = setTimeout(() => { state.q = e.target.value.trim(); state.page = 1; render(); }, 250); });
  ["fCat", "fStatus", "fMat"].forEach((id, i) => {
    const key = ["cat", "status", "material"][i];
    $("#" + id).addEventListener("change", e => { state[key] = e.target.value; state.page = 1; render(); });
  });
  $("#btnClear").addEventListener("click", () => {
    Object.assign(state, { q: "", cat: "all", status: "all", material: "all", page: 1 });
    $("#fSearch").value = ""; $("#fCat").value = "all"; $("#fStatus").value = "all"; $("#fMat").value = "all";
    render();
  });
  $("#pager").addEventListener("click", e => {
    const b = e.target.closest("button[data-p]"); if (!b || b.disabled) return;
    state.page = Number(b.dataset.p); render();
  });
  $$(".sh-table th.sortable").forEach(th => th.addEventListener("click", () => {
    const k = th.dataset.sort;
    state.dir = state.sort === k ? -state.dir : 1; state.sort = k; render();
  }));

  const modal = () => bootstrap.Modal.getOrCreateInstance($("#prodModal"));
  $("#btnAdd").addEventListener("click", () => {
    state.editing = null;
    $("#prodModalTitle").textContent = "منتج جديد";
    $("#prodForm").reset(); $("#prodForm").image.value = "assets/img/dr-1001.jpg";
    modal().show();
  });
  $("#prodBody").addEventListener("click", e => {
    const ed = e.target.closest("[data-edit]"), tg = e.target.closest("[data-toggle]"), dl = e.target.closest("[data-del]");
    if (ed) {
      const p = ADMIN_PRODUCTS.find(x => x.id === Number(ed.dataset.edit));
      state.editing = p.id;
      $("#prodModalTitle").textContent = "تعديل: " + p.code;
      const f = $("#prodForm");
      f.name.value = p.name; f.code.value = p.code; f.catId.value = p.catId; f.material.value = p.material;
      f.priceFrom.value = p.priceFrom; f.status.value = p.status; f.image.value = p.image;
      modal().show();
    }
    if (tg) {
      const p = ADMIN_PRODUCTS.find(x => x.id === Number(tg.dataset.toggle));
      p.status = p.status === "منشور" ? "مخفي" : "منشور";
      toast(`حالة «${p.code}» أصبحت: ${p.status}`, "success"); render();
    }
    if (dl) {
      const p = ADMIN_PRODUCTS.find(x => x.id === Number(dl.dataset.del));
      if (confirm(`حذف المنتج «${p.name}» (${p.code})؟ لا يمكن التراجع في العرض الفعلي بدون صلاحية مدير.`)) {
        ADMIN_PRODUCTS.splice(ADMIN_PRODUCTS.indexOf(p), 1);
        toast("تم حذف المنتج (تجريبي)", "danger"); render();
      }
    }
  });
  $("#prodForm").addEventListener("submit", e => {
    e.preventDefault();
    const f = e.target;
    let ok = true;
    [["name"], ["code"], ["priceFrom"]].forEach(([n]) => {
      const bad = !f[n].value.trim() || (n === "priceFrom" && Number(f[n].value) < 0);
      f[n].closest(".col-md-6, .col-md-4").classList.toggle("is-invalid", bad); if (bad) ok = false;
    });
    if (!ok) return;
    if (state.editing) {
      const p = ADMIN_PRODUCTS.find(x => x.id === state.editing);
      Object.assign(p, { name: f.name.value, code: f.code.value, catId: Number(f.catId.value), material: f.material.value, priceFrom: Number(f.priceFrom.value), status: f.status.value, image: f.image.value });
      toast("تم تحديث المنتج (تجريبي)", "success");
    } else {
      ADMIN_PRODUCTS.unshift({ id: Math.max(...ADMIN_PRODUCTS.map(p => p.id)) + 1, code: f.code.value, name: f.name.value, catId: Number(f.catId.value), material: f.material.value, priceFrom: Number(f.priceFrom.value), status: f.status.value, views: 0, createdAt: new Date().toISOString().slice(0, 10), image: f.image.value });
      toast("أُضيف المنتج (تجريبي)", "success");
    }
    modal().hide(); render();
  });

  render();
}

/* ============================ صفحات بسيطة: تصنيفات/عملاء/استفسارات/عروض/مستخدمون/صور/محتوى/إعدادات ============================ */

function pageCategories() {
  $("#pageContent").innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <span class="demo-tag"><i class="bi bi-database"></i> ${DEMO_LABEL}</span>
      <button class="btn-sh-gold" id="btnAddCat"><i class="bi bi-plus-lg me-1"></i> تصنيف جديد</button>
    </div>
    <div class="sh-card"><div class="sh-table-wrap"><table class="sh-table">
      <thead><tr><th>#</th><th>اسم التصنيف</th><th>الوصف</th><th>عدد المنتجات</th><th>الحالة</th><th>إجراء</th></tr></thead>
      <tbody id="catBody"></tbody></table></div></div>
    <div class="modal fade" id="catModal" tabindex="-1"><div class="modal-dialog modal-dialog-centered"><div class="modal-content" style="border-radius:16px;border:0">
      <form id="catForm"><div class="modal-header" style="border-bottom:1px solid var(--sh-line)"><h5 class="modal-title fw-bold">تصنيف جديد</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
      <div class="modal-body row g-3">
        <div class="col-12"><label class="small fw-bold mb-1">الاسم *</label><input name="name" class="form-control" required></div>
        <div class="col-12"><label class="small fw-bold mb-1">وصف</label><input name="desc" class="form-control"></div>
      </div>
      <div class="modal-footer" style="border-top:1px solid var(--sh-line)"><button type="button" class="btn-sh-ghost" data-bs-dismiss="modal">إلغاء</button><button class="btn-sh-gold">حفظ</button></div></form>
    </div></div></div>`;
  function render() {
    $("#catBody").innerHTML = CATEGORIES.map(c => `
      <tr><td class="text-secondary">${c.id}</td><td class="fw-bold">${esc(c.name)}</td>
      <td class="text-secondary">${esc(c.desc)}</td><td>${fmtN(ADMIN_PRODUCTS.filter(p => p.catId === c.id).length)}</td>
      <td>${stBadge(c.active ? "نشط" : "غير نشط")}</td>
      <td><button class="icon-act" data-tg="${c.id}" title="تبديل التفعيل"><i class="bi bi-toggle-${c.active ? "on" : "off"}"></i></button></td></tr>`).join("");
  }
  $("#btnAddCat").addEventListener("click", () => bootstrap.Modal.getOrCreateInstance($("#catModal")).show());
  $("#catForm").addEventListener("submit", e => {
    e.preventDefault();
    CATEGORIES.push({ id: Math.max(...CATEGORIES.map(c => c.id)) + 1, name: e.target.name.value, desc: e.target.desc.value, active: true, products: 0 });
    toast("أُضيف التصنيف (تجريبي)", "success"); bootstrap.Modal.getInstance($("#catModal")).hide(); render();
  });
  $("#catBody").addEventListener("click", e => {
    const b = e.target.closest("[data-tg]"); if (!b) return;
    const c = CATEGORIES.find(x => x.id === Number(b.dataset.tg)); c.active = !c.active; render();
  });
  render();
}

function pageImages() {
  $("#pageContent").innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <span class="demo-tag"><i class="bi bi-database"></i> ${DEMO_LABEL} — عند الربط: <code>POST /api/products/{id}/images</code></span>
      <button class="btn-sh-gold" id="btnUp"><i class="bi bi-cloud-arrow-up me-1"></i> رفع صور</button>
    </div>
    <div class="row g-3" id="imgGrid"></div>`;
  const render = () => $("#imgGrid").innerHTML = ADMIN_PRODUCTS.slice(0, 12).map(p => `
    <div class="col-6 col-md-4 col-xl-3">
      <div class="sh-card overflow-hidden">
        <div style="position:relative;aspect-ratio:4/3;background:var(--sh-ivory)">
          <img src="${p.image}" alt="${esc(p.name)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">
        </div>
        <div class="p-2 d-flex justify-content-between align-items-center">
          <div><span class="code-chip">${esc(p.code)}</span><div class="small mt-1">${esc(p.name)}</div></div>
          <div class="d-flex gap-1">
            <button class="icon-act" title="تعيين رئيسية"><i class="bi bi-star"></i></button>
            <button class="icon-act danger" title="حذف" onclick="toast('الحذف تجريبي — سيتم عبر API فعليًا','danger')"><i class="bi bi-trash3"></i></button>
          </div>
        </div>
      </div>
    </div>`).join("");
  $("#btnUp").addEventListener("click", () => toast("نموذج الرفع التجريبي — يُستبدل بنقطة API للصور", "gold"));
  render();
}

function pageCustomers() {
  let q = "";
  $("#pageContent").innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <span class="demo-tag"><i class="bi bi-database"></i> ${DEMO_LABEL}</span>
      <input id="cSearch" class="form-control" style="max-width:280px" placeholder="بحث بالاسم أو الجوال…">
    </div>
    <div class="sh-card"><div class="sh-table-wrap"><table class="sh-table">
      <thead><tr><th>العميل</th><th>الجوال</th><th>البريد</th><th>المدينة</th><th>الاستفسارات</th><th>تاريخ التسجيل</th><th>الحالة</th></tr></thead>
      <tbody id="cBody"></tbody></table></div></div>`;
  const render = () => {
    const list = CUSTOMERS.filter(c => !q || c.name.includes(q) || c.phone.includes(q));
    $("#cBody").innerHTML = list.map(c => `
      <tr><td class="fw-bold">${esc(c.name)}</td><td dir="ltr">${c.phone}</td><td dir="ltr" class="text-secondary">${esc(c.email)}</td>
      <td>${esc(c.city)}</td><td><span class="code-chip">${fmtN(c.inquiries)}</span></td>
      <td class="text-secondary" dir="ltr">${c.registeredAt}</td><td>${stBadge(c.status)}</td></tr>`).join("")
      || `<tr><td colspan="7" class="text-center text-secondary py-4">لا نتائج</td></tr>`;
  };
  $("#cSearch").addEventListener("input", e => { q = e.target.value.trim(); render(); });
  render();
}

function pageInquiries() {
  $("#pageContent").innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <span class="demo-tag"><i class="bi bi-database"></i> ${DEMO_LABEL}</span>
      <div class="d-flex gap-2" id="inqFilter">
        <button class="range-chip active" data-s="all">الكل</button>
        ${["جديد", "قيد المعالجة", "تم الرد", "مغلق"].map(s => `<button class="range-chip" data-s="${s}">${s}</button>`).join("")}
      </div>
    </div>
    <div class="sh-card"><div class="sh-table-wrap"><table class="sh-table">
      <thead><tr><th>العميل</th><th>الموضوع</th><th>المنتج</th><th>القناة</th><th>الأولوية</th><th>التاريخ</th><th>الحالة</th><th>إجراء</th></tr></thead>
      <tbody id="iqBody"></tbody></table></div></div>`;
  let f = "all";
  const render = () => {
    const list = INQUIRIES.filter(i => f === "all" || i.status === f);
    $("#iqBody").innerHTML = list.map(i => `
      <tr><td class="fw-bold">${esc(i.customer)}</td><td>${esc(i.subject)}</td>
      <td><span class="code-chip">${esc(i.product)}</span></td><td class="text-secondary">${esc(i.channel)}</td>
      <td>${stBadge(i.priority)}</td><td class="text-secondary" dir="ltr">${i.date}</td><td>${stBadge(i.status)}</td>
      <td><button class="icon-act" data-next="${i.id}" title="تغيير الحالة"><i class="bi bi-arrow-repeat"></i></button></td></tr>`).join("");
  };
  $("#inqFilter").addEventListener("click", e => {
    const b = e.target.closest(".range-chip"); if (!b) return;
    $$("#inqFilter .range-chip").forEach(x => x.classList.remove("active")); b.classList.add("active");
    f = b.dataset.s; render();
  });
  $("#iqBody").addEventListener("click", e => {
    const b = e.target.closest("[data-next]"); if (!b) return;
    const i = INQUIRIES.find(x => x.id === Number(b.dataset.next));
    const flow = ["جديد", "قيد المعالجة", "تم الرد", "مغلق"];
    i.status = flow[(flow.indexOf(i.status) + 1) % flow.length];
    toast("الحالة: " + i.status, "success"); render();
  });
  render();
}

function pageQuotations() {
  const sent = QUOTES.filter(q => q.status === "مرسلة").length;
  const acc = QUOTES.filter(q => q.status === "مقبولة").length;
  $("#pageContent").innerHTML = `
    <div class="row g-3 mb-3">
      <div class="col-6 col-md-3"><div class="kpi-card"><span class="kpi-title">إجمالي العروض</span><div class="kpi-value">${fmtN(QUOTES.length)}</div></div></div>
      <div class="col-6 col-md-3"><div class="kpi-card"><span class="kpi-title">مرسلة</span><div class="kpi-value">${fmtN(sent)}</div></div></div>
      <div class="col-6 col-md-3"><div class="kpi-card"><span class="kpi-title">مقبولة</span><div class="kpi-value">${fmtN(acc)}</div></div></div>
      <div class="col-6 col-md-3"><div class="kpi-card"><span class="kpi-title">معدل القبول</span><div class="kpi-value">${Math.round(acc / QUOTES.length * 100)}٪</div><span class="kpi-note">بيانات تجريبية</span></div></div>
    </div>
    <div class="sh-card"><div class="card-head"><h6>سجل عروض الأسعار</h6><span class="demo-tag"><i class="bi bi-database"></i> ${DEMO_LABEL}</span></div>
    <div class="sh-table-wrap"><table class="sh-table">
      <thead><tr><th>الكود</th><th>العميل</th><th>المحتوى</th><th>القيمة</th><th>الحالة</th><th>التاريخ</th><th>صالحة حتى</th></tr></thead>
      <tbody id="qBody"></tbody></table></div></div>`;
  $("#qBody").innerHTML = QUOTES.map(q => `
    <tr><td><span class="code-chip">${q.code}</span></td><td class="fw-bold">${esc(q.customer)}</td>
    <td class="text-secondary">${esc(q.items)}</td><td class="fw-bold" style="color:#9A742B">${fmtEGP(q.total)}</td>
    <td>${stBadge(q.status)}</td><td class="text-secondary" dir="ltr">${q.date}</td><td class="text-secondary" dir="ltr">${q.validUntil}</td></tr>`).join("");
}

function pageUsers(session) {
  const canManage = session.role === "مدير النظام";
  $("#pageContent").innerHTML = `
    <div class="sh-card mb-3" style="border-inline-start:3px solid var(--sh-warning)">
      <div class="card-body-p d-flex gap-2 align-items-start">
        <i class="bi bi-shield-exclamation text-warning mt-1"></i>
        <div class="small text-secondary"><b>ملاحظة صلاحيات:</b>
          إنشاء حسابات الموظفين والمديرين يتم حصريًا من هنا بواسطة مدير النظام — ولا يمكن لأي زائر من نموذج التسجيل العام الحصول على صلاحيات إدارية.
          عند الربط: <code>POST /api/identity/users</code> تتطلب الدور <code>Admin</code> فقط.</div>
      </div>
    </div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <span class="demo-tag"><i class="bi bi-database"></i> ${DEMO_LABEL}</span>
      <button class="btn-sh-gold ${canManage ? "" : "disabled"}" id="btnAddUser"><i class="bi bi-person-plus me-1"></i> إضافة مستخدم</button>
    </div>
    <div class="sh-card"><div class="sh-table-wrap"><table class="sh-table">
      <thead><tr><th>المستخدم</th><th>البريد</th><th>الدور</th><th>آخر دخول</th><th>الحالة</th><th>إجراء</th></tr></thead>
      <tbody id="uBody"></tbody></table></div></div>
    <div class="modal fade" id="userModal" tabindex="-1"><div class="modal-dialog modal-dialog-centered"><div class="modal-content" style="border-radius:16px;border:0">
      <form id="userForm"><div class="modal-header" style="border-bottom:1px solid var(--sh-line)"><h5 class="modal-title fw-bold">إضافة مستخدم إداري</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
      <div class="modal-body row g-3">
        <div class="col-12"><label class="small fw-bold mb-1">الاسم الكامل *</label><input name="name" class="form-control" required></div>
        <div class="col-md-6"><label class="small fw-bold mb-1">البريد *</label><input name="email" type="email" class="form-control" required></div>
        <div class="col-md-6"><label class="small fw-bold mb-1">الدور *</label>
          <select name="role" class="form-select">${["مدير النظام", "موظف مبيعات", "محرر محتوى"].map(r => `<option>${r}</option>`).join("")}</select></div>
        <div class="col-12 small text-secondary"><i class="bi bi-key me-1"></i>ستُرسل دعوة لتعيين كلمة المرور عبر البريد (Identity — Invite flow).</div>
      </div>
      <div class="modal-footer" style="border-top:1px solid var(--sh-line)"><button type="button" class="btn-sh-ghost" data-bs-dismiss="modal">إلغاء</button><button class="btn-sh-gold">إرسال الدعوة</button></div></form>
    </div></div></div>`;
  const render = () => {
    $("#uBody").innerHTML = USERS.map(u => `
      <tr><td class="fw-bold">${esc(u.name)}</td><td dir="ltr" class="text-secondary">${esc(u.email)}</td>
      <td>${stBadge(u.role === "مدير النظام" ? "مرسلة" : u.role === "عميل" ? "عادية" : "قيد المعالجة")} <span class="small">${u.role}</span></td>
      <td class="text-secondary" dir="ltr">${u.lastLogin}</td><td>${stBadge(u.status)}</td>
      <td>${u.role !== "مدير النظام" ? `<button class="icon-act" data-tg="${u.id}" title="تبديل الحالة"><i class="bi bi-toggle-${u.status === "نشط" ? "on" : "off"}"></i></button>` : `<span class="text-secondary small">محمي</span>`}</td></tr>`).join("");
  };
  if (canManage) {
    $("#btnAddUser").addEventListener("click", () => bootstrap.Modal.getOrCreateInstance($("#userModal")).show());
    $("#userForm").addEventListener("submit", e => {
      e.preventDefault();
      USERS.push({ id: USERS.length + 1, name: e.target.name.value, email: e.target.email.value, role: e.target.role.value, status: "نشط", lastLogin: "—" });
      toast("أُرسلت دعوة المستخدم (تجريبي)", "success"); bootstrap.Modal.getInstance($("#userModal")).hide(); render();
    });
    $("#uBody").addEventListener("click", e => {
      const b = e.target.closest("[data-tg]"); if (!b) return;
      const u = USERS.find(x => x.id === Number(b.dataset.tg)); u.status = u.status === "نشط" ? "موقوف" : "نشط"; render();
    });
  }
  render();
}

function pageContent(session) {
  $("#pageContent").innerHTML = `
    <div class="row g-3">
      <div class="col-lg-8"><div class="sh-card"><div class="card-head"><h6>محتوى الصفحة الرئيسية</h6><span class="demo-tag"><i class="bi bi-database"></i> ${DEMO_LABEL}</span></div>
        <div class="card-body-p row g-3">
          <div class="col-12"><label class="small fw-bold mb-1">شعار الموقع (Slogan)</label><input class="form-control" value="الجودة والأمان يبدأان من هنا"></div>
          <div class="col-12"><label class="small fw-bold mb-1">نص الترحيب في السلايدر</label><textarea class="form-control" rows="2">أبواب مصفحة تركية ومطابخ فاخرة — صناعة تليق ببيتك</textarea></div>
          <div class="col-md-6"><label class="small fw-bold mb-1">رقم التواصل</label><input class="form-control" dir="ltr" value="01099999999"></div>
          <div class="col-md-6"><label class="small fw-bold mb-1">البريد الرسمي</label><input class="form-control" dir="ltr" value="info@smarthouse.sa"></div>
          <div class="col-12 text-end"><button class="btn-sh-gold" id="saveContent"><i class="bi bi-check2 me-1"></i> حفظ التغييرات</button></div>
        </div></div></div>
      <div class="col-lg-4"><div class="sh-card"><div class="card-head"><h6>بنود سريعة</h6></div>
        <div class="card-body-p">
          ${["بانرات السلايدر (3)", "قسم الخامات والتشطيبات", "قصص العملاء", "شريط الإحصائيات", "الأسئلة الشائعة"].map((x, i) => `
          <div class="d-flex justify-content-between align-items-center py-2" style="border-bottom:1px solid #F1EEE7">
            <span class="small fw-bold">${x}</span><span class="st ${i < 2 ? "st-green" : "st-gold"}">${i < 2 ? "منشور" : "مسودة"}</span>
          </div>`).join("")}
        </div></div></div>
    </div>`;
  $("#saveContent").addEventListener("click", () => toast("حُفظ (تجريبي) — فعليًا: PUT /api/content", "success"));
}

function pageSettings(session) {
  $("#pageContent").innerHTML = `
    <div class="row g-3">
      <div class="col-lg-6"><div class="sh-card h-100"><div class="card-head"><h6>بيانات المعرض</h6></div>
        <div class="card-body-p row g-3">
          <div class="col-12"><label class="small fw-bold mb-1">اسم المعرض</label><input class="form-control" value="سمارت هاوس — SMART HOUSE"></div>
          <div class="col-12"><label class="small fw-bold mb-1">العنوان</label><input class="form-control" value="كورنيش المرشحة بجوار صيدلية الطرشوبي"></div>
          <div class="col-md-6"><label class="small fw-bold mb-1">السجل التجاري</label><input class="form-control" dir="ltr" value="4030-XXXXXX"></div>
          <div class="col-md-6"><label class="small fw-bold mb-1">الرقم الضريبي</label><input class="form-control" dir="ltr" value="3XXXXXXXXXXXXX3"></div>
          <div class="col-12 text-end"><button class="btn-sh-gold" onclick="toast('حُفظ (تجريبي)','success')"><i class="bi bi-check2 me-1"></i> حفظ</button></div>
        </div></div></div>
      <div class="col-lg-6"><div class="sh-card h-100"><div class="card-head"><h6>تفعيل الوحدات</h6></div>
        <div class="card-body-p">
          ${[["إدارة الطلبات", false], ["التسجيل العام للعملاء", true], ["عرض الأسعار «يبدأ من» للزوار", true], ["الدفع الإلكتروني", false]].map(([t, on]) => `
          <div class="d-flex justify-content-between align-items-center py-2" style="border-bottom:1px solid #F1EEE7">
            <span class="small fw-bold">${t}</span>
            <div class="form-check form-switch mb-0"><input class="form-check-input" type="checkbox" ${on ? "checked" : ""} style="width:2.4em;height:1.2em"></div>
          </div>`).join("")}
          <div class="small text-secondary mt-3"><i class="bi bi-info-circle me-1"></i>التغييرات تُطبق فور الحفظ عند الربط الفعلي.</div>
        </div></div></div>
    </div>`;
}

function pageReports() {
  $("#pageContent").innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <span class="demo-tag"><i class="bi bi-database"></i> ${DEMO_LABEL} — التقارير تُبنى فعليًا من SQL Server</span>
      <button class="btn-sh-ghost no-print" id="btnPrint"><i class="bi bi-printer me-1"></i> طباعة</button>
    </div>
    <div class="row g-3">
      <div class="col-xl-6"><div class="sh-card"><div class="card-head"><h6>التصنيفات الأكثر طلبًا في الاستفسارات</h6></div>
        <div class="card-body-p chart-box chart-h-fixed"><canvas id="rCat"></canvas></div></div></div>
      <div class="col-xl-6"><div class="sh-card"><div class="card-head"><h6>العروض: أُنشئت مقابل قُبلت (شهريًا)</h6></div>
        <div class="card-body-p chart-box chart-h-fixed"><canvas id="rMonthly"></canvas></div></div></div>
      <div class="col-12"><div class="sh-card"><div class="card-head"><h6>ملخص تنفيذي</h6></div>
        <div class="card-body-p row g-3" id="rSummary"></div></div></div>
    </div>`;
  chartDefaults();
  const rnd = seeded(99);
  const months = ["ينا", "فبر", "مار", "أبر", "ماي", "يون", "يول", "أغس", "سبت", "أكت"];

  new Chart($("#rCat"), {
    type: "bar",
    data: {
      labels: CATEGORIES.map(c => c.name),
      datasets: [{ label: "عدد الاستفسارات", data: CATEGORIES.map(() => 4 + Math.round(rnd() * 26)), backgroundColor: [GOLD, CHARCOAL, GRAY, GREEN, BLUE], borderRadius: 7, maxBarThickness: 34 }]
    },
    options: { scales: { y: { beginAtZero: true }, x: { grid: { display: false }, ticks: { font: { size: 10 } } } }, plugins: { legend: { display: false } } }
  });

  new Chart($("#rMonthly"), {
    type: "bar",
    data: {
      labels: months,
      datasets: [
        { label: "عروض أُنشئت", data: months.map(() => 4 + Math.round(rnd() * 10)), backgroundColor: GRAY, borderRadius: 6, maxBarThickness: 16 },
        { label: "عروض قُبلت", data: months.map(() => 1 + Math.round(rnd() * 5)), backgroundColor: GOLD, borderRadius: 6, maxBarThickness: 16 }
      ]
    },
    options: { scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }, plugins: { legend: { position: "bottom" } } }
  });

  const acc = QUOTES.filter(q => q.status === "مقبولة").reduce((s, q) => s + q.total, 0);
  $("#rSummary").innerHTML = [
    ["إجمالي الاستفسارات", fmtN(INQUIRIES.length), "bi-chat-dots", ""],
    ["إجمالي العروض", fmtN(QUOTES.length), "bi-file-earmark-text", ""],
    ["عروض مقبولة", fmtN(QUOTES.filter(q => q.status === "مقبولة").length), "bi-check2-circle", "green"],
    ["قيمة العروض المقبولة", fmtEGP(acc) + " (تجريبي)", "bi-graph-up", "blue"]
  ].map(([t, v, ic, cls]) => `
    <div class="col-6 col-md-3"><div class="kpi-card">
      <div class="kpi-top"><span class="kpi-title">${t}</span><span class="kpi-icon ${cls}"><i class="bi ${ic}"></i></span></div>
      <div class="kpi-value" style="font-size:1.15rem">${v}</div></div></div>`).join("");

  $("#btnPrint").addEventListener("click", () => window.print());
}

/* ============================ صفحات المصادقة ============================ */
function authLogin() {
  const f = $("#loginForm"), pw = $("#pw"), err = $("#authErr"), btn = $("#btnLogin");
  $("#pwToggle").addEventListener("click", () => {
    const show = pw.type === "password";
    pw.type = show ? "text" : "password";
    $("#pwToggle i").className = "bi " + (show ? "bi-eye-slash" : "bi-eye");
  });
  f.addEventListener("submit", e => {
    e.preventDefault();
    err.classList.remove("show");
    const em = $("#email"), ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim());
    em.closest(".auth-field").classList.toggle("is-invalid", !ok);
    const pwOk = pw.value.length >= 6;
    pw.closest(".auth-field").classList.toggle("is-invalid", !pwOk);
    if (!ok || !pwOk) { $("#authErrTxt").textContent = "تحقق من البريد وكلمة المرور (6 أحرف على الأقل)"; err.classList.add("show"); return; }
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-sm" role="status"></span> جارٍ الدخول…`;
    /* فعليًا: POST /api/auth/login → { token, roles } */
    setTimeout(() => {
      setSession({ name: "أحمد المدير", email: em.value.trim(), role: "مدير النظام", loginAt: Date.now() });
      toast("مرحبًا بك مجددًا!", "success");
      setTimeout(() => location.href = "admin.html", 500);
    }, 900);
  });
}

function authRegister() {
  const f = $("#regForm"), meter = $("#pwMeter"), pwTxt = $("#pwTxt"), pw = $("#pw"), pw2 = $("#pw2");
  $("#pwToggle").addEventListener("click", () => {
    const show = pw.type === "password";
    pw.type = show ? "text" : "password";
    $("#pwToggle i").className = "bi " + (show ? "bi-eye-slash" : "bi-eye");
  });
  function strength(v) {
    let s = 0;
    if (v.length >= 6) s++; if (v.length >= 10) s++;
    if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++;
    if (/\d/.test(v) && /[^A-Za-z0-9]/.test(v)) s++;
    return Math.min(4, s);
  }
  pw.addEventListener("input", () => {
    const s = strength(pw.value);
    meter.className = "pw-meter" + (s ? " s" + s : "");
    pwTxt.textContent = ["أدخل كلمة المرور", "ضعيفة", "متوسطة", "جيدة", "قوية"][s];
  });
  f.addEventListener("submit", e => {
    e.preventDefault();
    let ok = true;
    f.querySelectorAll("[required]").forEach(el => {
      if (el.type === "checkbox") return; /* السياسات تُفحص منفصلة أدناه */
      let bad = !el.value.trim();
      if (el.name === "email" && el.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) bad = true;
      if (el.name === "phone" && el.value && !/^05\d{8}$/.test(el.value)) { bad = true; el.closest(".auth-field").querySelector(".field-error").textContent = "رقم جوال سعودي: 05XXXXXXXX"; }
      else if (el.name === "phone") el.closest(".auth-field").querySelector(".field-error").textContent = "الجوال مطلوب";
      el.closest(".auth-field").classList.toggle("is-invalid", bad);
      if (bad) ok = false;
    });
    if (pw2.value !== pw.value) { pw2.closest(".auth-field").classList.add("is-invalid"); ok = false; }
    if (!f.terms.checked) { $("#authErrTxt").textContent = "يجب الموافقة على الشروط والأحكام"; $("#authErr").classList.add("show"); ok = false; }
    if (!ok) return;
    const btn = $("#btnReg");
    btn.disabled = true; btn.innerHTML = `<span class="spinner-border spinner-sm"></span> جارٍ الإنشاء…`;
    /* فعليًا: POST /api/auth/register — الدور يُعيَّن "Customer" من الخادم دائمًا */
    setTimeout(() => {
      $("#authErr").classList.add("success", "show");
      $("#authErrTxt").textContent = "تم إنشاء حسابك بنجاح! سيتم تحويلك لتسجيل الدخول…";
      setSession({ name: f.name.value, email: f.email.value, role: "عميل", loginAt: Date.now() });
      setTimeout(() => location.href = "access-denied.html?welcome=1", 1400);
    }, 900);
  });
  [pw, pw2].forEach(el => el.addEventListener("input", () => {
    if (pw2.value === pw.value) pw2.closest(".auth-field").classList.remove("is-invalid");
  }));
}

function authForgot() {
  $("#fpForm").addEventListener("submit", e => {
    e.preventDefault();
    const em = $("#email"), ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim());
    em.closest(".auth-field").classList.toggle("is-invalid", !ok);
    if (!ok) return;
    $("#fpForm").classList.add("d-none");
    /* فعليًا: POST /api/auth/forgot-password — الرد دائمًا 200 بلا كشف وجود البريد */
    $("#fpDone").classList.remove("d-none");
  });
}

function authDenied() {
  const s = getSession();
  const isStaff = s && (s.role === "مدير النظام" || s.role === "موظف مبيعات" || s.role === "محرر محتوى");
  $("#btnDeniedBack").textContent = isStaff ? "العودة للوحة الإدارة" : "العودة للرئيسية";
  $("#btnDeniedBack").href = isStaff ? "admin.html" : "index.html";
}

/* ============================ الإقلاع ============================ */
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  const authPages = ["login", "register", "forgot", "denied"];

  if (!authPages.includes(page)) {
    const s = guardAdmin(); if (!s) return;
    const titles = {
      dashboard: ["لوحة المعلومات", []], products: ["إدارة المنتجات", ["المنتجات"]],
      categories: ["التصنيفات", ["المنتجات", "التصنيفات"]], images: ["صور المنتجات", ["المنتجات", "الصور"]],
      customers: ["العملاء", ["العملاء"]], inquiries: ["استفسارات العملاء", ["الاستفسارات"]],
      quotations: ["عروض الأسعار", ["عروض الأسعار"]], reports: ["التقارير والإحصائيات", ["التقارير"]],
      users: ["المستخدمون والصلاحيات", ["النظام", "المستخدمون"]], content: ["محتوى الموقع", ["النظام", "المحتوى"]],
      settings: ["الإعدادات", ["النظام", "الإعدادات"]]
    };
    const [title, crumbs] = titles[page] || ["لوحة الإدارة", []];
    buildShell(s, page, title, crumbs);
    ({ dashboard: pageDashboard, products: pageProducts, categories: pageCategories, images: pageImages,
       customers: pageCustomers, inquiries: pageInquiries, quotations: pageQuotations,
       reports: pageReports, users: pageUsers, content: pageContent, settings: pageSettings }[page] || (() => {}))(s);
  } else {
    ({ login: authLogin, register: authRegister, forgot: authForgot, denied: authDenied }[page])();
  }
});
