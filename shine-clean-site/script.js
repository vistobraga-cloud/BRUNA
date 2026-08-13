(() => {
  "use strict";

  const WHATSAPP_NUMBER = "17744760595";

  const WA_MSG = {
    en: "Hi! I saw your website and I'd like a free cleaning quote.",
    pt: "Olá! Vi o site e gostaria de um orçamento de limpeza."
  };

  // Decorative floating bubbles — position/size/gradient/animation ported 1:1
  // from the original Designer prototype, per section.
  function bub(pos, size, stops, borderA, anim, dur, delay) {
    const style = `${pos}; width:${size}px; height:${size}px; ` +
      `background:radial-gradient(circle at 30% 25%, ${stops}); ` +
      `--bub-border:${borderA}; --bub-name:${anim}; --bub-dur:${dur}s; --bub-delay:${delay || 0}s;`;
    return `<div class="bubble" style="${style}"></div>`;
  }

  const BUBBLES = {
    hero: [
      bub("right:10%; top:16%", 30, "rgba(255,255,255,0.8), rgba(253,190,2,0.15) 40%, rgba(236,93,137,0.1) 70%, rgba(129,50,223,0.06)", 0.4, "bub1", 5),
      bub("right:20%; top:45%", 18, "rgba(255,255,255,0.7), rgba(110,232,91,0.1) 40%, rgba(97,236,250,0.08) 70%, transparent", 0.3, "bub2", 6.5, 0.8),
      bub("right:5%; top:60%", 14, "rgba(255,255,255,0.6), rgba(236,93,137,0.1) 50%, transparent", 0.25, "bub3", 7, 1.5),
      bub("left:12%; top:28%", 22, "rgba(255,255,255,0.7), rgba(129,50,223,0.08) 40%, rgba(97,236,250,0.06) 70%, transparent", 0.3, "bub2", 7.5, 0.5),
      bub("right:35%; top:10%", 10, "rgba(255,255,255,0.7), rgba(253,190,2,0.12) 50%, transparent", 0.2, "bub1", 8, 2.2),
      bub("right:42%; bottom:12%", 20, "rgba(255,255,255,0.65), rgba(253,190,2,0.08) 40%, rgba(236,93,137,0.06) 70%, transparent", 0.25, "bub3", 6, 3)
    ],
    about: [
      bub("right:4%; top:18%", 22, "rgba(255,255,255,0.7), rgba(253,190,2,0.12) 40%, rgba(236,93,137,0.06) 70%, transparent", 0.3, "bub2", 7, 0.5),
      bub("left:6%; bottom:15%", 14, "rgba(255,255,255,0.6), rgba(129,50,223,0.08) 50%, transparent", 0.2, "bub1", 6, 1.8)
    ],
    services: [
      bub("left:2%; top:12%", 26, "rgba(255,255,255,0.7), rgba(110,232,91,0.1) 40%, rgba(97,236,250,0.06) 70%, transparent", 0.3, "bub3", 6.5),
      bub("right:3%; top:55%", 16, "rgba(255,255,255,0.6), rgba(236,93,137,0.08) 50%, transparent", 0.25, "bub1", 7.5, 1.2)
    ],
    area: [
      bub("right:8%; top:20%", 24, "rgba(255,255,255,0.2), rgba(253,190,2,0.08) 40%, rgba(236,93,137,0.05) 70%, transparent", 0.12, "bub1", 6),
      bub("left:10%; bottom:25%", 16, "rgba(255,255,255,0.15), rgba(129,50,223,0.06) 50%, transparent", 0.1, "bub2", 7, 1)
    ],
    how: [
      bub("right:6%; top:15%", 22, "rgba(255,255,255,0.7), rgba(253,190,2,0.1) 40%, rgba(129,50,223,0.06) 70%, transparent", 0.3, "bub1", 5.5, 0.3),
      bub("left:4%; bottom:22%", 15, "rgba(255,255,255,0.6), rgba(97,236,250,0.1) 50%, transparent", 0.25, "bub3", 7, 1.5)
    ],
    why: [
      bub("right:3%; top:30%", 18, "rgba(255,255,255,0.65), rgba(236,93,137,0.1) 40%, rgba(129,50,223,0.06) 70%, transparent", 0.25, "bub2", 6, 0.7),
      bub("left:6%; top:65%", 12, "rgba(255,255,255,0.6), rgba(253,190,2,0.08) 50%, transparent", 0.2, "bub1", 7.5, 2)
    ],
    testimonials: [
      bub("left:3%; top:18%", 20, "rgba(255,255,255,0.7), rgba(110,232,91,0.08) 40%, rgba(97,236,250,0.06) 70%, transparent", 0.3, "bub3", 6.5, 0.4),
      bub("right:5%; bottom:25%", 14, "rgba(255,255,255,0.6), rgba(236,93,137,0.08) 50%, transparent", 0.25, "bub1", 5.5, 1.6)
    ],
    finalCta: [
      bub("left:8%; top:15%; z-index:2", 26, "rgba(255,255,255,0.35), rgba(255,255,255,0.08) 50%, transparent", 0.2, "bub1", 6),
      bub("right:12%; top:25%; z-index:2", 18, "rgba(255,255,255,0.3), rgba(255,255,255,0.06) 50%, transparent", 0.15, "bub2", 7, 1),
      bub("left:25%; bottom:20%; z-index:2", 12, "rgba(255,255,255,0.25), transparent 60%", 0.12, "bub3", 5.5, 2),
      bub("right:30%; bottom:10%; z-index:2", 16, "rgba(255,255,255,0.3), transparent 60%", 0.15, "bub1", 8, 3)
    ]
  };

  const ICON = {
    whatsapp:
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm5.9 14.2c-.25.7-1.45 1.34-2 1.42-.53.08-1.2.11-1.94-.12a15 15 0 0 1-1.76-.65 11.5 11.5 0 0 1-4.4-3.9c-.33-.44-.85-1.28-.85-2.44 0-1.16.6-1.73.82-1.97a.86.86 0 0 1 .62-.29h.44c.14 0 .33-.05.52.4.2.48.66 1.66.72 1.78.06.12.1.26.02.42-.08.16-.12.26-.24.4l-.36.42c-.12.12-.24.25-.1.49.13.24.6.98 1.28 1.59.88.78 1.62 1.02 1.86 1.14.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.19 1.28z"/></svg>',
    house:
      '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5 12 2l9 7.5"/><path d="M5 8.5V21h14V8.5"/><path d="M9 21v-6h6v6"/></svg>',
    sparkle:
      '<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true"><path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6z"/><path d="M18.5 14l.7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7z"/></svg>',
    boxes:
      '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 7h11v9H2z"/><path d="M13 10h4l3 3v3h-7z"/><circle cx="6.5" cy="18" r="1.8"/><circle cx="17.5" cy="18" r="1.8"/></svg>',
    building:
      '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="12" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
    hardhat:
      '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 16a9 9 0 0 1 18 0"/><path d="M2 16h20"/><path d="M10 8V5a2 2 0 0 1 4 0v3"/></svg>',
    shop:
      '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01M9 16h6"/></svg>',
    user:
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    clock:
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    droplet:
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/></svg>',
    shieldCheck:
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
    camera:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/></svg>'
  };

  const SERVICES = [
    { key: "s1", grad: ["#fdbe02", "#fd330a"], icon: ICON.house, strokeW: true },
    { key: "s2", grad: ["#df046f", "#ba18b2"], icon: ICON.sparkle, strokeW: false },
    { key: "s3", grad: ["#6ee85b", "#61ecfa"], icon: ICON.boxes, strokeW: true },
    { key: "s4", grad: ["#2f8efc", "#0164fc"], icon: ICON.building, strokeW: true },
    { key: "s5", grad: ["#ec5d89", "#8132df"], icon: ICON.hardhat, strokeW: true },
    { key: "s6", grad: ["#fc9a6a", "#fb5c72"], icon: ICON.shop, strokeW: true }
  ];

  const STEPS = [
    { key: "h1", grad: ["#fdbe02", "#fd330a"] },
    { key: "h2", grad: ["#ec5d89", "#df046f"] },
    { key: "h3", grad: ["#2f8efc", "#0164fc"] },
    { key: "h4", grad: ["#997ae5", "#8132df"] }
  ];

  const WHY = [
    { key: "d1", grad: ["#fdbe02", "#fd330a"], icon: ICON.user },
    { key: "d2", grad: ["#df046f", "#ba18b2"], icon: ICON.clock },
    { key: "d3", grad: ["#6ee85b", "#61ecfa"], icon: ICON.droplet },
    { key: "d4", grad: ["#2f8efc", "#0164fc"], icon: ICON.shieldCheck }
  ];

  const TOWNS = ["Fall River", "New Bedford", "Somerset", "Swansea", "Dartmouth", "Westport", "Tiverton", "Freetown"];

  const COPY = {
    en: {
      navCta: "WhatsApp",
      heroBadge: "Fall River, MA · up to 40 miles",
      heroHeadline: "A spotless home or office, from someone you can trust.",
      heroSub: "Serving up to 40 miles from Fall River. Get your free quote on WhatsApp today.",
      heroCta: "Message us on WhatsApp",
      heroNote: "Free quotes · usually replies same day",
      aboutKicker: "Meet Bruna",
      aboutTitle: "You talk to the person who does the cleaning.",
      aboutP1: "I'm Bruna, the owner of Shine Clean Specialist. When you message, you reach me directly — not a call center. I treat every home and office as if it were my own, with careful attention to the details most people miss.",
      aboutP2: "After years cleaning for families and businesses across the Fall River area, I built this service on one simple idea: honest work, on time, done right the first time. That's the promise behind every visit.",
      photoAlt: "Photo of Bruna coming soon",
      svcKicker: "What I do",
      svcTitle: "Cleaning for homes and businesses",
      svcResidential: "Residential",
      svcCommercial: "Commercial",
      s1t: "House Cleaning", s1d: "Regular, reliable cleaning that keeps your home fresh week after week.",
      s2t: "Deep Cleaning", s2d: "Top-to-bottom detail work for the spots a routine clean doesn't reach.",
      s3t: "Move In / Move Out", s3d: "Leave a place spotless, or start fresh in one — ready for the keys.",
      s4t: "Office Cleaning", s4d: "A clean, welcoming workspace your team and clients will notice.",
      s5t: "Post Construction", s5d: "Dust, debris and residue cleared after a build or renovation.",
      s6t: "Commercial Cleaning", s6d: "Dependable upkeep for shops, studios and commercial spaces.",
      areaKicker: "Service area",
      areaTitle: "Serving Fall River and up to 40 miles around.",
      areaSub: "Not sure if you're in range? Send a message with your town and I'll let you know right away.",
      areaMore: "+ surrounding towns",
      howKicker: "How it works",
      howTitle: "Four easy steps to a spotless space",
      h1t: "Message on WhatsApp", h1d: "Tell me what you need and where you are.",
      h2t: "Get your quote", h2d: "I reply with a clear, fair price — no surprises.",
      h3t: "Book your day", h3d: "We pick a date and time that works for you.",
      h4t: "Enjoy the shine", h4d: "You come back to a home or office that sparkles.",
      whyKicker: "Why Shine Clean",
      whyTitle: "Personal service, done with care",
      d1t: "You deal with me, directly", d1d: "No call center, no middleman. You message Bruna and Bruna answers.",
      d2t: "On time, every time", d2d: "I show up when I say I will and respect your schedule.",
      d3t: "Quality products", d3d: "Effective, well-chosen cleaning products for a spotless finish.",
      d4t: "Satisfaction guaranteed", d4d: "If something's not right, tell me and I'll make it right.",
      revKicker: "Kind words",
      revTitle: "What clients say",
      rev1: "Bruna is reliable, thorough and so easy to work with. My house has never looked better.",
      rev1by: "— Sample review",
      rev2: "She cleaned our office after a renovation and it was spotless. Highly recommend.",
      rev2by: "— Sample review",
      rev3: "On time, friendly and detail-oriented. We book her every two weeks now.",
      rev3by: "— Sample review",
      revNote: "Sample reviews shown — real client testimonials to be added.",
      finalTitle: "Book your cleaning today",
      finalSub: "A quick message is all it takes. Send your town and what you need, and I'll get you a free quote.",
      finalCta: "Message us on WhatsApp",
      footTag: "Residential and commercial cleaning you can trust, serving the Fall River area.",
      footArea: "Up to 40 miles from Fall River, MA",
      footCopy: "© 2026 Shine Clean Specialist. All rights reserved."
    },
    pt: {
      navCta: "WhatsApp",
      heroBadge: "Fall River, MA · até 40 milhas",
      heroHeadline: "Sua casa ou escritório impecável, com quem você pode confiar.",
      heroSub: "Atendimento em até 40 milhas de Fall River. Peça seu orçamento agora pelo WhatsApp.",
      heroCta: "Chamar no WhatsApp",
      heroNote: "Orçamento grátis · normalmente respondo no mesmo dia",
      aboutKicker: "Conheça a Bruna",
      aboutTitle: "Você fala direto com quem faz a limpeza.",
      aboutP1: "Sou a Bruna, dona da Shine Clean Specialist. Quando você manda mensagem, fala comigo — não com uma central. Cuido de cada casa e escritório como se fossem meus, com atenção aos detalhes que a maioria não percebe.",
      aboutP2: "Depois de anos limpando para famílias e empresas na região de Fall River, criei este serviço com uma ideia simples: trabalho honesto, no horário, bem feito da primeira vez. Essa é a promessa em cada visita.",
      photoAlt: "Foto da Bruna em breve",
      svcKicker: "O que eu faço",
      svcTitle: "Limpeza para casas e empresas",
      svcResidential: "Residencial",
      svcCommercial: "Comercial",
      s1t: "Limpeza Residencial", s1d: "Limpeza regular e confiável que mantém sua casa impecável toda semana.",
      s2t: "Limpeza Pesada", s2d: "Limpeza detalhada de cima a baixo, nos cantos que a rotina não alcança.",
      s3t: "Mudança (Entrada/Saída)", s3d: "Deixe o imóvel impecável, ou comece do zero em um novo — pronto para morar.",
      s4t: "Limpeza de Escritório", s4d: "Um ambiente limpo e acolhedor que sua equipe e clientes vão notar.",
      s5t: "Pós-Obra", s5d: "Poeira, entulho e resíduos removidos depois de obra ou reforma.",
      s6t: "Limpeza Comercial", s6d: "Manutenção confiável para lojas, estúdios e espaços comerciais.",
      areaKicker: "Área de atendimento",
      areaTitle: "Atendo Fall River e até 40 milhas ao redor.",
      areaSub: "Não sabe se está na área? Mande uma mensagem com sua cidade e eu confirmo na hora.",
      areaMore: "+ cidades vizinhas",
      howKicker: "Como funciona",
      howTitle: "Quatro passos simples até tudo impecável",
      h1t: "Chama no WhatsApp", h1d: "Me conta o que precisa e onde você está.",
      h2t: "Recebe o orçamento", h2d: "Respondo com um preço claro e justo — sem surpresas.",
      h3t: "Agenda o dia", h3d: "A gente marca a data e o horário que funciona pra você.",
      h4t: "Aproveita o brilho", h4d: "Você volta pra uma casa ou escritório reluzente.",
      whyKicker: "Por que a Shine Clean",
      whyTitle: "Atendimento pessoal, feito com capricho",
      d1t: "Você fala comigo, direto", d1d: "Sem central, sem intermediário. Você chama a Bruna e a Bruna responde.",
      d2t: "Pontualidade sempre", d2d: "Chego na hora combinada e respeito a sua agenda.",
      d3t: "Produtos de qualidade", d3d: "Produtos de limpeza eficazes e bem escolhidos para um acabamento impecável.",
      d4t: "Satisfação garantida", d4d: "Se algo não ficou certo, me avisa que eu resolvo.",
      revKicker: "Palavras gentis",
      revTitle: "O que dizem os clientes",
      rev1: "A Bruna é confiável, caprichosa e muito fácil de trabalhar. Minha casa nunca esteve tão bem.",
      rev1by: "— Avaliação de exemplo",
      rev2: "Ela limpou nosso escritório depois da reforma e ficou impecável. Recomendo muito.",
      rev2by: "— Avaliação de exemplo",
      rev3: "Pontual, simpática e atenta aos detalhes. Agora agendamos a cada duas semanas.",
      rev3by: "— Avaliação de exemplo",
      revNote: "Avaliações de exemplo — depoimentos reais de clientes serão adicionados.",
      finalTitle: "Agende sua limpeza hoje",
      finalSub: "Basta uma mensagem rápida. Manda sua cidade e o que você precisa, e eu passo um orçamento grátis.",
      finalCta: "Chamar no WhatsApp",
      footTag: "Limpeza residencial e comercial de confiança, atendendo a região de Fall River.",
      footArea: "Até 40 milhas de Fall River, MA",
      footCopy: "© 2026 Shine Clean Specialist. Todos os direitos reservados."
    }
  };

  let lang = localStorage.getItem("scs_lang");
  if (!lang) lang = (navigator.language || "").toLowerCase().startsWith("pt") ? "pt" : "en";
  if (!COPY[lang]) lang = "en";

  function waHref() {
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(WA_MSG[lang]);
  }

  function track() {
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "whatsapp_click", lang });
      if (typeof window.gtag === "function") window.gtag("event", "whatsapp_click", { lang });
    } catch (e) { /* analytics not loaded yet — non-blocking */ }
  }

  function waBtn({ cls = "btn btn--sm", label }) {
    return `<a href="${waHref()}" target="_blank" rel="noopener" class="${cls} js-wa-cta">${ICON.whatsapp}<span>${label}</span></a>`;
  }

  function iconCircle(icon, grad, round) {
    return `<span class="icon-circle${round ? " icon-circle--round" : ""}" style="background:linear-gradient(135deg, ${grad[0]}, ${grad[1]})">${icon}</span>`;
  }

  function renderNav(t) {
    const el = document.getElementById("navbar");
    el.innerHTML = `
      <div class="navbar__inner">
        <a class="navbar__brand" href="#hero" aria-label="Shine Clean Specialist home">
          <img src="assets/logo.png" alt="Shine Clean Specialist" class="navbar__logo" width="160" height="44" />
        </a>
        <div class="navbar__right">
          <div class="lang-toggle" role="group" aria-label="Language / Idioma">
            <button type="button" class="lang-toggle__btn" data-lang="en" aria-pressed="${lang === "en"}">EN</button>
            <button type="button" class="lang-toggle__btn" data-lang="pt" aria-pressed="${lang === "pt"}">PT</button>
          </div>
          ${waBtn({ label: t.navCta })}
        </div>
      </div>`;
    el.querySelectorAll("[data-lang]").forEach(btn => {
      btn.addEventListener("click", () => setLang(btn.getAttribute("data-lang")));
    });
    el.querySelector(".js-wa-cta").addEventListener("click", track);
  }

  function renderHero(t) {
    const el = document.getElementById("hero");
    el.innerHTML = `
      <div class="deco-circle" style="right:-120px; top:-60px; width:400px; height:400px; background:linear-gradient(135deg, rgba(253,190,2,0.12), rgba(236,93,137,0.08));"></div>
      <div class="deco-circle" style="left:-80px; bottom:-40px; width:220px; height:220px; background:linear-gradient(135deg, rgba(129,50,223,0.06), rgba(97,236,250,0.06));"></div>
      ${BUBBLES.hero.join("")}
      <div class="section__inner hero__inner">
        <div class="hero__content">
          <span class="badge">${t.heroBadge}</span>
          <h1>${t.heroHeadline}</h1>
          <p class="hero__sub">${t.heroSub}</p>
          <div class="hero__cta-row">
            ${waBtn({ cls: "btn btn--lg btn--shimmer", label: t.heroCta })}
            <span class="hero__note">${t.heroNote}</span>
          </div>
        </div>
      </div>
      <svg class="wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true"><path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80Z" fill="#ffffff"/></svg>`;
    el.querySelector(".js-wa-cta").addEventListener("click", track);
  }

  function renderAbout(t) {
    const el = document.getElementById("about");
    el.innerHTML = `
      ${BUBBLES.about.join("")}
      <div class="section__inner about-grid">
        <figure class="photo-slot" role="img" aria-label="${t.photoAlt}" style="margin:0;">
          ${ICON.camera}
          <span>${t.photoAlt}</span>
        </figure>
        <div>
          <span class="kicker">${t.aboutKicker}</span>
          <h2>${t.aboutTitle}</h2>
          <p style="font-size:17px; color:var(--color-text-soft); margin:18px 0 16px;">${t.aboutP1}</p>
          <p style="font-size:17px; color:var(--color-text-soft); margin:0;">${t.aboutP2}</p>
        </div>
      </div>
      <svg class="wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true"><path d="M0,20 C240,70 480,0 720,40 C960,80 1200,10 1440,30 L1440,80 L0,80Z" fill="var(--color-bg)"/></svg>`;
  }

  function renderServices(t) {
    const el = document.getElementById("services");
    const col = items => items.map(s => `
      <div class="card">
        ${iconCircle(s.icon, s.grad, false)}
        <div><h4>${t[s.key + "t"]}</h4><p>${t[s.key + "d"]}</p></div>
      </div>`).join("");
    el.innerHTML = `
      ${BUBBLES.services.join("")}
      <div class="section__inner">
        <div class="section__head"><span class="kicker">${t.svcKicker}</span><h2>${t.svcTitle}</h2></div>
        <div class="services-grid">
          <div class="services-col">
            <h3><span class="dot" style="background:#fd330a"></span>${t.svcResidential}</h3>
            <div class="card-list">${col(SERVICES.slice(0, 3))}</div>
          </div>
          <div class="services-col">
            <h3><span class="dot" style="background:#0164fc"></span>${t.svcCommercial}</h3>
            <div class="card-list">${col(SERVICES.slice(3, 6))}</div>
          </div>
        </div>
      </div>
      <svg class="wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true"><path d="M0,50 C180,10 360,70 540,30 C720,-10 900,60 1080,30 C1260,0 1380,40 1440,20 L1440,80 L0,80Z" fill="#1a1a2e"/></svg>`;
  }

  function renderArea(t) {
    const el = document.getElementById("area");
    const pills = TOWNS.map(town => `<span class="town-pill">${town}</span>`).join("");
    el.innerHTML = `
      <div class="area-glow"></div>
      ${BUBBLES.area.join("")}
      <div class="section__inner area-grid">
        <div>
          <span class="kicker kicker--on-dark">${t.areaKicker}</span>
          <h2>${t.areaTitle}</h2>
          <p>${t.areaSub}</p>
        </div>
        <div class="town-list">${pills}<span class="town-pill town-pill--more">${t.areaMore}</span></div>
      </div>
      <svg class="wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true"><path d="M0,30 C300,70 600,0 900,40 C1100,60 1300,20 1440,30 L1440,80 L0,80Z" fill="#ffffff"/></svg>`;
  }

  function renderHow(t) {
    const el = document.getElementById("how");
    const steps = STEPS.map((s, i) => `
      <div class="step-item">
        <span class="step-num" style="background:linear-gradient(135deg, ${s.grad[0]}, ${s.grad[1]})">${i + 1}</span>
        <h3>${t[s.key + "t"]}</h3>
        <p>${t[s.key + "d"]}</p>
      </div>`).join("");
    el.innerHTML = `
      ${BUBBLES.how.join("")}
      <div class="section__inner">
        <div class="section__head"><span class="kicker">${t.howKicker}</span><h2>${t.howTitle}</h2></div>
        <div class="steps-grid">${steps}</div>
      </div>
      <svg class="wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true"><path d="M0,60 C200,20 400,70 600,30 C800,-10 1000,50 1200,20 C1350,0 1420,30 1440,20 L1440,80 L0,80Z" fill="var(--color-bg)"/></svg>`;
  }

  function renderWhy(t) {
    const el = document.getElementById("why");
    const cards = WHY.map(d => `
      <div class="why-card">
        ${iconCircle(d.icon, d.grad, true)}
        <div><h3 style="font-size:18px; margin:4px 0 6px;">${t[d.key + "t"]}</h3><p>${t[d.key + "d"]}</p></div>
      </div>`).join("");
    el.innerHTML = `
      ${BUBBLES.why.join("")}
      <div class="section__inner">
        <div class="section__head section__head--left"><span class="kicker">${t.whyKicker}</span><h2>${t.whyTitle}</h2></div>
        <div class="why-grid">${cards}</div>
      </div>
      <svg class="wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true"><path d="M0,40 C360,0 720,70 1080,30 C1260,10 1380,40 1440,20 L1440,80 L0,80Z" fill="#ffffff"/></svg>`;
  }

  function renderTestimonials(t) {
    const el = document.getElementById("testimonials");
    const cards = [1, 2, 3].map(n => `
      <figure class="testi-card">
        <div class="testi-stars" aria-hidden="true">★★★★★</div>
        <blockquote>${t["rev" + n]}</blockquote>
        <figcaption>${t["rev" + n + "by"]}</figcaption>
      </figure>`).join("");
    el.innerHTML = `
      ${BUBBLES.testimonials.join("")}
      <div class="section__inner">
        <div class="section__head"><span class="kicker">${t.revKicker}</span><h2>${t.revTitle}</h2></div>
        <div class="testi-grid">${cards}</div>
        <p class="testi-note">${t.revNote}</p>
      </div>`;
  }

  function renderFinalCta(t) {
    const el = document.getElementById("final-cta");
    el.innerHTML = `
      <div class="final-cta__scrim"></div>
      ${BUBBLES.finalCta.join("")}
      <div class="final-cta__inner">
        <h2>${t.finalTitle}</h2>
        <p>${t.finalSub}</p>
        ${waBtn({ cls: "btn btn--lg btn--white", label: t.finalCta })}
      </div>`;
    el.querySelector(".js-wa-cta").addEventListener("click", track);
  }

  function renderFooter(t) {
    const el = document.getElementById("footer");
    el.innerHTML = `
      <div class="footer__inner">
        <div class="footer__top">
          <div>
            <img src="assets/logo.png" alt="Shine Clean Specialist" class="footer__logo" width="150" height="52" />
            <p class="footer__tag">${t.footTag}</p>
          </div>
          <div class="footer__links">
            <a href="${waHref()}" target="_blank" rel="noopener" class="js-wa-cta">${ICON.whatsapp}WhatsApp</a>
            <a href="tel:+17744760595" class="footer__phone">(774) 476-0595</a>
            <span class="footer__area">${t.footArea}</span>
          </div>
        </div>
        <p class="footer__copy">${t.footCopy}</p>
      </div>`;
    el.querySelector(".js-wa-cta").addEventListener("click", track);
  }

  let io = null;
  function observeFadeIns() {
    if (!io) {
      io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
    }
    document.querySelectorAll(".fade-in:not(.visible)").forEach(el => io.observe(el));
  }

  function render() {
    const t = COPY[lang];
    document.documentElement.lang = lang;
    renderNav(t);
    renderHero(t);
    renderAbout(t);
    renderServices(t);
    renderArea(t);
    renderHow(t);
    renderWhy(t);
    renderTestimonials(t);
    renderFinalCta(t);
    renderFooter(t);
    observeFadeIns();
  }

  function setLang(next) {
    if (!COPY[next] || next === lang) return;
    lang = next;
    localStorage.setItem("scs_lang", lang);
    render();
  }

  document.addEventListener("DOMContentLoaded", render);
})();
