# Shine Clean Specialist

One-page bilingual (EN/PT) landing site for **Shine Clean Specialist**, a residential & commercial cleaning business run by Bruna in Fall River, MA. Every CTA deep-links to WhatsApp.

## Structure

- [`shine-clean-site/`](shine-clean-site/) — the production site (plain HTML/CSS/JS, no framework). This is what gets deployed.
  - `index.html`, `styles.css`, `script.js`, `assets/logo.png`
  - `_dev-server.js` — tiny zero-dependency static server for local preview (`node shine-clean-site/_dev-server.js`, then open `http://localhost:5173`)
- [`design_handoff_extracted/`](design_handoff_extracted/) — the original high-fidelity design prototype (colors, copy, layout reference). Kept for provenance; not deployable as-is.
- `LOGOBRUN-SHINECLEANNER.png` — source logo file.

## Stack

Hand-written HTML/CSS/JS, deployed to Vercel. No proprietary builder, no backend — WhatsApp is the only contact channel.

## Pending before launch

- Real photo of Bruna (currently a placeholder)
- Real customer testimonials (currently sample copy)
- Business hours, social media links
- Domain registration
- Analytics (GA4 or Plausible) — loader script TODO is marked in `index.html`
