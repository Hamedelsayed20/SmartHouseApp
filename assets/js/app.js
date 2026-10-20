/*
====================================================================
  سمارت هوس — منطق التطبيق المشترك بين الصفحات
  ------------------------------------------------------------------
  - توليد بطاقات منتجات ونوافذ المعاينة السريعة
  - ميزة "قارن الأنماط" (حتى 3 منتجات يتزامن)
  - أدوات مشتركة (تنسيق الأسعار، ظهور تدريجي، ترويسة ثابتة)

  عند الانتقال لاستخدام Angular لاحقًا: هذا الملف يُستبدل بمكوّنات
  ProductCard / QuickView / CompareBar، والبيانات تأتي من خدمة API.
====================================================================
*/

/* ============================ أدوات مساعدة ============================ */

const CURRENCY = "ج.م";

function formatPrice(n) {
  return new Intl.NumberFormat("ar-EG").format(n);
}

function bhd(cls) {
  return `
  <svg viewBox="0 0 260 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="معاينة نمط">
    <defs>
      <linearGradient id="wg${cls}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${cls}" />
        <stop offset=".55" stop-color="${cls}" stop-opacity=".75" />
        <stop offset="1" stop-color="#141210" />
      </linearGradient>
    </defs>
    <rect width="260" height="200" fill="url(#wg${cls})" />
    <g stroke="rgba(0,0,0,.28)" stroke-width="1">
      <line x1="0" y1="40" x2="260" y2="34" />
      <line x1="0" y1="80" x2="260" y2="72" />
      <line x1="0" y1="120" x2="260" y2="112" />
      <line x1="0" y1="160" x2="260" y2="152" />
    </g>
    <rect x="14" y="14" width="232" height="172" fill="none" stroke="#e6c65c" stroke-opacity=".55" stroke-width="2" />
    <circle cx="222" cy="104" r="7" fill="#e6c65c" fill-opacity=".85" />
  </svg>`;
}

function placeholder(p) {
  /* صورة المنتج (URL) من الكتالوج — عند الربط مع SQL Server تأتي من عمود ImageUrl.
     إن غابت الصورة، يعاد SVG توليدي بألوان الخامة. */
  if (p && p.image) return p.image;
  return "data:image/svg+xml;utf8," + encodeURIComponent(bhd(p.tone || "#8a5a2b"));
}

/* خاصية onerror الجاهزة لأي <img> لمنتج — تسقط إلى SVG عند فشل التحميل */
function imgFallback(p) {
  const fallback = "data:image/svg+xml;utf8," + encodeURIComponent(bhd(p.tone || "#8a5a2b"));
  return ` onerror="this.onerror=null;this.src='${fallback}'"`;
}

window.addEventListener("DOMContentLoaded", () => {
  revealInit();
  headerInit();
});

/* ============================ الترويسة ============================ */

function headerInit() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ============================ ظهور تدريجي ============================ */

