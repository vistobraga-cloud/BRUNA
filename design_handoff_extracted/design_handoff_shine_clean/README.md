# Handoff: Shine Clean Specialist Landing Page

## Overview
One-page bilingual (EN/PT) landing for a cleaning business in Fall River, MA. All CTAs go to WhatsApp. Language auto-detects browser locale; toggle switches all copy live.

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes showing intended look and behavior, not production code to copy directly. Recreate these designs in your target framework (Next.js, Astro, plain HTML, etc.) using its patterns and libraries.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, interactions and copy. Recreate pixel-perfectly.

## Screens / Views

### Single-page sections (top to bottom):

1. **Sticky Nav** — Logo left, EN/PT toggle + WhatsApp CTA right. Glassmorphic blur background. CTA uses candy gradient.

2. **Hero** (cream bg `#f5ead8`) — Badge pill, large heading, subtext, animated gradient WhatsApp CTA. Decorative gradient circles + floating soap bubbles. Wave SVG divider at bottom.

3. **About Bruna** (white bg) — Circle photo (drag-drop slot) left, bio text right. 2-column grid, stacks on mobile. Wave divider.

4. **Services** (cream bg) — Centered heading, 2-column grid: Residential (3 cards) / Commercial (3 cards). Each card: gradient icon (52px), title, description. White cards with hover lift. Wave divider.

5. **Service Area** (dark bg `#1a1a2e`) — 2-column: text left, town pills right. Subtle gradient overlays. Gold kicker text. Translucent pills with hover scale. Wave divider.

6. **How It Works** (white bg) — 4-column grid of numbered steps. Each step: gradient number circle, title, description. Cards with hover lift. Wave divider.

7. **Why Shine Clean** (cream bg) — 2×2 grid of differentiator cards with gradient icon circles. Hover lift. Wave divider.

8. **Testimonials** (white bg) — 3-column grid of review cards. Stars in gold. Sample reviews with note.

9. **Final CTA** (full-bleed candy gradient, animated) — Large heading, subtext, white CTA button. Floating bubbles overlay.

10. **Footer** (dark bg `#1a1a2e`) — Logo, tagline, WhatsApp/phone links, copyright.

## Interactions & Behavior
- **Language toggle**: EN/PT switch updates all text instantly (React state). Auto-detects `navigator.language`.
- **Scroll animations**: Sections fade-in + translate-up on scroll via IntersectionObserver (`.fade-in` → `.visible`).
- **Hover effects**: Service/differentiator cards lift `translateY(-4px)` + shadow increase. Town pills scale 1.06. Step items lift `translateY(-6px)`.
- **CTA gradient animation**: `background-size: 200% 200%` with `gshift` keyframe (8s ease infinite).
- **Bubble animations**: 3 keyframe variants (`bub1`, `bub2`, `bub3`) — float up/down with slight scale/rotation, 5-8s cycles, staggered delays.
- **WhatsApp links**: Deep link to `wa.me/17744760595` with prefilled message (language-dependent).
- **Analytics**: `whatsapp_click` event pushed to `dataLayer` and `gtag` on every CTA click.
- **Responsive**: All grids collapse to 1 column at ≤860px. Steps grid → 2 columns at 561-860px.

## Design Tokens

### Colors
| Token | Value |
|-------|-------|
| Background (cream) | `#f5ead8` (var(--color-bg)) |
| Text | `#201e1d` (var(--color-text)) |
| Accent (terracotta) | `#c67139` (var(--color-accent)) |
| Accent 2 (sage) | `#7a8a5e` (var(--color-accent-2)) |
| Dark sections | `#1a1a2e` |
| Candy gradient | `#FDBE02 → #EC5D89 → #8132DF` |
| Card bg | `#ffffff` |
| Card border | `rgba(0,0,0,0.06)` |
| Gold (stars/kicker) | `#FDBD36` / `#FDBE02` |

### Icon gradient pairs
| Service | Gradient |
|---------|----------|
| House Cleaning | `#FDBE02 → #FD330A` |
| Deep Cleaning | `#DF046F → #BA18B2` |
| Move In/Out | `#6EE85B → #61ECFA` |
| Office | `#2F8EFC → #0164FC` |
| Post Construction | `#EC5D89 → #8132DF` |
| Commercial | `#FC9A6A → #FB5C72` |

### Typography
| Role | Font | Size |
|------|------|------|
| Headings | Caprasimo | clamp(28px, 3.5vw, 42px) |
| Hero heading | Caprasimo | clamp(40px, 6.5vw, 72px) |
| Body | Figtree | 17px / 15px / 14.5px |
| Kickers | Figtree 600 | 13px, uppercase, 0.08em |
| Nav CTA | Caprasimo | 14px |

### Spacing & Radius
| Token | Value |
|-------|-------|
| Section padding | clamp(48px, 7vw, 80px) |
| Content max-width | 1120px |
| Card radius | 18-22px |
| Button radius | 999px (pill) |
| Icon container | 52px (services), 48px (differentiators), 58px (steps) |
| Wave divider height | 60px |

### Shadows
| Element | Shadow |
|---------|--------|
| CTA button | 0 8px 28px rgba(129,50,223,0.32) |
| Photo | 0 16px 40px rgba(0,0,0,0.1) |
| Cards | 0 2px 8px rgba(0,0,0,0.04) |
| Cards hover | 0 12px 32px rgba(0,0,0,0.1) |

## SEO / Structured Data
JSON-LD `HousekeepingService` schema is included with name, phone, area served, and all 6 service offers.

## Assets
- `LOGOBRUN-SHINECLEANNER.png` — business logo (945×908px, transparent)
- Bruna's photo — not provided yet, drag-drop placeholder in design
- All icons are inline SVGs (Lucide-style)
- Fonts: Google Fonts (Caprasimo, Figtree)

## Copy
All copy is in the `COPY` object in the JS logic, keyed by `en` and `pt`. The full bilingual copy is in the source file.

## Files
- `Shine Clean Specialist v2.dc.html` — the complete design prototype
- `image-slot.js` — drag-drop image placeholder component
- `_ds/` — Organic design system (tokens, styles)
