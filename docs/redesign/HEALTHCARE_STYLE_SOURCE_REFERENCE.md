# VoiceShield Healthcare-Style Design System & Source Reference
**Directive:** `LIT_VOICESHIELD_HEALTHCARE_STYLE_FULL_SITE_REDESIGN_MASTER_PROMPT.md`  
**Repository:** `vikashsaravanann/voice-shield`  
**Authoritative Read-Only Design Source:** `/Users/vikash/lit-infrastructure/lit-smart-hospital-platform`  
- `apps/landing/design.md`
- `apps/landing/src/web/styles/index.css`
- `apps/landing/src/web/components/shared.tsx`
- `apps/landing/src/web/components/sections.tsx`

---

## 1. Executive Summary & Design Foundations

The VoiceShield Healthcare-Style Redesign completely transforms VoiceShield's public marketing website and authenticated 21-route SOC private workspace to match the clean visual grammar, structured typography, generous grid spacing, and accessible components of the **LIT Smart Hospital Platform**.

While adopting the calm, authoritative healthcare aesthetic, VoiceShield retains its distinct cyber-defense, acoustic DSP, and telephony fraud detection identity. The design completely replaces dark, monolithic backgrounds with an enterprise cloud/white palette accented with structured pastel surface tones.

### Core Visual Grammar Principles
1. **Opaque Solid Surfaces:** Zero translucent glassmorphism, heavy backdrop-blur, or floating unreadable panels. All cards utilize solid backgrounds with crisp `1px` borders (`#DFE7EF` / `#CBD5E1`) and generous `16px–24px` border radii.
2. **Standard 1248px Container:** Public marketing pages adhere to `--vs-max-width: 1248px` (`.container-vs`), maintaining clean horizontal alignment across all breakpoints.
3. **Generous Vertical Spacing:** Marketing sections use standardized `80px` to `104px` vertical padding (`.section-vs`), providing calm editorial breathing room.
4. **Sticky White Header:** High-visibility `68px` sticky white navbar with a solid bottom border, accessible mega menu, and clear CTA hierarchy.
5. **Quiet 400ms Motion:** 400ms `IntersectionObserver` scroll reveals (`opacity: 0 -> 1`, `translateY: 12px -> 0`) executing once without hydration flashes, with complete bypass under `prefers-reduced-motion: reduce`.

---

## 2. Design Token Mapping: Healthcare Reference vs. VoiceShield Extensions

### 2.1 Canonical Color Tokens

| Token Variable | Hex Code | Visual Role | Contrast / WCAG AA Standard |
| :--- | :--- | :--- | :--- |
| `--vs-navy` | `#0B2545` | Deep Brand Navy (Hero headings, active states, text primary) | 14.8:1 against `#FFFFFF` |
| `--vs-blue` | `#1565C0` | Primary Healthcare Cobalt (Interactive links, brand accents) | 4.6:1 against `#FFFFFF` |
| `--vs-cloud` | `#F7F9FC` | Clean Editorial Background (Subtle section alternating band) | Baseline Surface |
| `--vs-white` | `#FFFFFF` | Pure White Surface (Cards, sticky header, modals) | Baseline Surface |
| `--vs-border` | `#DFE7EF` | Neutral Structure Line (Card borders, dividers, table rows) | Structural Division |
| `--vs-ink` | `#121826` | Deep Charcoal Body Text (High readability paragraphs) | 16.2:1 against `#FFFFFF` |
| `--vs-text-secondary`| `#52677C` | Slate Neutral Secondary (Subtitles, metadata, timestamps) | 5.8:1 against `#FFFFFF` |
| `--vs-teal` | `#1FA9A2` | Operational Accent / Verified Telemetry | 3.2:1 against `#FFFFFF` |
| `--vs-cyan` | `#45D9D2` | DSP Spectral Accent / Waveform Highlight | Accents only |

### 2.2 VoiceShield Branded Pastel Extension Palette

To express VoiceShield's multi-layered acoustic inspection without compromising enterprise clarity, 6 high-contrast pastel surface cards are registered:

| Token Name | Surface Hex | Ink Text Hex | Border Hex | Semantic Inspection Meaning |
| :--- | :--- | :--- | :--- | :--- |
| **Light Purple** | `#F1ECFF` | `#2E1065` | `#DDD6FE` | Explanatory intelligence, multi-model ensemble, ML inference |
| **Light Gold** | `#FFF4D9` | `#78350F` | `#FDE68A` | Premium editorial focus, phonetic verification, challenge phrase |
| **Warm Sandal** | `#F5E8D8` | `#7C2D12` | `#E7D5C0` | Telephony carrier ingestion, FreeSWITCH/Asterisk trunks |
| **Soft Pink** | `#FCEAF3` | `#831843` | `#FBCFE8` | Security alert policies, threat telemetry, triage flags |
| **Sky Blue** | `#E7F3FF` | `#1565C0` | `#BBDEFB` | Platform infrastructure, real-time media pipeline, latency stats |
| **Soft Green** | `#E7F7EF` | `#065F46` | `#A7F3D0` | Cryptographic Section 65B validity, court certificates, normal call |