function revealInit() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || els.length === 0) {
    els.forEach((el) => el.classList.add("visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    }),
    { threshold: 0.12 }
  );
  els.forEach((el) => io.observe(el));
}

/* ============================ رابط المستخدم من الفوتر ============================ */

function renderProductCard(p) {
  const stars = ratingStars(p.rating);
  const badge = p.badge
    ? `<span class="badge badge-gold rounded-pill position-absolute top-0 end-0 m-2 z-3">${p.badge}</span>`
    : "";
  return `
  <article class="product-card col-6 col-md-3 reveal" data-id="${p.id}">
    <div class="card-media">
      ${badge}
      <img src="${placeholder(p)}" ${imgFallback(p)} alt="${p.name}" loading="lazy" />
      <div class="media-actions">
        <button class="icon-btn js-compare" title="أضِف للمقارنة" aria-pressed="false">
          <i class="bi bi-layers"></i>
        </button>
        <button class="icon-btn js-fav" title="المفضلة"><i class="bi bi-heart"></i></button>
        <button class="icon-btn js-add-cart" data-id="${p.id}" title="أضِف للسلة"><i class="bi bi-bag"></i></button>
      </div>
    </div>
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="badge badge-soft rounded-pill">${p.category === "doors" ? "أبواب" : "مطابخ"}</span>
        <span class="small text-muted-2"><i class="bi bi-star-fill text-gold"></i> ${p.rating}</span>
      </div>
      <h3 class="card-title">${p.name}</h3>
      <p class="spec-line"><i class="bi bi-collection me-1 text-gold"></i>${p.material}</p>
      <p class="spec-line"><i class="bi bi-droplet me-1 text-gold"></i>${p.finish}</p>
      <div class="price-from d-flex justify-content-between align-items-end">
        <div>
          <div class="small text-muted-2">يبدأ من</div>
          <div class="val">${formatPrice(p.priceFrom)} <span class="small">${CURRENCY}</span></div>
        </div>
        <a href="product.html?id=${p.id}" class="btn btn-sm btn-outline-gold">
          العرض الكامل <i class="bi bi-arrow-left"></i>
        </a>
      </div>
      <button class="btn btn-gold btn-sm w-100 mt-3 js-add-cart" data-id="${p.id}" data-qty="1"
        aria-label="إضافة ${p.name} إلى سلة المشتريات">
        <i class="bi bi-cart-plus me-1"></i> إضافة إلى سلة المشتريات
      </button>
    </div>
  </article>`;
}

function ratingStars(r) {
  const full = Math.floor(r);
  return Array.from({ length: 5 }, (_, i) =>
    `<i class="bi ${i < full ? "bi-star-fill" : "bi-star"} text-gold"></i>`).join("");
}

/* ============================ المعاينة السريعة ============================ */

function openQuickView(p) {
  window.open(`product.html?id=${p.id}`, "_self");
}

/* ============================ لوحة المقارنة ============================ */

const COMPARE_LIMIT = 3;
const compareSet = new Set([]);

function compareBarInit() {
  const bar = ensureCompareBar();
  if (!bar) return;
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".js-compare");
    if (!btn) return;
    const card = btn.closest("[data-id]");
    const id = Number(card.dataset.id);
    if (compareSet.has(id)) {
      compareSet.delete(id);
      btn.classList.remove("active");
      btn.setAttribute("aria-pressed", "false");
    } else {
      if (compareSet.size >= COMPARE_LIMIT) {
        showCompareToast(`للمقارنة الأمثل، أضِف حتى ${COMPARE_LIMIT} أنماط فقط`);
        return;
      }
      compareSet.add(id);
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
    }
    refreshCompareBar();
    e.stopPropagation();
  });
}

function ensureCompareBar() {
  if (document.getElementById("compareBar")) return document.getElementById("compareBar");
  const bar = document.createElement("div");
  bar.id = "compareBar";
  bar.className = "compare-bar";
  bar.innerHTML = `
    <div class="d-flex align-items-center gap-3 flex-grow-1">
      <strong class="text-gold d-none d-md-inline"><i class="bi bi-layers me-1"></i>قارن الأنماط</strong>
      <div id="compareItems" class="d-flex align-items-center gap-2 flex-wrap"></div>
    </div>
    <div class="d-flex gap-2">
      <button class="btn btn-sm btn-outline-gold" id="compareClear">تصفير</button>
      <button class="btn btn-sm btn-gold" id="compareOpen">قارن الآن <i class="bi bi-arrow-left"></i></button>
    </div>`;
  document.body.appendChild(bar);

  bar.querySelector("#compareOpen").addEventListener("click", openCompareModal);
  bar.querySelector("#compareClear").addEventListener("click", () => {
    compareSet.clear();
    document.querySelectorAll(".js-compare.active").forEach((b) => b.classList.remove("active"));
    refreshCompareBar();
  });

  /* التنبيه الشعوبي */
  let toast, timeout;
  const toastEl = document.createElement("div");
  toastEl.style.cssText = "display:none;position:fixed;bottom:5rem;inset-inline-start:50%;transform:translateX(50%);" +
    "background:#e6c65c;color:#1b1409;font-weight:700;padding:.5rem 1rem;border-radius:999px;z-index:2000;";
  document.body.appendChild(toastEl);
  window.showCompareToast = (msg) => {
    toastEl.textContent = msg;
    toastEl.style.display = "block";
    clearTimeout(timeout);
    timeout = setTimeout(() => (toastEl.style.display = "none"), 2200);
  };
  return bar;
}

