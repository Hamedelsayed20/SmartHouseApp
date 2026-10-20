/* ============================================================================
   أداة واتساب العائمة — تُحقن تلقائيًا في جميع صفحات الموقع
   (الموقع العام + لوحة التحكم + صفحات المصادقة)
   النمط: دائرة خضراء بأيقونة واتساب + فقاعة «تواصل معنا» بذيل يشير للدائرة
   ملاحظة: يُستبدل الرقم التجريبي برقم الشركة الفعلي عند الربط الفعلي
   ============================================================================ */
(function () {
  "use strict";

  var WA_NUMBER  = "2010999999999";   /* رقم واتساب: 01099999999 — بصل DHS (+20) لواجهة wa.me */
  var WA_MESSAGE = "مرحبًا، أود الاستفسار عن منتجاتكم";   /* رسالة مبدئية */

  /* الأنماط مدمجة هنا لتركيب الأداة على أي مجموعة صفحات دون تكرار */
  var CSS = [
    ".wa-float{position:fixed;bottom:22px;inset-inline-start:22px;z-index:1042;",
    "display:flex;align-items:center;flex-direction:row;gap:10px;text-decoration:none;",
    "-webkit-tap-highlight-color:transparent;}",
    "/* في لوحة التحكم القائمة الجانبية تحتل جهة البداية — ننقل الأداة للجهة المقابلة */",
    ".wa-float.wa-end{inset-inline-start:auto;inset-inline-end:22px;}",
    "/* في صفحة الدفع: يُرفع فوق شريط التأكيد الثابت */",
    "body.wa-lift .wa-float{bottom:calc(92px + 16px)}",
    ".wa-circle{width:56px;height:56px;border-radius:50%;flex:0 0 auto;",
    "background:linear-gradient(160deg,#3ce680,#25d366);color:#fff;font-size:1.85rem;",
    "display:grid;place-items:center;position:relative;",
    "box-shadow:0 10px 26px rgba(37,211,102,.4),inset 0 0 0 2px rgba(255,255,255,.4);",
    "transition:transform .22s ease,box-shadow .22s ease;}",
    ".wa-circle::after{content:\"\";position:absolute;inset:-4px;border-radius:50%;",
    "box-shadow:0 0 0 2px rgba(37,211,102,.35);opacity:0;transition:opacity .25s ease;}",
    ".wa-float:hover .wa-circle,.wa-float:focus-visible .wa-circle{",
    "transform:scale(1.06) rotate(-5deg);",
    "box-shadow:0 14px 34px rgba(37,211,102,.55),inset 0 0 0 2px rgba(255,255,255,.45);}",
    ".wa-float:hover .wa-circle::after,.wa-float:focus-visible .wa-circle::after{opacity:1;}",
    ".wa-label{position:relative;background:#fff;color:#1f2328;font-weight:700;",
    "font-size:.95rem;padding:.58rem 1.15rem;border-radius:12px;white-space:nowrap;",
    "box-shadow:0 8px 22px rgba(0,0,0,.28);transition:transform .22s ease,opacity .22s ease;}",
    "/* ذيل الفقاعة يشير نحو الدائرة */",
    ".wa-float .wa-label::after{content:\"\";position:absolute;top:50%;",
    "inset-inline-start:-11px;transform:translateY(-50%);",
    "border-block:6px solid transparent;border-inline-start:11px solid #fff;}",
    ".wa-float:hover .wa-label{transform:translateX(-3px)}",
    "@media (max-width:575.98px){",
    ".wa-circle{width:50px;height:50px;font-size:1.6rem}",
    ".wa-label{font-size:.85rem;padding:.5rem .95rem}}",
    "/* تقليل الحركة لمن يفضّل ذلك */",
    "@media (prefers-reduced-motion:reduce){.wa-circle,.wa-label{transition:none}}"
  ].join("");

  function inject() {
    if (document.querySelector(".wa-float")) return;

    var style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    var a = document.createElement("a");
    a.className = "wa-float" +
      (document.querySelector(".admin-shell") ? " wa-end" : "");
    a.href = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(WA_MESSAGE);
    a.target = "_blank";
    a.rel = "noopener";
    a.setAttribute("aria-label", "تواصل معنا عبر واتساب");
    a.innerHTML =
      '<span class="wa-circle"><i class="bi bi-whatsapp" aria-hidden="true"></i></span>' +
      '<span class="wa-label">تواصل معنا</span>';
    document.body.appendChild(a);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
