# VoiceShield Responsive Visual & Layout Gallery
**Directive:** `LIT_VOICESHIELD_HEALTHCARE_STYLE_FULL_SITE_REDESIGN_MASTER_PROMPT.md`  
**Repository:** `vikashsaravanann/voice-shield`  
**Target Viewports:** Mobile (320px–390px), Tablet (768px), Desktop (1280px–1440px)

---

## 1. Breakpoint Architecture & Grid Guidelines

VoiceShield implements standard Tailwind CSS responsive breakpoints tailored to enterprise monitors and mobile devices:
- **Mobile Extra-Small (`< 640px`):** Single column linear stack, full-width touch cards, 16px page gutter (`px-4`).
- **Tablet (`768px` / `md`):** Two-column card grids, flexible topbars, auto-collapsing sidebar.
- **Desktop Standard (`1024px` / `lg`):** Persistent 260px left sidebar in SOC workspace, 3-column capability grids.
- **Desktop Wide (`1280px` / `xl`):** Standard 1248px content container (`.container-vs`), 4-column architecture grids, 32px side padding (`px-8`).

---

## 2. Viewport-by-Viewport Layout Audits

### 2.1 Mobile Viewport (320px – 390px)
- **Public Header:**
  - Compact 60px height.
  - Hamburger menu icon triggering full-height slide-over drawer with dark dimming backdrop.
  - Primary CTA ("Sign In") accessible at top of drawer.
- **Hero & Marketing Sections:**
  - Headings scale to `32px–36px` to prevent awkward single-word wrapping.
  - Capability cards stack into a single column (`grid-cols-1`).
  - Action buttons expand to full width (`w-full`) with minimum `48px` touch target height.
  - Zero horizontal scrollbar (`overflow-x: hidden` enforced on page wrapper).
- **Authentication Pages:**
  - Split-panel hero collapses; left navy branding card moves to top or is hidden on narrow screens; form card takes 100% width.
- **Private SOC Workspace:**
  - Sidebar collapses into an accessible slide-over drawer triggered by topbar menu button.
  - High-density data tables enable horizontal swipe scrolling (`overflow-x-auto`) with sticky primary columns.

### 2.2 Tablet Viewport (768px)
- **Public Header:**
  - Header expands to 68px standard height.
  - Primary navigation links display in top row with overflow items grouped under "More".
- **Marketing Grid:**
  - 2-column feature card layout (`grid-cols-2 gap-6`).
  - Architecture steps render in 2x2 grid.
- **Private SOC Workspace:**
  - Topbar contains search bar, status pill, notification bell, and operator profile.
  - Metric overview cards render in 2-column format.

### 2.3 Desktop Viewport (1280px – 1440px)
- **Public Header:**
  - Full mega-menu dropdowns with categorized links covering all public and legal destinations.
  - Status indicator pill ("Telephony Network Operational").
- **Marketing Grid:**
  - Fixed 1248px centered container (`.container-vs`).
  - 3-column capability grid (`grid-cols-3 gap-6`) and 4-column architecture pipeline (`grid-cols-4 gap-6`).
- **Private SOC Workspace:**
  - Fixed 260px enterprise white sidebar (`border-r border-[#DFE7EF]`).
  - Dynamic 12-column content grid (`grid grid-cols-12 gap-6`).
  - Real-time audio waveform canvas renders at 60fps across wide desktop canvas without layout thrashing.

---

## 3. Route Visual Breakdown & Layout Checklist

| Route Group | Desktop Layout (1440px) | Tablet Layout (768px) | Mobile Layout (375px) |
| :--- | :--- | :--- | :--- |
| **Public Home (`/`)** | 1248px container, 3-col pastel cards, 4-col pipeline | 2-col cards, full-width CTA banner | 1-col stacked cards, full-width buttons |
| **Features (`/features`)** | 3-col matrix, alternating cloud/white bands | 2-col cards with sticky category tabs | 1-col scroll, horizontal category pills |
| **Legal Pages (`/privacy`, etc.)** | 280px sticky index sidebar + 800px reading column | Top jump-link dropdown + full reading column | Full reading column with back-to-top button |
| **Login (`/login`)** | 50/50 split panel (Navy Hero + White Card) | Stacked navy header + centered form card | Single full-width card with mobile OAuth buttons |
| **SOC Overview (`/app`)** | 4-col metric tiles + 2-col chart & live feeds | 2-col metric tiles + stacked feeds | 1-col metric cards + simplified incident feed |
| **Forensic Lab (`/app/forensics`)**| Full-width dual-canvas spectrogram & anomaly heatmap| Stacked canvas with zoom controls | Tabbed view (Waveform / Spectrogram / Splicing)|
| **Model Registry (`/app/models`)** | 4-col model cards with SHA-256 copy buttons | 2-col cards with modal checksum viewer | 1-col cards with tap-to-copy hash chips |