function refreshCompareBar() {
  const bar = document.getElementById("compareBar");
  const items = bar.querySelector("#compareItems");
  const list = PRODUCTS.filter((p) => compareSet.has(p.id));
  items.innerHTML = list
    .map(
      (p) => `
      <span class="compare-item">
        <img src="${placeholder(p)}" alt="" />
        <span class="d-none d-sm-inline">${p.name.split("—")[0].trim()}</span>
        <button class="icon-btn js-remove-compare" data-id="${p.id}" style="width:22px;height:22px;font-size:.7rem">
          <i class="bi bi-x"></i>
        </button>
      </span>`
    )
    .join("");
  bar.classList.toggle("show", list.length > 0);

  items.querySelectorAll(".js-remove-compare").forEach((b) =>
    b.addEventListener("click", () => {
      const id = Number(b.dataset.id);
      compareSet.delete(id);
      const btn = document.querySelector(`[data-id="${id}"] .js-compare`);
      if (btn) btn.classList.remove("active");
      refreshCompareBar();
    })
  );
}

function openCompareModal() {
  const list = PRODUCTS.filter((p) => compareSet.has(p.id));
  if (list.length === 0) return;

  const rows = [
    ["الفئة", (p) => (p.category === "doors" ? "أبواب" : "مطابخ")],
    ["الطراز", "style"],
    ["الخامة", "material"],
    ["التشطيب", "finish"],
    ["القياس المتاح", "dimensionsRange"],
    ["الألوان", "colorsText"],
    ["رمز المنتج", "sku"]
  ];

  const tableRows = rows
    .map(([label, key]) => `
      <tr>
        <th class="text-nowrap ps-2">${label}</th>
        ${list.map((p) => `<td>${typeof key === "function" ? key(p) : p[key]}</td>`).join("")}
      </tr>`)
    .join("");

  const featuresRow = `<tr>
      <th class="text-nowrap ps-2">أبرز المميزات</th>
      ${list.map((p) => `<td><ul class="feature-list list-unstyled mb-0">${p.features.slice(0, 3).map((f) => `<li><i class="bi bi-check2"></i><span>${f}</span></li>`).join("")}</ul></td>`).join("")}
    </tr>`;

  const priceRow = `<tr class="align-middle">
      <th class="text-nowrap ps-2">السعر يبدأ من</th>
      ${list.map((p) => `<td><strong class="text-gold fs-5">${formatPrice(p.priceFrom)} ${CURRENCY}</strong></td>`).join("")}
    </tr>`;

  const actionsRow = `<tr class="align-middle">
      <th class="text-nowrap ps-2"></th>
      ${list.map((p) => `<td><a class="btn btn-sm btn-gold" href="product.html?id=${p.id}">العرض الكامل</a></td>`).join("")}
    </tr>`;

  modal(`مقارنة الأنماط: تظهر الفروقات بين ${list.length} منتجات جنبًا إلى جنب`, `
    <div class="table-responsive">
      <table class="table table-bordered align-middle m-0" style="border-color:var(--line);min-width:640px">
        <thead>
          <tr>
            <th style="width:130px"></th>
            ${list.map((p) => `<th class="text-center" style="width:${Math.floor(100 / list.length)}%;border-top:none">
              <img src="${placeholder(p)}" alt="" style="width:100%;max-height:120px;object-fit:cover;border-radius:9px" class="mb-2" />
              <div class="small">${p.name}</div>
            </th>`).join("")}
          </tr>
        </thead>
        <tbody>${tableRows}${featuresRow}${priceRow}${actionsRow}</tbody>
      </table>
    </div>`);
}

/* ============================ نافذة عامة ============================ */

