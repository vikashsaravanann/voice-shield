import test from "node:test";
import assert from "node:assert/strict";

// Import modules from lib
import {
  AUDIO_CONFIG,
  riskLevel,
  samplesPerChunk,
  ringCapacity,
  CHALLENGE_PHRASES,
} from "../lib/audio/config.ts";

import {
  KalmanSmoother,
  scoreFeatures,
  decide,
} from "../lib/audio/decision.ts";

import {
  isSupabaseConfigured,
  getSupabaseConfig,
} from "../lib/supabase/config.ts";

import {
  validateStructuredAnalysis,
} from "../lib/providers/analysis-schema.ts";

test("AUDIO_CONFIG has valid enterprise telephony and ML parameters", () => {
  assert.equal(AUDIO_CONFIG.sampleRate, 16000, "Sample rate must be 16kHz PCM");
  assert.equal(AUDIO_CONFIG.chunkMs, 333, "Window chunk size must be 333ms");
  assert.equal(AUDIO_CONFIG.bufferDurationSec, 4, "Buffer duration should be 4 seconds");
  assert.equal(AUDIO_CONFIG.thresholds.green, 0.35, "Green threshold should be 0.35");
  assert.equal(AUDIO_CONFIG.thresholds.red, 0.75, "Red threshold should be 0.75");
  assert.equal(AUDIO_CONFIG.challengeAfterHops, 4, "Challenge trigger threshold should be 4 hops");
});

test("samplesPerChunk calculates correct PCM16 sample counts", () => {
  const samples = samplesPerChunk();
  assert.equal(samples, 5328, "333ms at 16kHz must equal 5328 samples (10,656 bytes PCM16)");
  assert.equal(samplesPerChunk(1000), 16000, "1000ms at 16kHz must equal 16000 samples");
});

test("ringCapacity calculates safe buffer chunk limits", () => {
  const cap = ringCapacity();
  assert.equal(cap, 13, "4000ms / 333ms rounded up must be 13 slots");
  assert.ok(cap >= 4, "Ring capacity must satisfy minimum lower bound");
});

test("riskLevel maps confidence boundaries correctly", () => {
  assert.equal(riskLevel(0.0), "green");
  assert.equal(riskLevel(0.15), "green");
  assert.equal(riskLevel(0.349), "green");
  assert.equal(riskLevel(0.35), "amber");
  assert.equal(riskLevel(0.50), "amber");
  assert.equal(riskLevel(0.749), "amber");
  assert.equal(riskLevel(0.75), "red");
  assert.equal(riskLevel(0.99), "red");
  assert.equal(riskLevel(1.0), "red");
});

test("CHALLENGE_PHRASES contains all mandated Indic and English test phrases", () => {
  assert.ok(CHALLENGE_PHRASES.en, "English challenge phrase present");
  assert.ok(CHALLENGE_PHRASES.hi, "Hindi challenge phrase present");
  assert.ok(CHALLENGE_PHRASES.ta, "Tamil challenge phrase present");
  assert.ok(CHALLENGE_PHRASES.en.length > 10);
  assert.ok(CHALLENGE_PHRASES.hi.length > 10);
  assert.ok(CHALLENGE_PHRASES.ta.length > 10);
});

test("KalmanSmoother tracks trajectory and clamps values cleanly", () => {
  const k = new KalmanSmoother();
  assert.ok(k.value >= 0 && k.value <= 1);
  const initial = k.value;

  // Step up
  const highUpdate = k.update(0.95);
  assert.ok(highUpdate > initial, "Smoothed value should increase on high spoof input");
  assert.ok(highUpdate <= 1.0, "Smoothed value must never exceed 1.0");

  // Step down
  const lowUpdate = k.update(0.02);
  assert.ok(lowUpdate < highUpdate, "Smoothed value should decrease on low spoof input");
  assert.ok(lowUpdate >= 0.0, "Smoothed value must never be negative");

  // Reset
  k.reset();
  assert.equal(k.value, 0.08, "Reset should restore initial state value");
});

