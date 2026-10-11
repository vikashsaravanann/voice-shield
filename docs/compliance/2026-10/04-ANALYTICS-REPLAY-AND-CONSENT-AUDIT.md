# VoiceShield AI Deepfake & Anti-Spoofing SOC — Analytics, Consent & Session Replay Audit
**Project:** `voice-shield` | **Date:** 2026-10-11

## 1. Session Replay Prohibition
- **Status:** Strict prohibition: zero session replay on forensic audio, incident investigation, or SOC screens.
- **Audited SDKs:** Confirmed absent: PostHog session recording, FullStory, Hotjar, LogRocket, Microsoft Clarity, Datadog RUM replay.
- **Consent Mechanism:** Where consent banners are presented, Accept and Reject options are rendered with identical prominence, avoiding deceptive dark patterns.