function modal(title, bodyHtml, footerHtml) {
  let wrap = document.getElementById("appModal");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.id = "appModal";
    wrap.innerHTML = `
      <div class="modal fade" id="appModalInner" tabindex="-1"
        style="color:var(--ink)">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title js-title"></h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="إغلاق"></button>
            </div>
            <div class="modal-body js-body"></div>
            <div class="modal-footer js-footer border-0 pt-0"></div>
          </div>
        </div>
      </div>`;
    document.body.appendChild(wrap);
  }
  wrap.querySelector(".js-title").innerHTML = title;
  wrap.querySelector(".js-body").innerHTML = bodyHtml;
  wrap.querySelector(".js-footer").innerHTML = footerHtml || "";
  const bs = bootstrap.Modal.getOrCreateInstance(wrap.querySelector("#appModalInner"));
  bs.show();
  return bs;
}

/* منطق التصنيف: دالة مساعدة لتصفية السلة */

window.snapshotAppState = () => ({ compare: [...compareSet], currency: CURRENCY });

/* ============================================================================
   سلة المشتريات وطلبات العملاء (محاكاة واجهة — عند الربط الفعلي):
   POST   /api/cart              → تعديل السلة (أو تُدار محليًا مع JWT)
   POST   /api/orders            → إنشاء طلب من السلة
   POST   /api/payments/create   → تهيئة عملية الدفع (بوابة محلية: مدى/Apple Pay)
   GET    /api/orders/my         → طلباتي
   التخزين هنا: localStorage (sh_cart / sh_orders) — بيانات عرض فقط.
   ============================================================================ */

const CART_KEY = "sh_cart";
const ORDERS_KEY = "sh_orders";

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; }
}

function saveCart(list) {
  localStorage.setItem(CART_KEY, JSON.stringify(list.filter(i => i.qty > 0)));
  syncCartBadge();
}

function addToCart(id, qty = 1) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) item.qty = Math.min(99, item.qty + qty);
  else cart.push({ id, qty });
  saveCart(cart);
  if (window.showCompareToast) showCompareToast("أُضيف إلى السلة 🛒");
}

function changeCartQty(id, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.max(0, Math.min(99, qty));
  if (item.qty === 0) {
    cart.splice(cart.indexOf(item), 1);
  }
  saveCart(cart);
}

function removeFromCart(id) {
  saveCart(getCart().filter(i => i.id !== id));
}

function cartCount() {
  return getCart().reduce((s, i) => s + i.qty, 0);
}

function cartTotal() {
  return getCart().reduce((s, i) => {
    const p = PRODUCTS.find(x => x.id === i.id);
    return p ? s + p.priceFrom * i.qty : s;
  }, 0);
}

function syncCartBadge() {
  const n = cartCount();
  document.querySelectorAll(".cart-badge").forEach(b => {
    if (b.textContent !== String(n)) {
      b.textContent = n;
      b.classList.remove("bump");
      void b.offsetWidth; /* إعادة تشغيل الحركة */
      b.classList.add("bump");
    }
    b.classList.toggle("d-none", n === 0);
  });
}

function getOrders() {
  try { return JSON.parse(localStorage.getItem(ORDERS_KEY)) || []; } catch { return []; }
}

function saveOrders(list) { localStorage.setItem(ORDERS_KEY, JSON.stringify(list)); }

/* بيانات عرض أولية لطلبات العميل (تُستبدل بـ GET /api/orders/my فعليًا) */
function seedDemoOrders() {
  if (localStorage.getItem(ORDERS_KEY)) return;
  const today = new Date().toISOString().slice(0, 10);
  const shift = d => new Date(Date.now() - d * 864e5).toISOString().slice(0, 10);
  saveOrders([
    { id: "ORD-2026-1041", date: shift(12), items: [{ id: 1, qty: 2 }, { id: 12, qty: 1 }], total: 4950,
      payment: "بطاقة Visa/Mastercard", city: "طنطا", status: "تم التسليم", note: "تركيب يوم الخميس" },
    { id: "ORD-2026-1057", date: shift(4), items: [{ id: 4, qty: 3 }], total: 4350,
      payment: "تقسيط valU", city: "المحلة الكبرى", status: "قيد التنفيذ", note: "" },
    { id: "ORD-2026-1063", date: today, items: [{ id: 6, qty: 1 }], total: 890,
      payment: "نقدًا عند الاستلام", city: "—", status: "بانتظار الدفع", note: "استفسار عن تركيب سريع" }
  ]);
}

