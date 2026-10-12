import json
from pathlib import Path

wf_dir = Path(__file__).resolve().parent.parent / "automation" / "n8n" / "workflows"
wf_dir.mkdir(parents=True, exist_ok=True)

VS_WORKFLOWS = [
    ("VS-001", "Risk-elevated session notification", "R1", "voice.session.risk_elevated"),
    ("VS-002", "High-severity fraud escalation", "R1", "fraud.escalation.high_severity"),
    ("VS-003", "Challenge-response failure escalation", "R1", "auth.challenge_response.failed"),
    ("VS-004", "Incident creation notification", "R1", "incident.created"),
    ("VS-005", "Incident SLA reminder", "R1", "incident.sla.warning"),
    ("VS-006", "Incident-resolution follow-up", "R1", "incident.resolved.followup"),
    ("VS-007", "Forensic export readiness", "R3", "forensic.export.ready"),
    ("VS-008", "Tamper/hash mismatch alert", "R3", "security.hash_mismatch.detected"),
    ("VS-009", "Voiceprint consent expiry", "R3", "consent.voiceprint.expiring"),
    ("VS-010", "Telephony outage", "R1", "telephony.provider.outage"),
    ("VS-011", "Inference model drift", "R1", "inference.model.drift_detected"),
    ("VS-012", "Stream reconnect failure", "R1", "stream.telephony.reconnect_failed"),
    ("VS-013", "Webhook delivery failure", "R1", "webhook.delivery.failed"),
    ("VS-014", "API key rotation reminder", "R3", "auth.api_key.rotation_due"),
    ("VS-015", "Operator invitation review", "R3", "operator.invitation.review"),
    ("VS-016", "Suspicious operator sign-in", "R3", "security.operator.suspicious_signin"),
    ("VS-017", "Retention deletion task", "R3", "retention.records.deletion_due"),
    ("VS-018", "Incident summary", "R1", "incident.daily.summary"),
    ("VS-019", "Telephony consent task", "R3", "consent.telephony.audit_task"),
    ("VS-020", "Service performance report", "R1", "service.telephony.performance_report"),
]

