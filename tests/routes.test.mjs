import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const EXPECTED_ROUTES = [
  // Group A: Public Product & Help Pages (001-021)
  "app/page.tsx",
  "app/features/page.tsx",
  "app/how-it-works/page.tsx",
  "app/benefits/page.tsx",
  "app/use-cases/page.tsx",
  "app/threat-intel/page.tsx",
  "app/industries/page.tsx",
  "app/integrations/page.tsx",
  "app/pricing/page.tsx",
  "app/faq/page.tsx",
  "app/contact/page.tsx",
  "app/docs/page.tsx",
  "app/architecture/page.tsx",
  "app/about/page.tsx",
  "app/brief/page.tsx",
  "app/demo/page.tsx",
  "app/report/page.tsx",
  "app/security/page.tsx",
  "app/changelog/page.tsx",
  "app/compliance/page.tsx",
  "app/status/page.tsx",

  // Group B: Public Legal & Trust Pages (022-031)
  "app/privacy/page.tsx",
  "app/terms/page.tsx",
  "app/cookie-policy/page.tsx",
  "app/acceptable-use/page.tsx",
  "app/accessibility/page.tsx",
  "app/ai-limitations/page.tsx",
  "app/data-retention/page.tsx",
  "app/telephony-consent/page.tsx",
  "app/responsible-disclosure/page.tsx",
  "app/copyright/page.tsx",

  // Group C: Authentication & Onboarding (032-038)
  "app/login/page.tsx",
  "app/signup/page.tsx",
  "app/verify-email/page.tsx",
  "app/forgot-password/page.tsx",
  "app/reset-password/page.tsx",
  "app/auth/callback/route.ts",
  "app/onboarding/page.tsx",

  // Group D: Private Security Workspace (039-059)
  "app/app/page.tsx",
  "app/app/detection/page.tsx",
  "app/app/forensics/page.tsx",
  "app/app/incidents/page.tsx",
  "app/app/sessions/page.tsx",
  "app/app/voiceprints/page.tsx",
  "app/app/challenges/page.tsx",
  "app/app/telephony/page.tsx",
  "app/app/threat-map/page.tsx",
  "app/app/analytics/page.tsx",
  "app/app/reports/page.tsx",
  "app/app/alerts/page.tsx",
  "app/app/api-keys/page.tsx",
  "app/app/webhooks/page.tsx",
  "app/app/models/page.tsx",
  "app/app/audit-log/page.tsx",
  "app/app/organization/page.tsx",
  "app/app/users/page.tsx",
  "app/app/profile/page.tsx",
  "app/app/notifications/page.tsx",
  "app/app/settings/page.tsx",
];

test("59-Page Architecture Plan has all required route files present", () => {
  assert.equal(EXPECTED_ROUTES.length, 59, "Exactly 59 routes planned");
  for (const relPath of EXPECTED_ROUTES) {
    const fullPath = path.resolve(relPath);
    assert.ok(
      fs.existsSync(fullPath),
      `Route file must exist: ${relPath}`
    );
    const content = fs.readFileSync(fullPath, "utf8");
    assert.ok(
      content.length > 50,
      `Route file must not be empty: ${relPath}`
    );
  }
});

test("Private workspace routes are guarded by layout", () => {
  const workspaceLayout = path.resolve("app/app/layout.tsx");
  assert.ok(fs.existsSync(workspaceLayout), "app/app/layout.tsx must exist");
  const content = fs.readFileSync(workspaceLayout, "utf8");
  assert.ok(content.includes("PrivateAppLayout"), "Layout must mount PrivateAppLayout");
});

test("Public header and footer components exist and export valid React components", () => {
  const header = fs.readFileSync("components/layout/PublicHeader.tsx", "utf8");
  const footer = fs.readFileSync("components/layout/PublicFooter.tsx", "utf8");
  assert.ok(header.includes("export function PublicHeader"));
  assert.ok(footer.includes("export function PublicFooter"));
});
