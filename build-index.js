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

// Replace the About-section image-slot with Bruna's real photo. Portrait
// framing biases toward the top so her face stays in view when the parent
// circle crops the sides.
body = body.replace(
  /<image-slot[^>]*placeholder="([^"]*)"[^>]*><\/image-slot>/,
  `<img src="uploads/Bruna.png" alt="Bruna — owner of Shine Clean Specialist" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover;object-position:center 28%;display:block;">`
);

// Path fixes — the zip served images from uploads/ (we mirrored that dir).
// image-slot.js and _ds live under the same folder; leave those paths as-is.

// User-requested tweaks on top of the original:
// (1) Bigger logo that fills the nav bar with only ~1px of breathing room.
// (2) Make the nav truly fixed (position: sticky was collapsing on scroll
//     inside the .sc wrapper's overflow-x context).
body = body.replace(/padding: 12px clamp\(16px, 4vw, 48px\)/, "padding: 2px clamp(16px, 4vw, 48px)");
body = body.replace(/height: 44px; width: auto; display: block;/, "height: 60px; width: auto; display: block;");
body = body.replace(/position: sticky; top: 0;/, "position: fixed; top: 0; left: 0; right: 0;");

// (3) Before/After section — inject between Services (cream) and Area (dark).
// The Services closing wave originally fills dark #1a1a2e; change that fill
// to white so it transitions into the new white Transformations section,
// which then has its own dark-fill wave heading into Area.
const BEFORE_AFTER_HTML = `
<section id="transformations" style="background:#ffffff; position:relative;">
  <div style="max-width: 1120px; margin: 0 auto; padding: clamp(56px, 8vw, 96px) clamp(20px, 5vw, 48px);">
    <div class="fade-in" style="text-align: center; max-width: 44ch; margin: 0 auto 44px;">
      <span style="display:block;font-size:13px;letter-spacing:.08em;text-transform:uppercase;font-weight:600;color:var(--color-accent-700);margin-bottom:10px;"><span data-i18n="baKicker"></span></span>
      <h2 style="font-family:var(--font-heading);font-size:clamp(28px,3.5vw,42px);line-height:1.1;margin:0 0 14px;letter-spacing:-.015em;"><span data-i18n="baTitle"></span></h2>
      <p style="font-size:16px;margin:0;color:color-mix(in srgb, var(--color-text) 65%, transparent);"><span data-i18n="baSub"></span></p>
    </div>
    <div class="ba-grid fade-in">
      ${['cozinha','quarto','banheiro1','banheiro2'].map((k,i) => {
        const ext = k === 'quarto' ? 'jpeg' : 'png';
        // kitchen + bathtub landscape; bedroom + shower portrait
        const ratio = (k === 'quarto' || k === 'banheiro2') ? '3/4' : '4/3';
        return `
      <figure class="ba-item">
        <div class="ba" style="aspect-ratio:${ratio};">
          <div class="ba-layer"><img src="uploads/antes-${k}.${ext}" alt="" loading="lazy" decoding="async"></div>
          <div class="ba-layer ba-after"><img src="uploads/depois-${k}.${ext}" alt="" loading="lazy" decoding="async"></div>
          <span class="ba-badge ba-badge-before" data-i18n="baLabelBefore"></span>
          <span class="ba-badge ba-badge-after" data-i18n="baLabelAfter"></span>
          <div class="ba-handle"><div class="ba-knob" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 6l-5 6 5 6v-4h6v4l5-6-5-6v4H9z"/></svg></div></div>
        </div>
        <figcaption class="ba-caption" data-i18n="baPair${i+1}"></figcaption>
      </figure>`;
      }).join('')}
    </div>
  </div>
  <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style="display:block;width:100%;height:60px;">
    <path d="M0,50 C180,10 360,70 540,30 C720,-10 900,60 1080,30 C1260,0 1380,40 1440,20 L1440,80 L0,80Z" fill="#1a1a2e"/>
  </svg>
</section>
`;

// change services closing wave dark->white AND insert new section right after </section id="services">
body = body.replace(
  /(<path d="M0,50 C180,10 360,70 540,30 C720,-10 900,60 1080,30 C1260,0 1380,40 1440,20 L1440,80 L0,80Z" fill=")#1a1a2e("\/>\s*<\/svg>\s*<\/section>)/,
  '$1#ffffff$2' + BEFORE_AFTER_HTML
);

// Extend the runtime COPY with the new keys (kept out of the Designer's own
// source file so a re-export of the zip doesn't clobber the additions).
Object.assign(COPY.en, {
  baKicker: "Real transformations",
  baTitle: "See the difference for yourself",
  baSub: "Drag the slider on each photo to reveal the after.",
  baLabelBefore: "Before",
  baLabelAfter: "After",
  baPair1: "Kitchen",
  baPair2: "Bedroom",
  baPair3: "Bathtub",
  baPair4: "Shower"
});
Object.assign(COPY.pt, {
  baKicker: "Transformações reais",
  baTitle: "Veja a diferença você mesmo",
  baSub: "Arraste o controle em cada foto para revelar o depois.",
  baLabelBefore: "Antes",
  baLabelAfter: "Depois",
  baPair1: "Cozinha",
  baPair2: "Quarto",
  baPair3: "Banheira",
  baPair4: "Box"
});

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