/* إضافة للسلة من أي بطاقة/زر (تفويض عام) */
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".js-add-cart");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  addToCart(id, Number(btn.dataset.qty || 1));
});

document.addEventListener("DOMContentLoaded", syncCartBadge);

/* ============================================================================
   بطاقة الموقع — خريطة رمزية محلية (دون شبكة/إنترنت — بتصميم مشهد حضري)
   تُحقن تلقائيًا في أي صفحة تحتوي عنصر <div data-map></div>
   والخيار data-map="compact" يجعلها مقتضبة (داخل نماذج/أعمدة صغيرة).
   زر «فتح الخريطة» يطلق رابط خرائط جوجل بدبيان المعرض الفعلي.
   ============================================================================ */
const MAPS_URL = "https://maps.google.com/maps?q=30.79616928100586%2C31.01157569885254&z=17&hl=en";
const MAP_ADDRESS = "كورنيش المرشحة بجوار صيدلية الطرشوبي — طنطا";

function locationMapMarkup(compact) {
  return `
  <div class="map-card${compact ? " map-compact" : ""}">
    <svg class="map-visual" viewBox="0 0 640 ${compact ? 260 : 360}" preserveAspectRatio="xMidYMid slice"
      role="img" aria-label="خريطة موقع المعرض — كورنيش المرشحة">
      <defs>
        <linearGradient id="mapBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#171310"/><stop offset="1" stop-color="#0d0c0a"/>
        </linearGradient>
      </defs>
      <rect width="640" height="640" fill="url(#mapBg)"/>
      <!-- كتل الحارات (مخطط حضري) -->
      <g fill="#1d1813" stroke="#292219" stroke-width="1">
        <rect x="30"  y="34"  width="120" height="92"  rx="6"/>
        <rect x="170" y="34"  width="150" height="92"  rx="6"/>
        <rect x="340" y="20"  width="120" height="74"  rx="6"/>
        <rect x="484" y="20"  width="130" height="74"  rx="6"/>
        <rect x="30"  y="150" width="120" height="96"  rx="6"/>
        <rect x="170" y="150" width="150" height="70"  rx="6"/>
        <rect x="340" y="118" width="274" height="90"  rx="6"/>
        <rect x="30"  y="270" width="120" height="90"  rx="6"/>
        <rect x="470" y="230" width="144" height="96"  rx="6"/>
      </g>
      <!-- حديقة -->
      <rect x="170" y="242" width="150" height="110" rx="10" fill="#17211a" stroke="#233c2c"/>
      <g fill="#29483a"><circle cx="205" cy="272" r="7"/><circle cx="240" cy="300" r="9"/><circle cx="290" cy="268" r="6"/><circle cx="260" cy="322" r="7"/></g>
      <!-- شبكة الشوارع الثانوية -->
      <g stroke="#332a20" stroke-width="9" fill="none" stroke-linecap="round">
        <path d="M0 150 H640"/><path d="M160 0 V360"/><path d="M330 0 V360"/>
      </g>
      <g stroke="#2a231b" stroke-width="4" fill="none">
        <path d="M250 0 V360"/><path d="M470 40 V360"/><path d="M0 270 H460"/>
      </g>
      <!-- كورنيش المرشحة (الطريق الرئيسي) -->
      <path d="M-10 330 C 170 300, 330 220, 650 150" stroke="#3c3222" stroke-width="20" fill="none" stroke-linecap="round"/>
      <path d="M-10 330 C 170 300, 330 220, 650 150" stroke="rgba(201,162,39,.55)" stroke-width="1.6" stroke-dasharray="10 8" fill="none"/>
      <text x="86" y="330" font-size="12.5" font-weight="700" fill="#c9a227" transform="rotate(-12 86 330)">كورنيش المرشحة</text>
      <text x="376" y="152" font-size="10.5" fill="#574e3e" font-weight="600">شارع المدينة</text>
      <text x="52" y="120" font-size="10.5" fill="#574e3e" font-weight="600">حي الجامعة</text>
      <text x="360" y="220" font-size="10.5" fill="#574e3e" font-weight="600">متنزه المرشحة</text>
      <!-- الدبوس النابض -->
      <g transform="translate(452 172)">
        <circle class="map-pin-pulse" r="26" fill="rgba(201,162,39,.4)"/>
        <path d="M0 24 C 0 24 -17 6 -17 -7 C -17 -17 -9 -24 0 -24 C 9 -24 17 -17 17 -7 C 17 6 0 24 0 24 Z" fill="#c9a227" stroke="#14100a" stroke-width="2"/>
        <circle cy="-7" r="6.5" fill="#14100a"/>
        <rect x="-34" y="-58" width="68" height="24" rx="7" fill="#14100a" stroke="rgba(201,162,39,.55)"/>
        <text y="-41" text-anchor="middle" font-size="11.5" font-weight="800" fill="#e6c65c">سمارت هوس</text>
      </g>
    </svg>
    <div class="map-overlay">
      <span class="map-name"><i class="bi bi-geo-alt-fill"></i> معرض سمارت هوس</span>
      <span class="map-addr">${MAP_ADDRESS}</span>
      <span class="map-btns">
        <a class="btn btn-gold btn-sm" href="${MAPS_URL}" target="_blank" rel="noopener">
          <i class="bi bi-map me-1"></i> فتح الخريطة
        </a>
        <a class="btn btn-outline-gold btn-sm" href="tel:01099999999">
          <i class="bi bi-telephone me-1"></i> <span dir="ltr">01099999999</span>
        </a>
      </span>
    </div>
  </div>`;
}

