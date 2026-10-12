import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Default certified baseline
      return NextResponse.json({
        zeroPersistence: true,
        sec65bEnabled: true,
        isolateDemo: true,
        retentionDays: 30,
        kalmanSensitivity: 85,
        source: "baseline",
      });
    }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("alert_phone_number")
      .eq("user_id", user.id)
      .maybeSingle();

    const settings = user.user_metadata?.workspace_settings || {
      zeroPersistence: true,
      sec65bEnabled: true,
      isolateDemo: true,
      retentionDays: 30,
      kalmanSensitivity: 85,
    };

    return NextResponse.json({
      ...settings,
      source: "persisted",
    });
  } catch (err) {
    return NextResponse.json({
      zeroPersistence: true,
      sec65bEnabled: true,
      isolateDemo: true,
      retentionDays: 30,
      kalmanSensitivity: 85,
      source: "fallback",
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase.auth.updateUser({
      data: {
        workspace_settings: {
          zeroPersistence: Boolean(body.zeroPersistence),
          sec65bEnabled: Boolean(body.sec65bEnabled),
          isolateDemo: Boolean(body.isolateDemo),
          retentionDays: Number(body.retentionDays) || 30,
          kalmanSensitivity: Number(body.kalmanSensitivity) || 85,
          updatedAt: new Date().toISOString(),
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to persist workspace settings" }, { status: 500 });
  }
}
