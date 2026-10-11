# VoiceShield Secrets & Environment Variable Audit Report

**Audit Target:** VoiceShield Platform  
**Repository:** `/Users/vikash/lit-infrastructure/voice-shield`  
**Audit Date:** October 11, 2026  
**Auditor:** Subagent A07/A08: VoiceShield Security & Pre-Launch Lead  
**Security Classification:** Strict Confidentiality — Variable Names & Scopes Only (**ZERO SECRETS EXPOSED**)

---

## 1. Executive Certification of Secrets Hygiene

During this security audit, all configuration files, application source trees, dockerfiles, scripts, and documentation were scrutinized for exposed credentials, API keys, private tokens, or hardcoded hashes.

**Audit Findings:**
- **Zero hardcoded private keys or service tokens** were detected in any commit or source file.
- The `NEXT_PUBLIC_` prefix convention is strictly enforced: only public URLs and anonymous public keys are exposed to client JavaScript bundles.
- All high-privilege credentials (`GROQ_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `TWILIO_AUTH_TOKEN`) are strictly scoped to server-side environments.
- Fallback placeholders (`placeholder-voice-shield.supabase.co`) prevent static build failures without exposing any production data.
- **Legacy Provider Decoupling:** NVIDIA NIM external keys (`NVIDIA_API_KEY`, `NGC_API_KEY`) have been completely deprecated and removed from active execution paths.

---

## 2. Comprehensive Environment Variable Inventory

| Environment Variable Name | Scope | Sensitivity Level | Required for Launch? | Where Consumed | Fallback / Behavior if Unset |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Client & Server | Public / Low | Yes (for Auth & DB) | `lib/supabase/config.ts`, `middleware.ts` | Resolves to safe mock placeholder (`https://placeholder-voice-shield.supabase.co`) to permit static prerendering. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client & Server | Public / Low | Yes (for Auth) | `lib/supabase/config.ts`, `browser.ts` | Resolves to safe placeholder string; client renders unauthenticated view. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Client & Server | Public / Low | Optional | `lib/supabase/config.ts` | Fallback alias for `NEXT_PUBLIC_SUPABASE_ANON_KEY`. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-Side Only | **CRITICAL** | Yes (Backend DB) | `apps/api/app/db/supabase.py` | Server cannot write elevated audit logs; raises clear error without logging secret. |
| `GROQ_API_KEY` | Server-Side Only | **HIGH** | Yes (AI Features) | `app/api/chat/route.ts`, `apps/api/services/nvidia_service.py` | Returns HTTP 503 on chat route; seamlessly activates local deterministic forensic summary in API backend. |
| `GROQ_CHAT_MODEL` | Server-Side Only | Low | Optional | `app/api/chat/route.ts` | Defaults to `"groq/compound"` or `"llama-3.3-70b-versatile"`. |
| `NEXT_PUBLIC_API_URL` | Client & Server | Public / Low | Optional | `lib/audioConfig.ts`, `LiveConsole.tsx` | Defaults to relative `/api` or `http://localhost:8000` in dev. |
| `NEXT_PUBLIC_WS_URL` | Client-Side Only | Public / Low | Optional | `lib/audio/streamer.ts`, `lib/audioConfig.ts` | Dynamically derives `wss://${window.location.host}/ws/audio` in production. |
| `TWILIO_ACCOUNT_SID` | Server-Side Only | Medium | Optional (Telephony) | `apps/api/app/services/telephony.py` | SIP/PSTN streaming bridge disabled; WebSocket streaming remains available. |
| `TWILIO_AUTH_TOKEN` | Server-Side Only | **HIGH** | Optional (Telephony) | `apps/api/app/services/telephony.py` | Twilio inbound webhook validation disabled. |
| `TWILIO_PHONE_NUMBER` | Server-Side Only | Low | Optional (Telephony) | `apps/api/app/services/telephony.py` | Unused if Twilio integration not active. |
| `MODEL_WEIGHTS_PATH` | Server-Side Only | Low | Optional | `apps/api/app/ml/inference_engine.py` | Defaults to packaged TorchScript model `weights/aasist_ssl.pt`. |
| `PORT` | Server-Side Only | Low | Optional | `apps/api/core/config.py` | Defaults to port `8000` (FastAPI) or `3000` (Next.js). |

---

## 3. Client Bundle Verification & Leak Prevention

An automated scan of compiled Next.js output files confirmed that:
1. `process.env.GROQ_API_KEY` is never referenced in client components. The Next.js compiler replaces `process.env.*` expressions at build time; because `GROQ_API_KEY` lacks the `NEXT_PUBLIC_` prefix, it evaluates to `undefined` in browser chunks.
2. In `app/api/chat/route.ts`, error reporting from external Groq invocations sanitizes all responses, using `.slice(0, 500)` without logging request headers containing the Bearer token.
3. In `apps/api/services/nvidia_service.py`, deterministic fallbacks print sanitized status messages (`"Groq API error: ... using deterministic legal-forensic template."`) without echoing authorization headers.

---

## 4. Production Deployment Checklist for Platform Engineers

Before going live in production:
- [ ] Set `GROQ_API_KEY` in production secret manager (Vercel Environment Variables or GCP Secret Manager).
- [ ] Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` matching the sovereign Indian region Supabase instance.
- [ ] Ensure `SUPABASE_SERVICE_ROLE_KEY` is injected only into the container environment of `apps/api`.
- [ ] Verify `.env` and `.env.local` remain in `.gitignore` (confirmed present in `.gitignore`).
