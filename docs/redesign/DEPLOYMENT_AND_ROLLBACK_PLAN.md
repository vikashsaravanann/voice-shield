# VoiceShield Deployment, Verification & Rollback Procedure
**Directive:** `LIT_VOICESHIELD_HEALTHCARE_STYLE_FULL_SITE_REDESIGN_MASTER_PROMPT.md`  
**Repository:** `vikashsaravanann/voice-shield`  
**Target Domain:** `https://voiceshield.logicintelligencetechnologies.in`  
**Release Gate:** REQUIRES EXPLICIT USER APPROVAL BEFORE PRODUCTION MERGE & PROMOTION

---

## 1. Verified Infrastructure Mapping

| Component | Provider / Platform | Environment Identifiers |
| :--- | :--- | :--- |
| **Frontend Web App** | Vercel | Project ID: `prj_53MedG4EWhy7ztFbmEQ20Mf75dZM`<br>Project Name: `voice-shield`<br>Team ID: `team_mmKBzYcmZkj4Y6aELMLU3Jen` |
| **Backend API Service** | Render | Service: `voice-shield`<br>Endpoint: `https://voiceshield-sih-2026.onrender.com` |
| **Database & Auth** | Supabase | Project ID: Configured via `NEXT_PUBLIC_SUPABASE_URL`<br>Migrations: 16 applied (additive only) |
| **Automation & Outbox** | Central n8n Host | Host: `https://automation.logicintelligencetechnologies.in`<br>Status: Dormant / Pre-approved workflows only |
| **Production Domain** | Cloudflare / Vercel DNS | `https://voiceshield.logicintelligencetechnologies.in` |

---

## 2. Release & Staging Verification Checklist

Prior to triggering production deployment, the following smoke verification tests must be executed against the staging/preview deployment URL:

### 2.1 Public & Marketing Endpoint Smoke
- [ ] `GET /` -> HTTP 200 OK (Verifies sticky header, healthcare hero, pastel cards, and footer).
- [ ] `GET /features` -> HTTP 200 OK.
- [ ] `GET /how-it-works` -> HTTP 200 OK.
- [ ] `GET /pricing` -> HTTP 200 OK.
- [ ] `GET /privacy` -> HTTP 200 OK.
- [ ] `GET /terms` -> HTTP 200 OK.
- [ ] `GET /accessibility` -> HTTP 200 OK.

### 2.2 Authentication & Security Boundary Smoke
- [ ] `GET /login` -> HTTP 200 OK (Verifies healthcare split-screen layout, OAuth buttons, no console errors).
- [ ] `GET /app` (Signed Out) -> HTTP 307 / 308 Redirect to `/login?returnTo=%2Fapp`.
- [ ] `GET /app/models` (Signed Out) -> HTTP 307 / 308 Redirect to `/login?returnTo=%2Fapp%2Fmodels`.
- [ ] `GET /app/api-keys` (Signed Out) -> HTTP 307 / 308 Redirect to `/login?returnTo=%2Fapp%2Fapi-keys`.

### 2.3 Authenticated SOC Operational Smoke
- [ ] Operator login with authorized credentials succeeds.
- [ ] Sidebar renders in enterprise white with navy active indicators.
- [ ] `/app` renders dynamic session counts and truthful latency ("Awaiting Data" if no calls logged).
- [ ] `/app/models` loads successfully, displaying Conformer, Wav2Vec2, SincNet, and ECAPA-TDNN with SHA-256 checksums.
- [ ] `/app/detection` loads LiveConsole with clear "Interactive Demo" badge when disconnected from carrier trunk.
- [ ] Browser DevTools Network tab confirms ZERO calls to `fonts.googleapis.com` or `fonts.gstatic.com`.

---

## 3. Deployment Steps

```bash
# 1. Ensure all local tests and types pass
npm run typecheck
npm test
npm run build

# 2. Commit all staged files to feature branch
git add .
git commit -m "feat(redesign): complete 59-destination healthcare-style redesign and audit documentation"

# 3. Push branch to GitHub remote
git push -u origin feat/healthcare-style-redesign

# 4. Open GitHub Pull Request for peer review
# Target: main <- feat/healthcare-style-redesign
```

> **Mandatory Hold:** Do not merge PR into `main` or trigger live Vercel production deployment without explicit authorization from the repository owner.

---

## 4. Rollback Plan

In the event of an unforeseen regression or service disruption following production release:

### 4.1 Frontend Rollback (Instant)
1. **Via Vercel Dashboard / CLI:**
   - Navigate to Vercel Deployments for project `voice-shield`.
   - Locate the previous stable production deployment (commit `581f6f1`).
   - Click **Instant Rollback / Promote to Production**.
   - Propagation time: `< 10 seconds` globally via CDN edge cache invalidation.
2. **Via Git Revert:**
   ```bash
   git revert -m 1 HEAD
   git push origin main
   ```

### 4.2 Database Rollback
- No database rollbacks are required because this release introduces zero schema alterations or destructive table modifications.

### 4.3 Outbox & n8n Isolation
- n8n workflows remain decoupled and signature-verified; any unexpected payload errors fail safe to local dead-letter queue without affecting core detection.
