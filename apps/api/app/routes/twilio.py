from fastapi import APIRouter, Request, Response

router = APIRouter(tags=["Twilio"])

ALLOWED_HOSTS = {
    "voiceshield-sih-2026.onrender.com",
    "voiceshield.logicintelligencetechnologies.in",
    "localhost:8000",
    "127.0.0.1:8000",
}
DEFAULT_HOST = "voiceshield-sih-2026.onrender.com"


@router.post("/voice")
async def twilio_voice(request: Request):
    """
    Webhook endpoint for Twilio incoming calls.
    Returns TwiML instructing Twilio to open a Media Stream WebSocket.
    """
    raw_host = request.headers.get("host", "").split(",")[0].strip()
    if (
        raw_host in ALLOWED_HOSTS
        or raw_host.endswith(".onrender.com")
        or raw_host.endswith(".logicintelligencetechnologies.in")
    ):
        host = raw_host
    else:
        host = DEFAULT_HOST

    # Determine scheme. If behind a proxy or in production, use wss://; localhost uses ws://
    scheme = "ws" if ("localhost" in host or "127.0.0.1" in host) else "wss"
    ws_url = f"{scheme}://{host}/ws/twilio"

    twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Aditi">Welcome to the Voice Shield Security Center. Your audio is now being monitored by our AI cloning detection systems in real time.</Say>
    <Connect>
        <Stream url="{ws_url}" />
    </Connect>
    <Pause length="40" />
</Response>"""
    
    return Response(content=twiml, media_type="application/xml")
