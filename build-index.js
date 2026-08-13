// Reads the Designer's Shine Clean Specialist v2.dc.html and produces a
// runnable index.html that keeps every byte of the visible markup, styles,
// keyframes and decoration intact. The only rewrites: strip the
// Designer's <x-dc>/DCLogic runtime wrapper, resolve {{ t.KEY }} /
// {{ waHref }} placeholders with plain vanilla JS that reruns on
// language toggle, and swap the <image-slot> custom element for a static
// placeholder (the drag/drop widget only works inside the Designer).
const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "design_handoff_extracted", "Shine Clean Specialist v2.dc.html");
const OUT = path.join(__dirname, "shine-clean-site", "index.html");

const raw = fs.readFileSync(SRC, "utf8");

const copyMatch = raw.match(/const COPY = (\{[\s\S]*?\});\s*const WA_MSG/);
const waMatch = raw.match(/const WA_MSG = (\{[\s\S]*?\});/);
if (!copyMatch || !waMatch) throw new Error("COPY / WA_MSG not found");
const COPY = new Function("return " + copyMatch[1])();
const WA_MSG = new Function("return " + waMatch[1])();

// helmet (keyframes, hover states, media queries, scroll-behavior)
const helmetStyle = raw.match(/<style>\n([\s\S]*?)<\/style>/)[1];
const jsonLd = raw.match(/<script type="application\/ld\+json">\n([\s\S]*?)\n<\/script>/)[1];

// Body markup — everything inside the .sc wrapper
const bodyStart = raw.indexOf('<div class="sc"');
const bodyEnd = raw.indexOf("</x-dc>");
let body = raw.slice(bodyStart, bodyEnd).trim();

// Turn placeholder attributes into template hooks the vanilla JS below can rerender.
// text nodes: {{ t.KEY }} -> <span data-i18n="KEY"></span>
body = body.replace(/\{\{\s*t\.(\w+)\s*\}\}/g, (_, key) => `<span data-i18n="${key}"></span>`);

// href="{{ waHref }}" -> data-wa-href attribute
body = body.replace(/href="\{\{\s*waHref\s*\}\}"/g, 'href="#" data-wa-href="1"');
// onClick="{{ track }}" -> data-wa-track
body = body.replace(/onClick="\{\{[^}]*\}\}"/g, "");

// Language toggle: onClick="{{ setEn }}" already dropped above.
// aria-pressed="{{ isEn }}" / style="{{ enBtnStyle }}" — mark them for the JS.
body = body.replace(/aria-pressed="\{\{\s*isEn\s*\}\}"/g, 'data-lang-btn="en" aria-pressed="true"');
body = body.replace(/aria-pressed="\{\{\s*isPt\s*\}\}"/g, 'data-lang-btn="pt" aria-pressed="false"');
body = body.replace(/style="\{\{\s*enBtnStyle\s*\}\}"/g, "");
body = body.replace(/style="\{\{\s*ptBtnStyle\s*\}\}"/g, "");

// Add the click handlers via data attrs (JS wires them up in DOMContentLoaded)
body = body.replace(/(<button[^>]*data-lang-btn="en"[^>]*)>/g, '$1 type="button">');
body = body.replace(/(<button[^>]*data-lang-btn="pt"[^>]*)>/g, '$1 type="button">');

// Attach a class on the lang-toggle buttons so we can style active state
// (originally that came from enBtnStyle / ptBtnStyle inline strings)

// Replace <image-slot> custom element (would need the Designer's authoring
// widget) with a plain visual placeholder that keeps the same footprint.
body = body.replace(
  /<image-slot[^>]*placeholder="([^"]*)"[^>]*><\/image-slot>/,
  (_, placeholder) => `<div style="width:100%;height:100%;display:grid;place-items:center;text-align:center;padding:16px;background:linear-gradient(135deg, rgba(253,190,2,0.15), rgba(129,50,223,0.12));border:2px dashed rgba(198,113,57,0.4);border-radius:999px;color:#8a4a1f;font-size:13px;font-weight:600;">${placeholder}</div>`
);

// Path fixes — the zip served images from uploads/ (we mirrored that dir).
// image-slot.js and _ds live under the same folder; leave those paths as-is.

const langBtnActive = "background: linear-gradient(135deg, #FDBE02, #EC5D89, #8132DF); color: #fff; box-shadow: inset 0 1px 0 rgba(255,255,255,0.4);";
const langBtnIdle = "background: transparent; color: color-mix(in srgb, var(--color-text) 70%, transparent);";

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Shine Clean Specialist | House &amp; Office Cleaning in Fall River, MA</title>
<meta name="description" content="Residential and commercial cleaning in Fall River, MA and up to 40 miles around. Deep cleaning, move in/out, office and post-construction cleaning. Get a free quote on WhatsApp." />
<link rel="canonical" href="https://shinecleanner.vercel.app/" />
<link rel="icon" type="image/png" href="uploads/LOGOBRUN-SHINECLEANNER.png" />

<meta property="og:type" content="business.business" />
<meta property="og:title" content="Shine Clean Specialist | Fall River, MA" />
<meta property="og:description" content="Residential and commercial cleaning in Fall River, MA. Free quotes on WhatsApp." />
<meta property="og:image" content="https://shinecleanner.vercel.app/uploads/LOGOBRUN-SHINECLEANNER.png" />
<meta property="og:url" content="https://shinecleanner.vercel.app/" />
<meta name="twitter:card" content="summary" />

<link rel="stylesheet" href="_ds/organic-413876d9-bc78-4ee4-a8d6-60491a8e091c/styles.css" />
<script src="image-slot.js"></script>

<script type="application/ld+json">
${jsonLd}
</script>

<style>
${helmetStyle}
[data-lang-btn] {
  border: 0;
  cursor: pointer;
  font-family: var(--font-heading);
  font-size: 13px;
  padding: 6px 14px;
  border-radius: 999px;
  transition: all .15s;
  ${langBtnIdle}
}
[data-lang-btn][aria-pressed="true"] { ${langBtnActive} }
</style>
</head>
<body>
${body}

<script>
(() => {
  "use strict";
  const COPY = ${JSON.stringify(COPY)};
  const WA_MSG = ${JSON.stringify(WA_MSG)};
  const WA_NUMBER = "17744760595";

  let lang = localStorage.getItem("scs_lang");
  if (!lang || !COPY[lang]) {
    lang = (navigator.language || "").toLowerCase().startsWith("pt") ? "pt" : "en";
  }

  function waHref() {
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(WA_MSG[lang]);
  }
  function track() {
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "whatsapp_click", lang });
      if (typeof window.gtag === "function") window.gtag("event", "whatsapp_click", { lang });
    } catch (e) {}
  }

  function render() {
    const t = COPY[lang];
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (t[key] !== undefined) el.textContent = t[key];
    });
    document.querySelectorAll("[data-wa-href]").forEach(a => { a.href = waHref(); });
    document.querySelectorAll("[data-lang-btn]").forEach(btn => {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-lang-btn") === lang ? "true" : "false");
    });
  }

  function setLang(next) {
    if (!COPY[next] || next === lang) return;
    lang = next;
    localStorage.setItem("scs_lang", lang);
    render();
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-lang-btn]");
    if (btn) { setLang(btn.getAttribute("data-lang-btn")); return; }
    const wa = e.target.closest("[data-wa-href]");
    if (wa) track();
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".sc .fade-in").forEach(el => io.observe(el));

  render();
})();
</script>
</body>
</html>
`;

fs.writeFileSync(OUT, html, "utf8");
console.log("Wrote", OUT, `(${html.length} bytes)`);
