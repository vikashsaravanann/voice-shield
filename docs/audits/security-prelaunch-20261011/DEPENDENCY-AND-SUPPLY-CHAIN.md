# VoiceShield Dependency & Supply Chain Security Audit

**Audit Target:** VoiceShield Platform  
**Repository:** `/Users/vikash/lit-infrastructure/voice-shield`  
**Audit Date:** October 11, 2026  
**Auditor:** Subagent A07/A08: VoiceShield Security & Pre-Launch Lead  

---

## 1. Supply Chain Architecture Overview

VoiceShield relies on a dual-runtime architecture:
1. **Frontend / Web Tier:** Node.js 24 + Next.js 15 (React 19, TypeScript 5.9). Pinned via `package.json`.
2. **Audio ML Inference Backend:** Python 3.11 / 3.12 + FastAPI + TorchScript (PyTorch, NumPy, SciPy). Pinned via `requirements.txt`.

---

## 2. Frontend NPM Dependency Manifest

### Production Dependencies (`dependencies`)
| Package Name | Version Spec | Purpose | Threat / Exposure Profile |
| :--- | :--- | :--- | :--- |
| `@supabase/ssr` | `^0.5.2` | Server-Side Supabase Auth cookies | Low (Standard SSR Auth) |
| `@supabase/supabase-js` | `^2.49.1` | PostgreSQL database & auth client | Low |
| `clsx` | `^2.1.1` | Conditional CSS class utility | Minimal (Zero-dep) |
| `date-fns` | `^4.4.0` | Forensic timestamp formatting | Low |
| `framer-motion` | `^13.2.0` | Audio visualizer animations | Low |
| `jspdf` | `^4.2.1` | Section 65B forensic report PDF export | Low (Client-side rendering) |
| `lucide-react` | `^0.510.0` | UI icon library | Low (SVG render) |
| `next` | `^15.5.2` | Full-stack App Router framework | Monitored (Vercel LTS) |
| `react` | `^19.1.1` | Core UI engine | Low (Modern React) |
| `react-dom` | `^19.1.1` | DOM renderer | Low |
| `recharts` | `^3.10.1` | Audio frequency spectrum charting | Low |
| `tailwind-merge` | `^3.6.0` | Tailwind utility merger | Minimal (Zero-dep) |

### Development Dependencies (`devDependencies`)
- `@types/node` (`^22.16.5`), `@types/react` (`^19.1.12`), `@types/react-dom` (`^19.1.9`)
- `autoprefixer` (`^10.4.20`), `postcss` (`^8.4.49`), `tailwindcss` (`^3.4.17`)
- `eslint` (`^8.57.1`), `eslint-config-next` (`^15.5.25`), `typescript` (`^5.9.2`)

---

## 3. Vulnerability Scan & Risk Assessment

An audit execution via `npm audit --json` yielded:
- **Critical Severity Vulnerabilities:** **0 (ZERO)**
- **Runtime High Vulnerabilities:** **0**
- **Build-Time / Compiler Advisories:**
  - `postcss` / `source-map-js`: Build-time CSS parser utilities used during `next build`. Not invoked during runtime request servicing.
  - `next`: Advisory GHSA-4jqv-mc3x-m676 (SSG/ISR cache header handling in self-hosted Node environments). VoiceShield uses dynamic App Router API handlers and static client pages without attacker-controlled ISR cache tags. Recommended upgrade to Next 15.5.27+ in the next maintenance release cycle.
  - `sharp`: Optional native image compression module; not used in client runtime.

---

## 4. Python Audio Backend Dependencies (`apps/api/requirements.txt`)

| Package | Version | Justification & Risk Mitigation |
| :--- | :--- | :--- |
| `fastapi` | `>=0.110.0` | Asynchronous REST and WebSocket server. Built on Starlette. |
| `uvicorn[standard]` | `>=0.28.0` | ASGI production web server. |
| `pydantic` | `>=2.6.0` | Strict type validation for incoming JSON payloads. |
| `numpy` | `>=1.26.0` | High-performance array operations for PCM16 audio buffers. |
| `scipy` | `>=1.12.0` | Digital Signal Processing (STFT, filterbanks, pitch detection). |
| `torch` | `>=2.2.0` | TorchScript runtime for AASIST model execution. Model runs on CPU or GPU. |
| `groq` | `>=0.4.0` | Groq Python SDK for Llama 3.3 cold-loop forensic summarization. |
| `pytest` / `httpx` | `>=8.0.0` | Unit test harnesses for WebSocket and endpoint verification. |

**Third-Party Decoupling Remediation:**
In accordance with Directive §0/§4/§6D, all previous calls to `nvidia-nim` / OpenAI-compatible NVIDIA endpoints have been permanently deprecated. Groq is the sole approved external LLM provider, with full deterministic fallback (`_generate_deterministic_summary`).

---

## 5. Supply Chain Hardening Recommendations

1. **Lockfile Enforcement:** Ensure CI builds strictly run `npm ci` rather than `npm install` to enforce exact checksum resolution from `package-lock.json`.
2. **Container Image Minimization:** The production `apps/api/Dockerfile` uses multi-stage builds on `python:3.11-slim`, discarding build tooling (`gcc`, `g++`) from the final runtime container.
3. **No External CDN Scripts:** Zero `<script src="https://cdn...">` tags exist in `app/layout.tsx`. All assets and fonts are bundled or served locally.