> **Contrast Rule:** Pastel backgrounds MUST always be paired with their designated dark Ink text tokens (e.g., `#2E1065` ink on `#F1ECFF` purple surface) to ensure strict adherence to WCAG 2.2 Level AA (>= 4.5:1).

---

## 3. Typography Hierarchy & Font Independence

VoiceShield adopts the typographic hierarchy of `lit-smart-hospital-platform`:
- **Primary UI Typeface:** `Poppins`, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif.
- **Editorial Accent:** `Lora`, Georgia, serif (used strictly for short, refined editorial italics).
- **Technical & Cryptographic Data:** `JetBrains Mono`, Menlo, Monaco, Consolas, monospace.

### 3.1 Strict Privacy & Font Self-Hosting
To prevent third-party network leakage and eliminate font-blocking hydration glitches:
- **Zero External Google Fonts CDN Requests:** Removed all `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?...">` from `app/layout.tsx`.
- Font stacks are defined with robust system font fallbacks, ensuring zero network latency and complete privacy during call audio inspection.

### 3.2 Type Scale (Desktop & Mobile)

| Level | Desktop Size / Weight | Mobile Size | Line Height | Tracking |
| :--- | :--- | :--- | :--- | :--- |
| **Eyebrow** | 12px / SemiBold (600) | 11px | 16px | `0.05em` (`tracking-wider`), Uppercase |
| **Hero Title** | 56px–64px / Bold (700) | 36px–40px | 1.15 | `-0.02em` (`tracking-tight`) |
| **Section H2**| 32px–40px / Bold (700) | 26px–30px | 1.2 | `-0.02em` (`tracking-tight`) |
| **Card H3** | 18px–20px / Bold (700) | 17px–18px | 1.3 | Normal |
| **Body Large**| 18px / Normal (400) | 16px | 1.6 | Normal |
| **Body Regular**| 15px–16px / Normal (400)| 14px–15px | 1.5 | Normal |
| **Small / Meta**| 12px–13px / Medium (500)| 12px | 1.4 | Normal |
| **Technical ID**| 12px–13px / Mono (400) | 11px–12px | 1.4 | `font-mono` |

---

## 4. Spacing, Grid & Component Radius Standards

1. **8px Base Metric Grid:**
   - `p-2` (8px), `p-4` (16px), `p-6` (24px), `p-8` (32px), `p-12` (48px).
2. **Card Radii:**
   - Standard cards: `rounded-2xl` (16px) or `rounded-[20px]`.
   - Modals and major drawers: `rounded-3xl` (24px).
   - Buttons and input controls: `rounded-lg` (8px) or `rounded-xl` (12px).
   - Status pills and category chips: `rounded-full` (9999px).
3. **Touch Targets:**
   - All interactive controls (buttons, navigation items, checkboxes) enforce a minimum touch target size of `44px x 44px` for full WCAG 2.2 AA accessibility.

---

## 5. Shared Component Architecture

VoiceShield incorporates a set of reusable, production-ready components located in `components/shared/`:

### 5.1 `SectionReveal`
- File: `components/shared/SectionReveal.tsx`
- Implementation: Custom React wrapper using standard browser `IntersectionObserver`.
- Mechanics: Adds `.is-visible` on initial scroll entry. Executes once, caching visibility state.
- Graceful Degradation: If JavaScript is disabled or IntersectionObserver is unsupported, elements remain fully visible (`opacity: 1`, `transform: none`). Automatically disabled when `prefers-reduced-motion: reduce` is active.

### 5.2 `SectionHeading`
- File: `components/shared/SectionHeading.tsx`
- Implementation: Standardized section intro supporting left or centered alignment.
- Elements: Uppercase tracking-wider eyebrow badge, bold navy H2 title, and slate secondary description.

### 5.3 `PastelFeatureCard`
- File: `components/shared/PastelFeatureCard.tsx`
- Implementation: Solid opaque card with `20px` border radius supporting tones `purple`, `gold`, `sandal`, `pink`, `blue`, and `green`.
- Elements: Icon badge, category pill, title, description, and optional bottom CTA link.

---

## 6. Private SOC Layout Transformation

The authenticated `/app` layout (`components/layout/PrivateAppLayout.tsx`) was completely overhauled from a dark navy shell to an enterprise cloud workspace:
- **Sidebar Surface:** Replaced solid dark `#0B2545` with clean white (`bg-white`) bordered by `#DFE7EF`.
- **Navigation Active States:** Navy selection state (`bg-[#0B2545] text-white`) with subtle elevation.
- **Hover States:** Soft lavender hover highlight (`hover:bg-[#F1ECFF]/60 hover:text-[#0B2545]`).
- **Identity & Status:** Replaced hardcoded "Pipeline Active" with dynamic session state, authenticated operator email display, and real organization membership.
- **Mobile Navigation:** Slide-over accessible drawer with backdrop dimming and focus trap.