function initLocationMaps() {
  document.querySelectorAll("[data-map]").forEach(box => {
    if (box.dataset.mapDone) return;
    box.dataset.mapDone = "1";
    box.innerHTML = locationMapMarkup(box.getAttribute("data-map") === "compact");
  });
}
document.addEventListener("DOMContentLoaded", initLocationMaps);

/* ============================================================================
   قائمة «حسابي» في الترويسة — تعرض حالة الجلسة إن وُجدت، وإلا تبقى
   «تسجيل الدخول / إنشاء حساب» الافتراضية.
   (محاكاة ASP.NET Core Identity: عند الربط الفعلي تُقرأ الجلسة من Cookie/JWT
    وتُستبدل هذه الدالة بنداء GET /api/identity/me)
   ============================================================================ */
function initAccountMenu() {
  const menu = document.getElementById("accountMenu");
  if (!menu) return;
  let session = null;
  try { session = JSON.parse(localStorage.getItem("sh_session")); } catch { /* تجاهل */ }
  if (!session) return; /* زائر يعود إلى الوضع الافتراضي */

  const isStaff = session.role && session.role !== "عميل";
  menu.innerHTML = `
    <li><span class="dropdown-item-text small fw-bold text-gold">
      <i class="bi bi-person-check me-1"></i>${session.name}
      <span class="d-block" style="font-size:.68rem">${session.role || ""}</span>
    </span></li>
    <li><hr class="dropdown-divider"></li>
    ${isStaff
      ? `<li><a class="dropdown-item" href="admin.html"><i class="bi bi-speedometer2 me-2"></i> لوحة الإدارة</a></li>`
      : `<li><a class="dropdown-item" href="catalog.html"><i class="bi bi-grid me-2"></i> تصفّح الكتالوج</a></li>
         <li><a class="dropdown-item" href="quote.html"><i class="bi bi-file-earmark-text me-2"></i> طلب عرض سعر</a></li>`}
    <li><button type="button" class="dropdown-item text-danger" id="siteLogout">
      <i class="bi bi-box-arrow-right me-2"></i> تسجيل الخروج</button></li>`;
  menu.querySelector("#siteLogout").addEventListener("click", () => {
    localStorage.removeItem("sh_session");
    location.reload();
  });
}

document.addEventListener("DOMContentLoaded", initAccountMenu);
