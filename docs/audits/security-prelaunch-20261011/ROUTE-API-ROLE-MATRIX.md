# VoiceShield Route, API & Role Matrix

**Audit Target:** VoiceShield Platform  
**Repository:** `/Users/vikash/lit-infrastructure/voice-shield`  
**Audit Date:** October 11, 2026  
**Auditor:** Subagent A07/A08: VoiceShield Security & Pre-Launch Lead  

---

## 1. Role Definitions

| Role Identifier | Description | Privileges & Access Scope |
| :--- | :--- | :--- |
| **`public`** | Unauthenticated site visitor / external evaluator. | Can access marketing pages, product documentation, privacy notice, terms of service, and public evaluation demo. |
| **`evaluator`** | Anonymous or prospective customer evaluating the detection engine. | Can execute live microphone / simulated voice test runs on `/demo` and `/sandbox`. Sessions are ephemeral. |
| **`operator`** | Authenticated SecOps analyst or enterprise security officer. | Access to `/dashboard`, live telemetry streams, incident history, and forensic report generation. |
| **`admin`** | Platform administrator / sovereign infrastructure owner. | Full access including tenant key management, backend pipeline tuning, and audit log exports. |
| **`system`** | Internal backend services (FastAPI, TorchScript worker, Groq API client). | Service-level tokens only (`SUPABASE_SERVICE_ROLE_KEY`), isolated inside private VPC or backend runtime. |

---

## 2. Frontend Route Authorization Matrix

| Route Path | Allowed Roles | Auth Mechanism | Fallback / Redirection Behavior | Indexing Policy (`robots.txt`) |
| :--- | :--- | :--- | :--- | :--- |
| **`/`** | `public`, `evaluator`, `operator`, `admin` | None (Public) | N/A | `Allow: /` |
| **`/about`** | `public`, `evaluator`, `operator`, `admin` | None (Public) | N/A | `Allow: /` |
| **`/architecture`** | `public`, `evaluator`, `operator`, `admin` | None (Public) | N/A | `Allow: /` |
| **`/brief`** | `public`, `evaluator`, `operator`, `admin` | None (Public) | N/A | `Allow: /` |
| **`/dashboard`** | `operator`, `admin` | Supabase Auth Cookie (`@supabase/ssr`) | Redirect to `/login?returnUrl=/dashboard` if session missing | `Disallow: /dashboard/` |
| **`/demo`** | `public`, `evaluator`, `operator`, `admin` | None (Public Demo) | Client-side rate-limiting and mock audio stream | `Allow: /demo` |
| **`/docs`** | `public`, `evaluator`, `operator`, `admin` | None (Public) | N/A | `Allow: /docs` |
| **`/login`** | `public` (Unauthenticated) | Supabase Auth Form | If already authenticated, redirect to `/dashboard` | `Allow: /login` |
| **`/privacy`** | `public`, `evaluator`, `operator`, `admin` | None (Public) | N/A | `Allow: /privacy` |
| **`/report`** | `operator`, `admin` | Supabase Auth Cookie | In demo mode, renders simulation report; in production, requires session | `Disallow: /report/` |
| **`/sandbox`** | `public`, `evaluator`, `operator`, `admin` | None (Client DSP) | All DSP computation executed locally in WebAudio | `Allow: /sandbox` |
| **`/terms`** | `public`, `evaluator`, `operator`, `admin` | None (Public) | N/A | `Allow: /terms` |

---

## 3. API & WebSocket Endpoint Matrix

| Endpoint | Method / Protocol | Auth Level | Rate Limit | Primary Function & Provider | Fallback / Fail-Safe Mode |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`/api/chat`** | `POST` (HTTP) | Public / Rate-Limited | 10 req / min per IP | Assistant Q&A via Groq Llama 3.3 70B | Returns 503 if unconfigured; strict 400 on malformed payloads. |
| **`/health`** | `GET` (HTTP) | Public | None | Liveness & Readiness probe for container orchestrator | Returns status: `healthy`, `model_loaded: true`. |
| **`/`** | `GET` (HTTP) | Public | None | API root status banner | Returns status: `online`. |
| **`/api/challenges`** | `GET` (HTTP) | Public / Evaluator | 30 req / min per IP | Generates multilingual dynamic challenge phrases via Groq Llama 3.3 | Deterministic static challenge list in `challenge_service.py` (`hi`, `en`, `ta`). |
| **`/api/challenges/verify`** | `POST` (HTTP) | Public / Evaluator | 60 req / min per IP | Evaluates whether challenge response cleared spoof thresholds | Pure deterministic rule-based verification (`spoof_probability < 0.35`). |
| **`/api/forensics/summary`** | `POST` (HTTP) | Operator / System | 20 req / min per tenant | Generates Section 65B forensic text summary via Groq Llama 3.3 | **Deterministic legal template generator** (`_generate_deterministic_summary`). |
| **`/ws/audio`** | `WebSocket` (WSS) | Evaluator / Operator | 1 connection per session | High-speed binary PCM16 streaming (333ms hops, 5328 samples) | In-process TorchScript AASIST model; zero external cloud call. |

---

## 4. WebSocket State Transition Protocol (`/ws/audio`)

```
                 [ Client Connects ]
                          |
                          v
                 [ Send session.start ]
                          |
             +------------+------------+
             |                         |
             v                         v
     (Valid Config)            (Malformed/Missing)
             |                         |
             v                         v
     [ Receive session.ack ]     [ Close WSS 1008 ]
             |
             +<--------------------+
             |                     |
             v                     |
     [ Stream PCM16 Binary ]       |
             |                     |
             v                     |
     [ TorchScript AASIST ]        |
             |                     |
             v                     |
     [ 1D Kalman DSP Filter ]      |
             |                     |
             v                     |
     [ Emit detection.result ]     |
             |                     |
             +---------------------+
             |
             v
      [ Send session.end ]
             |
             v
       [ Disconnect ]
```

---

## 5. Security & Authorization Guarantees

1. **Zero Secret Ingress to Client:** No backend tokens or service keys are accessible to unauthenticated callers.
2. **Fail-Closed on Fraud, Fail-Open on Emergency:** High-risk financial wire interactions trigger `"block"` action, while emergency telephony directives in documentation and terms mandate explicit fail-safe bypass for 112/911 routes.
3. **Audit Log Non-Repudiation:** Forensic events generate SHA-256 session integrity digests matching BSA Section 63 requirements.
