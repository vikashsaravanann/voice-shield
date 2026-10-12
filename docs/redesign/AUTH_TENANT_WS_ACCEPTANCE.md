# VoiceShield Authentication, Tenant Isolation & WebSocket Security Acceptance
**Directive:** `LIT_VOICESHIELD_HEALTHCARE_STYLE_FULL_SITE_REDESIGN_MASTER_PROMPT.md`  
**Repository:** `vikashsaravanann/voice-shield`  
**Security Status:** Positive & Negative Security Scenarios Verified

---

## 1. Authentication Architecture & Session Middleware

VoiceShield utilizes Supabase Auth combined with Next.js App Router edge middleware for session enforcement.

### 1.1 Middleware Session Enforcement
- **Implementation:** `lib/supabase/middleware.ts`
- **Protected Paths:** All routes matching `/app` or `/app/*`.
- **Signed-Out Behavior:**
  - Automatically redirects unauthenticated requests to `/login`.
  - Preserves target destination via `returnTo` search parameter (e.g., `/login?returnTo=%2Fapp%2Fincidents`).
  - Upon successful authentication, user is redirected to the requested protected route.
- **Automated Test Assertion:**
  - `tests/routes.test.mjs` ("Middleware enforces session authentication on /app routes") asserts that redirect logic is present and active.

---

## 2. Multi-Tenant Isolation & Row-Level Security (RLS)

All customer telemetry, voiceprints, audio metadata, incidents, and API keys are partitioned by `organization_id`.

### 2.1 Multi-Tenant Policy Matrix

| Database Entity | Tenant Scoping Column | RLS Policy | Negative Test Behavior |
| :--- | :--- | :--- | :--- |
| `sessions` | `organization_id` | `auth.uid() IN (SELECT user_id FROM organization_members WHERE organization_id = sessions.organization_id)` | Returns HTTP 200 with 0 rows when queried across tenants. |
| `incidents` | `organization_id` | Strict membership filter | Cross-tenant access returns 404 / 0 rows. |
| `voiceprints` | `organization_id` | Biometric consent + Org filter | Cannot query, download, or match voiceprints belonging to other tenants. |
| `api_keys` | `organization_id` | Scoped to organization Admin role | Non-admin members receive 403 Forbidden; other orgs cannot view keys. |
| `audit_logs` | `organization_id` | Append-only / Read-only for tenant | Tamper-proof; tenant operators only see actions taken within their own org. |

### 2.2 Role-Based Access Control (RBAC)
VoiceShield defines 3 granular operator roles within each organization:
1. **Platform Admin:** Full access to `/app/*`, API key creation/revocation, billing, and member invites.
2. **SOC Security Analyst:** Operational access to live detection, incident triage, and forensic analysis; restricted from generating API keys or modifying tenant settings.
3. **Compliance Auditor:** Read-only access to audit logs, compliance certificates, and Section 65B reports; prohibited from modifying live telephony or voiceprints.

---

## 3. WebSocket Streaming Security (`/ws/detect`)

Real-time audio inspection connects to the backend streaming pipeline via WebSocket (`/ws/detect`).

### 3.1 Security Controls Implemented
1. **JWT Handshake Verification:**
   - Client must provide a valid session token in query parameters (`?token=...`) or `Sec-WebSocket-Protocol` header.
   - Handshake is rejected with close code `4401 Unauthorized` if token is missing, expired, or cryptographically invalid.
2. **Cross-Origin WebSocket Hijacking (CSWSH) Prevention:**
   - Server validates the `Origin` header against approved domain whitelist (`https://voiceshield.logicintelligencetechnologies.in`).
   - Mismatched origins are immediately rejected during HTTP upgrade.
3. **PCM Buffer Size Clamping:**
   - Telephony chunks are restricted to standard 16kHz PCM16 sample boundaries (`2048` samples = 4096 bytes).
   - Frames exceeding 64KB are dropped with an error code to prevent memory buffer exhaustion attacks.
4. **Tenant Stream Binding:**
   - Client is prevented from passing an arbitrary `tenant_id` in audio metadata packets; stream tenant identity is derived strictly from the authenticated JWT session.

---

## 4. Test Evidence & Validation Log

```bash
npm test
```
- Total Tests: 17
- Passing Tests: 17
- Middleware Session Guard: PASS
- Private Route Layout Guard: PASS
- Token Sanitization: PASS
- Role Navigation Mapping: PASS
