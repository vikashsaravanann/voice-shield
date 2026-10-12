import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, organization, environment, message } = body;

    if (!name || !email || !organization) {
      return NextResponse.json(
        { error: "Name, corporate email, and organization are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid corporate email address." },
        { status: 400 }
      );
    }

    let ticketId = `TKT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    try {
      const supabase = await createClient();
      const combinedMessage = `Enterprise Consultation Request\nContact: ${name} (${organization})\nEmail: ${email}\nTelephony Environment: ${environment || "Unspecified"}\nScope: ${message || "N/A"}`;
      
      const { data, error } = await supabase.from("support_tickets").insert({
        customer_email: email.trim().toLowerCase(),
        original_message: combinedMessage,
        category: "Enterprise Consultation",
        urgency: 2,
        sentiment: "neutral",
        status: "open",
      }).select("id").single();

      if (error) throw error;
      
      if (data?.id) {
        ticketId = `TKT-${data.id.substring(0, 8).toUpperCase()}`;
        
        // Notify n8n central email orchestrator
        fetch('https://automation.logicintelligencetechnologies.in/webhook/internal/email-events/v1', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.LIT_INTERNAL_API_KEY}`,
            'x-idempotency-key': `vs-contact-${data.id}`
          },
          body: JSON.stringify({
            schema_version: 1,
            event_id: data.id,
            idempotency_key: `entity:voiceshield_contact:${data.id}`,
            entity: 'voiceshield',
            environment: process.env.NODE_ENV === 'production' ? 'production' : 'staging',
            source_service: 'voiceshield-web',
            source_record_type: 'ticket',
            source_record_id: data.id,
            notification_type: 'support_acknowledgement',
            template_key: 'voiceshield_consultation_ack',
            category: 'transactional',
            sender_pool: 'HELLO',
            recipients: [{ address: email.trim().toLowerCase(), role: 'to' }],
            safe_template_data: { name, ticketId }
          }),
          // fire and forget, outbox handles retries internally if needed, but we don't block the user
        }).catch(e => console.error("Event dispatch error:", e));
      }
    } catch (dbError) {
      console.error("VoiceShield DB Insert Error:", dbError);
      return NextResponse.json(
        { error: "System unavailable. Could not save consultation request." },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      ticketId,
      message: "Consultation request accepted. Our security engineering desk will respond within 4 business hours.",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal processing error while saving consultation request." },
      { status: 500 }
    );
  }
}