for code, title, risk, event_type in VS_WORKFLOWS:
    workflow = {
        "name": f"{code}: {title}",
        "nodes": [
            {
                "parameters": {
                    "httpMethod": "POST",
                    "path": code.lower(),
                    "options": {"rawBody": True}
                },
                "id": f"{code.lower()}-trigger",
                "name": "Webhook Trigger",
                "type": "n8n-nodes-base.webhook",
                "typeVersion": 2,
                "position": [100, 300]
            },
            {
                "parameters": {
                    "jsCode": (
                        "const crypto = require('crypto');\n\n"
                        "const headers = $input.first().json.headers || {};\n"
                        "const signatureHeader = headers['x-lit-signature'] || headers['X-LIT-Signature'] || '';\n"
                        "const timestampHeader = headers['x-lit-timestamp'] || headers['X-LIT-Timestamp'] || '';\n"
                        "const eventIdHeader = headers['x-lit-event-id'] || headers['X-LIT-Event-ID'] || '';\n"
                        "const rawBody = $input.first().json.rawBody || JSON.stringify($input.first().json.body || {});\n\n"
                        "if (!signatureHeader || !timestampHeader || !eventIdHeader) {\n"
                        "  throw new Error('HMAC verification failed: Missing required LIT security headers (X-LIT-Signature, X-LIT-Timestamp, X-LIT-Event-ID)');\n"
                        "}\n\n"
                        "const now = Math.floor(Date.now() / 1000);\n"
                        "const timestamp = parseInt(timestampHeader, 10);\n"
                        "if (isNaN(timestamp) || Math.abs(now - timestamp) > 300) {\n"
                        "  throw new Error(`HMAC verification failed: Timestamp tolerance exceeded (diff: ${Math.abs(now - timestamp)}s > 300s)`);\n"
                        "}\n\n"
                        "const secret = $env.N8N_WEBHOOK_SECRET;\n"
                        "if (!secret || typeof secret !== 'string' || secret.trim().length === 0) {\n"
                        "  throw new Error('HMAC verification failed: N8N_WEBHOOK_SECRET environment variable is missing or empty (fail-closed)');\n"
                        "}\n\n"
                        "const expectedSignature = 'v1=' + crypto\n"
                        "  .createHmac('sha256', secret)\n"
                        "  .update(`${timestamp}.${eventIdHeader}.${rawBody}`)\n"
                        "  .digest('hex');\n\n"
                        "const sigBuffer = Buffer.from(signatureHeader);\n"
                        "const expBuffer = Buffer.from(expectedSignature);\n"
                        "if (sigBuffer.length !== expBuffer.length || !crypto.timingSafeEqual(sigBuffer, expBuffer)) {\n"
                        "  throw new Error('HMAC verification failed: Invalid cryptographic signature');\n"
                        "}\n\n"
                        "const body = typeof $input.first().json.body === 'object' ? $input.first().json.body : JSON.parse(rawBody);\n\n"
                        "return [{\n"
                        "  json: {\n"
                        "    verified: true,\n"
                        "    event_id: eventIdHeader,\n"
                        "    timestamp: timestamp,\n"
                        "    payload: body\n"
                        "  }\n"
                        "}];"
                    )
                },
                "id": f"{code.lower()}-hmac",
                "name": "HMAC SHA-256 Verification",
                "type": "n8n-nodes-base.code",
                "typeVersion": 2,
                "position": [320, 300]
            },
            {
                "parameters": {
                    "jsCode": (
                        "// Zero-Raw-Audio, Zero-Biometric-Embedding, Zero-PHI Boundary Assertion\n"
                        "const PROHIBITED_KEYS = [\n"
                        "  'raw_audio', 'audio_chunk', 'pcm_data', 'voiceprint', 'biometric_embedding',\n"
                        "  'spectrogram', 'waveform', 'phone_number', 'patient', 'clinical_notes',\n"
                        "  'mrn', 'ssn', 'aadhaar', 'auth_token', 'password_hash'\n"
                        "];\n\n"
                        "function sanitizeCheck(obj, path = '') {\n"
                        "  if (!obj || typeof obj !== 'object') return;\n"
                        "  for (const [k, v] of Object.entries(obj)) {\n"
                        "    const currentPath = path ? `${path}.${k}` : k;\n"
                        "    if (PROHIBITED_KEYS.includes(k.toLowerCase())) {\n"
                        "      throw new Error(`Zero-Biometric/PHI Boundary Violation: Prohibited field detected at ${currentPath}`);\n"
                        "    }\n"
                        "    if (typeof v === 'object') sanitizeCheck(v, currentPath);\n"
                        "  }\n"
                        "}\n\n"
                        "const payload = $input.first().json.payload;\n"
                        "sanitizeCheck(payload);\n\n"
                        "return [{\n"
                        "  json: {\n"
                        "    ...$input.first().json,\n"
                        "    sanitized: true\n"
                        "  }\n"
                        "}];"
                    )
                },
                "id": f"{code.lower()}-boundary-guard",
                "name": "Zero-Biometric & Privacy Guard",
                "type": "n8n-nodes-base.code",
                "typeVersion": 2,
                "position": [540, 300]
            },
            {
                "parameters": {
                    "method": "POST",
                    "url": "https://api.voiceshield.logicintelligencetechnologies.in/api/v1/internal/ops/action",
                    "sendHeaders": True,
                    "headerParameters": {
                        "parameters": [
                            {"name": "Content-Type", "value": "application/json"},
                            {"name": "X-LIT-Workflow-Code", "value": code}
                        ]
                    },
                    "sendBody": True,
                    "bodyParameters": {
                        "parameters": [
                            {"name": "workflow_code", "value": code},
                            {"name": "event_type", "value": event_type},
                            {"name": "risk_tier", "value": risk},
                            {"name": "event_id", "value": "={{$node['HMAC SHA-256 Verification'].json['event_id']}}"},
                            {"name": "payload", "value": "={{$node['Zero-Biometric & Privacy Guard'].json['payload']}}"}
                        ]
                    }
                },
                "id": f"{code.lower()}-action",
                "name": "Action Integration",
                "type": "n8n-nodes-base.httpRequest",
                "typeVersion": 4.2,
                "position": [760, 300]
            },
            {
                "parameters": {
                    "method": "POST",
                    "url": "=https://api.voiceshield.logicintelligencetechnologies.in/api/v1/admin-outbox/events/{{$node['HMAC SHA-256 Verification'].json['event_id']}}/callback",
                    "sendHeaders": True,
                    "headerParameters": {
                        "parameters": [
                            {"name": "Content-Type", "value": "application/json"}
                        ]
                    },
                    "sendBody": True,
                    "bodyParameters": {
                        "parameters": [
                            {"name": "workflow_code", "value": code},
                            {"name": "status", "value": "DELIVERED"},
                            {"name": "execution_id", "value": "={{$execution.id}}"}
                        ]
                    }
                },
                "id": f"{code.lower()}-callback",
                "name": "Authoritative Callback",
                "type": "n8n-nodes-base.httpRequest",
                "typeVersion": 4.2,
                "position": [980, 300]
            }
        ],
        "connections": {
            "Webhook Trigger": {
                "main": [[{"node": "HMAC SHA-256 Verification", "type": "main", "index": 0}]]
            },
            "HMAC SHA-256 Verification": {
                "main": [[{"node": "Zero-Biometric & Privacy Guard", "type": "main", "index": 0}]]
            },
            "Zero-Biometric & Privacy Guard": {
                "main": [[{"node": "Action Integration", "type": "main", "index": 0}]]
            },
            "Action Integration": {
                "main": [[{"node": "Authoritative Callback", "type": "main", "index": 0}]]
            }
        },
        "active": False,
        "settings": {"executionOrder": "v1"},
        "meta": {
            "workflowCode": code,
            "title": title,
            "riskClass": risk,
            "eventType": event_type,
            "zeroPhiCertified": True,
            "zeroBiometricCertified": True
        }
    }
    target_file = wf_dir / f"{code}.json"
    target_file.write_text(json.dumps(workflow, indent=2) + "\n", encoding="utf-8")

print(f"Generated {len(VS_WORKFLOWS)} VoiceShield workflows in {wf_dir}")
