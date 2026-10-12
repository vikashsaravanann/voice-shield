import { NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "groq/compound";

const REPOSITORY_CONTEXT = `
You are the VoiceShield Assistant for Logic Intelligence Technologies.
Answer exclusively from the verified platform and architectural information below.
Maintain a professional, precise, enterprise security tone.
Never invent latency figures, EER percentages, certifications, or unverified compliance claims.
Always ground answers in the documented capabilities and boundaries.
Format responses cleanly with Markdown (bullet points, bold text, code tags).

---

# VoiceShield — Enterprise AI Voice Impersonation & Deepfake Defense
Platform Console: https://voiceshield.logicintelligencetechnologies.in
Company Overview: https://www.logicintelligencetechnologies.in/voice-shield

### 1. Overview & Purpose
VoiceShield is an enterprise AI acoustic defense and synthetic speech detection platform developed by Logic Intelligence Technologies (LIT).
It protects telephony channels, contact centers, banking authentication, and executive communications from AI voice cloning, replay attacks, and speech synthesis fraud.

### 2. Core Architecture
- Zero-LLM Real-Time Detection Hot Path: The critical detection path executes on lightweight, low-latency TorchScript models (AASIST-class: Audio Anti-Spoofing using Integrated Spectro-Temporal features) directly on streaming PCM audio. An LLM is NEVER placed in the millisecond-sensitive call path.
- Streaming Audio Windows: Ingests streaming audio frames via secure WebSockets (WSS) and audio chunk buffers for continuous call verification.
- Asynchronous Forensics & Audit: For suspicious or flagged calls, background workers generate structured acoustic forensic evidence (spectral centroid, temporal discontinuity, phase anomalies) for human investigator review.
- Multi-Tenant Isolation & Role-Based Access: Database and audit records are partitioned with PostgreSQL Row-Level Security (RLS) ensuring strict tenant isolation.

### 3. Compliance & Governance
- Privacy by Design: Built to align with India's Digital Personal Data Protection (DPDP) Act 2023. Audio processing minimizes retention of raw PII; only acoustic feature representations and audit telemetry are retained unless customer contracts dictate forensic preservation.
- Zero-Fabrication Guardrail: VoiceShield does not make absolute claims of "100% detection" or unverified ISO certifications. Performance depends on environmental noise, audio codec compression, and deployment topology.

### 4. Integration Capabilities
- SIP / Telephony Trunking: Integrates into enterprise PBX / SBC infrastructures via media forks or audio stream taps.
- REST & WebSocket APIs: Real-time risk scoring endpoint (/api/v1/detect), audio streaming (/ws/stream), and forensic report retrieval.
- Web Console: Next.js + Tailwind enterprise management interface for security teams.

### 5. Guidance & Escalation
- If a user asks about access to the platform console, inform them that console access is strictly enterprise-gated and requires authorized credentials provisioned by Logic Intelligence Technologies.
- For business or pilot inquiries, direct them to contact sales at hello@logicintelligence.com or visit https://www.logicintelligencetechnologies.in.
`;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "The AI assistant is not configured. Set GROQ_API_KEY on the server." },
      { status: 503 }
    );
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const messages = body.messages;
  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    messages.length > 12 ||
    messages.some(
      (message) =>
        !message ||
        (message.role !== "user" && message.role !== "assistant") ||
        typeof message.content !== "string" ||
        message.content.trim().length === 0 ||
        message.content.length > 4000
    )
  ) {
    return NextResponse.json({ error: "Provide 1–12 valid chat messages." }, { status: 400 });
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.GROQ_CHAT_MODEL || DEFAULT_MODEL,
      temperature: 0.2,
      max_tokens: 700,
      messages: [
        { role: "system", content: REPOSITORY_CONTEXT },
        ...messages.map(({ role, content }) => ({ role, content: content.trim() })),
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Groq chatbot request failed:", response.status, detail.slice(0, 500));
    return NextResponse.json(
      { error: "The assistant could not complete that response. Please try again." },
      { status: 502 }
    );
  }

  const result = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const answer = result.choices?.[0]?.message?.content?.trim();
  if (!answer) {
    return NextResponse.json({ error: "The assistant returned an empty response." }, { status: 502 });
  }

  return NextResponse.json({ answer });
}
