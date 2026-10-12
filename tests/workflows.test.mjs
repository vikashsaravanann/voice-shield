import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const WORKFLOWS_DIR = path.join(process.cwd(), 'automation/n8n/workflows');

test('VoiceShield: all 20 n8n workflows exist and are valid JSON', () => {
  assert.ok(fs.existsSync(WORKFLOWS_DIR), 'workflows directory must exist');

  for (let i = 1; i <= 20; i++) {
    const code = `VS-${String(i).padStart(3, '0')}`;
    const filePath = path.join(WORKFLOWS_DIR, `${code}.json`);
    assert.ok(fs.existsSync(filePath), `workflow file ${code}.json must exist`);

    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);

    assert.equal(data.active, false, `${code} must be inactive by default`);
    assert.equal(data.meta.workflowCode, code, `${code} meta.workflowCode match`);
    assert.equal(data.meta.zeroBiometricCertified, true, `${code} zeroBiometricCertified`);
    assert.equal(data.meta.zeroPhiCertified, true, `${code} zeroPhiCertified`);
    assert.equal(data.nodes.length, 5, `${code} must have exactly 5 nodes`);

    // Node 1: Webhook
    const n1 = data.nodes[0];
    assert.equal(n1.type, 'n8n-nodes-base.webhook');
    assert.equal(n1.parameters.httpMethod, 'POST');
    assert.equal(n1.parameters.path, code.toLowerCase());

    // Node 2: HMAC fail-closed + timingSafeEqual
    const n2 = data.nodes[1];
    assert.equal(n2.type, 'n8n-nodes-base.code');
    assert.ok(n2.parameters.jsCode.includes('timingSafeEqual'), `${code} must use timingSafeEqual`);
    assert.ok(n2.parameters.jsCode.includes('N8N_WEBHOOK_SECRET'), `${code} must check N8N_WEBHOOK_SECRET`);
    assert.ok(n2.parameters.jsCode.includes('fail-closed'), `${code} must fail-closed`);

    // Node 3: Zero-Biometric Guard
    const n3 = data.nodes[2];
    assert.equal(n3.type, 'n8n-nodes-base.code');
    assert.ok(n3.parameters.jsCode.includes('PROHIBITED_KEYS'), `${code} must check PROHIBITED_KEYS`);
    assert.ok(n3.parameters.jsCode.includes('raw_audio'), `${code} must prohibit raw_audio`);
    assert.ok(n3.parameters.jsCode.includes('biometric_embedding'), `${code} must prohibit biometric_embedding`);

    // Node 4: Action Integration
    const n4 = data.nodes[3];
    assert.equal(n4.type, 'n8n-nodes-base.httpRequest');

    // Node 5: Callback
    const n5 = data.nodes[4];
    assert.equal(n5.type, 'n8n-nodes-base.httpRequest');
    assert.ok(n5.parameters.url.includes('/api/v1/admin-outbox/events/'));
  }
});
