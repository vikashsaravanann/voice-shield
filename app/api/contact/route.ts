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
      
      const { data } = await supabase.from("support_tickets").insert({
        customer_email: email.trim().toLowerCase(),
        original_message: combinedMessage,
        category: "Enterprise Consultation",
        urgency: 2,
        sentiment: "neutral",
        status: "open",
      }).select("id").single();

      if (data?.id) {
        ticketId = `TKT-${data.id.substring(0, 8).toUpperCase()}`;
      }
    } catch {
      // Graceful fallback for local/offline execution
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
