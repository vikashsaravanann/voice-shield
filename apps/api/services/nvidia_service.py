# VoiceShield XAI Summary Service
# Directive §0/§4/§6D: Groq is the ONLY approved external LLM inference provider.
# Third-party providers (NVIDIA NIM, OpenAI, Anthropic, etc.) are strictly disabled and deprecated.

import os
import httpx
import structlog

logger = structlog.get_logger()

# Deprecated third-party endpoint retained as inactive constant for audit traceability
_DEPRECATED_NVIDIA_INVOKE_URL = "https://integrate.api.nvidia.com/v1/chat/completions"

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()
GROQ_INVOKE_URL = "https://api.groq.com/openai/v1/chat/completions"


def _generate_deterministic_summary(markers: dict[str, float], risk_level: str, max_risk: float) -> str:
    """Generate a reliable, legal-forensic deterministic summary without calling external LLMs."""
    hf_anomaly = markers.get("high_frequency_anomaly", 0.0)
    phase_disc = markers.get("phase_discontinuity", 0.0)
    prosody_irr = markers.get("prosody_irregularity", 0.0)

    findings = []
    if hf_anomaly >= 0.10:
        findings.append(f"neural vocoder high-frequency spectral leakage ({hf_anomaly * 100:.1f}%)")
    if phase_disc >= 0.15:
        findings.append(f"acoustic phase discontinuity indicating splice boundaries ({phase_disc * 100:.1f}%)")
    if prosody_irr >= 0.20:
        findings.append(f"synthetic prosody irregularity ({prosody_irr * 100:.1f}%)")

    evidence = "; ".join(findings) if findings else "synthetic spectral anomalies exceeding biological thresholds"
    return (
        f"FORENSIC TELEMETRY [{risk_level.upper()} RISK]: Peak spoof probability {max_risk * 100:.1f}%. "
        f"Acoustic analysis identified {evidence}. Telemetry indicates probable artificial voice injection."
    )


async def generate_nvidia_xai_summary(markers: dict[str, float], risk_level: str, max_risk: float) -> str:
    """
    Generate an XAI summary for acoustic telemetry.
    In accordance with Directive §0/§4/§6D:
    - Groq (llama-3.3-70b-versatile) is strictly the primary and sole approved external LLM inference path.
    - NVIDIA NIM external calls are fully deprecated and disabled.
    - If GROQ_API_KEY is not configured or fails, falls back safely to deterministic forensic summary.
    - No API keys or credentials are ever logged or printed.
    """
    if risk_level == "low":
        return "Acoustic telemetry aligns with natural biological human vocal tract constraints. No neural vocoder artifacts or phase anomalies detected."

    # If Groq is not configured, fall back immediately to deterministic forensic summary
    if not GROQ_API_KEY:
        logger.info("xai_summary.fallback_deterministic", reason="GROQ_API_KEY not configured; third-party external LLM calls disabled per Directive §0/§4/§6D")
        return _generate_deterministic_summary(markers, risk_level, max_risk)

    prompt = f"""
    You are an expert Cyber Forensic Audio Examiner giving a brief, authoritative summary (under 60 words).
    Based on the following acoustic telemetry, explain why this audio might contain AI-generated deepfakes or splices.
    
    Telemetry:
    - Overall Risk Level: {risk_level.upper()}
    - Peak Spoof Probability (Max Risk): {max_risk * 100:.1f}%
    - High-Frequency Anomaly (Vocoder leakage): {markers.get('high_frequency_anomaly', 0.0) * 100:.1f}% (Normal is <10%)
    - Phase Discontinuity (Splicing marker): {markers.get('phase_discontinuity', 0.0) * 100:.1f}% (Normal is <15%)
    
    Provide the explanation in a professional, legal-forensic tone. Do not use markdown.
    """

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "system", "content": "You are a cyber forensics expert."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.3,
        "max_tokens": 150
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(GROQ_INVOKE_URL, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            if "choices" in data and len(data["choices"]) > 0:
                summary = data["choices"][0]["message"]["content"].strip()
                return summary
            return _generate_deterministic_summary(markers, risk_level, max_risk)
    except Exception as e:
        logger.error("xai_summary.error", error_type=type(e).__name__, provider="groq")
        return _generate_deterministic_summary(markers, risk_level, max_risk)