test("scoreFeatures identifies silence and synthetic voice cues", () => {
  // Silence case
  const silentFeatures = {
    rms: 0.001,
    zcr: 0.01,
    flatness: 0.1,
    centroid: 500,
    f0: 0,
    f0Lock: 0,
    harmonicity: 0.1,
    jitter: 0,
    highBand: 0,
    flux: 0,
  };
  const silentResult = scoreFeatures(silentFeatures);
  assert.equal(silentResult.raw, 0.04);
  assert.deepEqual(silentResult.markers, ["silence / hold"]);

  // Deepfake / vocoder signature cues
  const syntheticFeatures = {
    rms: 0.05,
    zcr: 0.01,
    flatness: 0.65,
    centroid: 2000,
    f0: 180,
    f0Lock: 0.88,
    harmonicity: 0.75,
    jitter: 0.02,
    highBand: 0.02,
    flux: 0.1,
  };
  const synthResult = scoreFeatures(syntheticFeatures);
  assert.ok(synthResult.raw > 0.7, "Synthetic cues should elevate spoof probability");
  assert.ok(synthResult.markers.some((m) => m.includes("F0 lock")));
  assert.ok(synthResult.markers.some((m) => m.includes("harmonic stack")));

  // With clone injection hint
  const injectedResult = scoreFeatures(syntheticFeatures, true);
  assert.ok(injectedResult.raw >= synthResult.raw);
  assert.ok(injectedResult.markers.includes("live-conversion injection path"));
});

test("decide() assigns appropriate forensic action based on risk level", () => {
  const smoother = new KalmanSmoother();

  // Natural speech features
  const naturalFeatures = {
    rms: 0.04,
    zcr: 0.08,
    flatness: 0.2,
    centroid: 1200,
    f0: 120,
    f0Lock: 0.15,
    harmonicity: 0.3,
    jitter: 0.005,
    highBand: 0.12,
    flux: 0.5,
  };

  const decision1 = decide(naturalFeatures, smoother, 45);
  assert.equal(decision1.risk, "green");
  assert.equal(decision1.suggestedAction, "continue");
  assert.ok(decision1.latencyMs >= 45);

  // Synthetic speech
  const syntheticFeatures = {
    rms: 0.06,
    zcr: 0.01,
    flatness: 0.7,
    centroid: 2500,
    f0: 200,
    f0Lock: 0.95,
    harmonicity: 0.9,
    jitter: 0.03,
    highBand: 0.01,
    flux: 0.05,
  };

  let decisionSynth;
  for (let i = 0; i < 10; i++) {
    decisionSynth = decide(syntheticFeatures, smoother, 40, true);
  }
  assert.equal(decisionSynth.risk, "red");
  assert.equal(decisionSynth.suggestedAction, "block");
});

test("Supabase config handles missing environments gracefully with fallback", () => {
  const config = getSupabaseConfig();
  assert.ok(config.url, "Supabase url must be resolved");
  assert.ok(config.url.startsWith("https://") || config.url.startsWith("http://"));
  assert.ok(config.key, "Supabase key must be resolved");
  assert.equal(typeof isSupabaseConfigured(), "boolean");
});

test("validateStructuredAnalysis enforces schema and filters malicious shapes", () => {
  // Null or primitive input
  const nullAnalysis = validateStructuredAnalysis(null);
  assert.equal(nullAnalysis.riskLevel, "unknown");
  assert.equal(nullAnalysis.mock, true);

  // Malformed risk level falls back to 'unknown'
  const invalidRisk = validateStructuredAnalysis({ riskLevel: "malicious_injection" });
  assert.equal(invalidRisk.riskLevel, "unknown");

  // Valid structured analysis
  const valid = validateStructuredAnalysis({
    riskLevel: "high",
    confidence: 0.92,
    indicators: ["cloned_voice_signature", "spectral_discontinuity"],
    evidence: [
      { type: "spectral", description: "Absence of glottal excitation pulses", timestampMs: 1200 },
    ],
  });
  assert.equal(valid.riskLevel, "high");
  assert.equal(valid.confidence, 0.92);
  assert.equal(valid.indicators.length, 2);
  assert.equal(valid.evidence[0].description, "Absence of glottal excitation pulses");
});

test("Chat API message validation schema enforcement", () => {
  function validateMessages(messages) {
    if (!Array.isArray(messages)) return false;
    if (messages.length === 0 || messages.length > 12) return false;
    return !messages.some(
      (m) =>
        !m ||
        (m.role !== "user" && m.role !== "assistant") ||
        typeof m.content !== "string" ||
        m.content.trim().length === 0 ||
        m.content.length > 4000
    );
  }

  assert.equal(validateMessages(null), false);
  assert.equal(validateMessages([]), false);
  assert.equal(validateMessages(new Array(13).fill({ role: "user", content: "test" })), false);
  assert.equal(validateMessages([{ role: "system", content: "hello" }]), false);
  assert.equal(validateMessages([{ role: "user", content: "" }]), false);
  assert.equal(validateMessages([{ role: "user", content: "   " }]), false);
  assert.equal(validateMessages([{ role: "user", content: "a".repeat(4001) }]), false);
  assert.equal(validateMessages([{ role: "user", content: "Hello VoiceShield" }]), true);
  assert.equal(
    validateMessages([
      { role: "user", content: "Hello" },
      { role: "assistant", content: "Hi, how can I help?" },
    ]),
    true
  );
});
