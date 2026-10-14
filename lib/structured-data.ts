/**
 * Structured data + homepage FAQ content for VoiceShield.
 *
 * Added by the LIT Visibility Engine apply step (Phase 3). Every statement here
 * is drawn from VoiceShield's own published materials (landing page + FAQ) — no
 * invented features, numbers, or efficacy claims.
 */

export const SITE_URL = "https://voiceshield.logicintelligencetechnologies.in";

/** schema.org Organization (no @context — the <JsonLd> component adds it). */
export const ORGANIZATION_JSONLD = {
  "@type": "Organization",
  name: "VoiceShield",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  parentOrganization: {
    "@type": "Organization",
    name: "Logic Intelligence Technologies",
  },
};

/** schema.org SoftwareApplication for the product. */
export const SOFTWARE_APP_JSONLD = {
  "@type": "SoftwareApplication",
  name: "VoiceShield",
  applicationCategory: "SecurityApplication",
  operatingSystem: "Web",
  url: SITE_URL,
  description:
    "Real-time AI voice spoofing detection and telephony security platform.",
  provider: {
    "@type": "Organization",
    name: "Logic Intelligence Technologies",
  },
};

export interface Faq {
  question: string;
  answer: string;
}

/** Homepage FAQ — drawn from VoiceShield's own published FAQ content. */
export const HOMEPAGE_FAQS: Faq[] = [
  {
    question:
      "How does VoiceShield detect synthetic speech without transcribing the conversation?",
    answer:
      "VoiceShield operates directly on acoustic PCM waveforms using digital signal processing and lightweight neural classifiers. It analyzes acoustic properties inherent to synthetic vocoders — such as harmonic jitter, glottal pulse shape, and spectral phase continuity — without transcribing or interpreting conversational content.",
  },
  {
    question: "Does VoiceShield store recorded audio permanently?",
    answer:
      "No. By default audio is processed in memory for the duration of inference and is not written to disk. Where evidence retention is required by policy, audio is encrypted at rest using tenant-scoped keys.",
  },
  {
    question: "How are false positives handled on poor connections?",
    answer:
      "VoiceShield uses state-space Kalman filtering and temporal smoothing to distinguish cellular packet loss or codec compression from genuine voice-cloning signatures, escalating only when anomalies persist across continuous audio frames.",
  },
];

/** Build a schema.org FAQPage object from a list of Q&A. */
export function faqPageJsonLd(faqs: Faq[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