/* Scroll progress bar — thin candy-gradient stripe pinned above the nav */
#scroll-progress {
  position: fixed; top: 0; left: 0; height: 3px; width: 0%;
  background: linear-gradient(90deg, #FDBE02, #EC5D89, #8132DF);
  z-index: 100; pointer-events: none;
  transition: width 0.08s linear;
}
@media (prefers-reduced-motion: reduce) { #scroll-progress { transition: none; } }

/* Nav is now position:fixed — reserve space so hero content isn't hidden. */
body { padding-top: 68px; }

/* Floating WhatsApp button — always visible, tap-friendly, doesn't obscure content */
#wa-float {
  position: fixed; bottom: 20px; right: 20px; z-index: 90;
  display: grid; place-items: center;
  width: 60px; height: 60px; border-radius: 999px;
  background: #25D366; color: #fff; text-decoration: none;
  box-shadow: 0 8px 24px rgba(37, 211, 102, 0.45), 0 2px 6px rgba(0,0,0,0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
#wa-float:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 12px 30px rgba(37, 211, 102, 0.55), 0 4px 10px rgba(0,0,0,0.2);
}
#wa-float:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }
#wa-float svg { width: 32px; height: 32px; fill: #fff; }
@media (prefers-reduced-motion: no-preference) {
  #wa-float {
    animation: wa-pulse 2.6s ease-in-out infinite;
  }
  @keyframes wa-pulse {
    0%, 100% { box-shadow: 0 8px 24px rgba(37, 211, 102, 0.45), 0 2px 6px rgba(0,0,0,0.15), 0 0 0 0 rgba(37, 211, 102, 0.5); }
    70% { box-shadow: 0 8px 24px rgba(37, 211, 102, 0.45), 0 2px 6px rgba(0,0,0,0.15), 0 0 0 14px rgba(37, 211, 102, 0); }
  }
}
@media (max-width: 480px) {
  #wa-float { width: 56px; height: 56px; bottom: 16px; right: 16px; }
  #wa-float svg { width: 28px; height: 28px; }
}

/* Before/After slider */
#transformations .ba-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px; }
@media (max-width: 720px) { #transformations .ba-grid { grid-template-columns: 1fr; gap: 24px; } }
.ba-item { display: flex; flex-direction: column; gap: 12px; margin: 0; }
.ba {
  position: relative; overflow: hidden;
  border-radius: 22px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  cursor: ew-resize; user-select: none;
  touch-action: pan-y;
  background: #eee;
  --pos: 50%;
  transition: box-shadow 0.25s ease;
}
.ba:hover { box-shadow: 0 12px 32px rgba(0,0,0,0.14); }
.ba img { display: block; width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
.ba-layer { position: absolute; inset: 0; }
.ba-after { clip-path: inset(0 0 0 var(--pos)); }
.ba-handle {
  position: absolute; top: 0; bottom: 0;
  left: var(--pos); width: 3px;
  background: #fff;
  box-shadow: 0 0 12px rgba(0,0,0,0.5);
  transform: translateX(-50%);
  pointer-events: none;
}
.ba-knob {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 46px; height: 46px; border-radius: 50%;
  background: #fff;
  box-shadow: 0 4px 14px rgba(0,0,0,0.35);
  display: grid; place-items: center;
  color: #8132DF;
}
.ba-knob svg { width: 24px; height: 24px; fill: currentColor; }
.ba-badge {
  position: absolute; top: 12px;
  padding: 5px 14px; border-radius: 999px;
  font-family: var(--font-body); font-weight: 700;
  font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;
  color: #fff; pointer-events: none;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  background: rgba(0,0,0,0.5);
}
.ba-badge-before { left: 12px; }
.ba-badge-after { right: 12px; background: linear-gradient(135deg, rgba(253,190,2,0.9), rgba(236,93,137,0.9)); }
.ba-caption { font-family: var(--font-heading); font-size: 18px; text-align: center; color: var(--color-text); }
</style>
</head>
<body>
<div id="scroll-progress" aria-hidden="true"></div>
${body}
<a id="wa-float" href="#" data-wa-href="1" target="_blank" rel="noopener" aria-label="WhatsApp">
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm5.9 14.2c-.25.7-1.45 1.34-2 1.42-.53.08-1.2.11-1.94-.12a15 15 0 0 1-1.76-.65 11.5 11.5 0 0 1-4.4-3.9c-.33-.44-.85-1.28-.85-2.44 0-1.16.6-1.73.82-1.97a.86.86 0 0 1 .62-.29h.44c.14 0 .33-.05.52.4.2.48.66 1.66.72 1.78.06.12.1.26.02.42-.08.16-.12.26-.24.4l-.36.42c-.12.12-.24.25-.1.49.13.24.6.98 1.28 1.59.88.78 1.62 1.02 1.86 1.14.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.19 1.28z"/></svg>
</a>

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

  // Before/After sliders — pointer events cover mouse, touch and pen.
  document.querySelectorAll(".ba").forEach(el => {
    const setPos = clientX => {
      const r = el.getBoundingClientRect();
      let p = ((clientX - r.left) / r.width) * 100;
      if (p < 0) p = 0; else if (p > 100) p = 100;
      el.style.setProperty("--pos", p + "%");
    };
    el.addEventListener("pointerdown", e => {
      el.setPointerCapture(e.pointerId);
      setPos(e.clientX);
      const move = ev => setPos(ev.clientX);
      const up = () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerup", up);
        el.removeEventListener("pointercancel", up);
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", up);
    });
  });

  const bar = document.getElementById("scroll-progress");
  function updateBar() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", updateBar, { passive: true });
  window.addEventListener("resize", updateBar);
  updateBar();

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
