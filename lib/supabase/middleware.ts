import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig } from "./config";

function safeReturnTo(path: string): string {
  if (path.startsWith("/") && !path.startsWith("//")) {
    return path;
  }
  return "/app";
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });
  const { url, key } = getSupabaseConfig();

  const supabase = createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;

  // Handle Legacy Route Redirects
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    const targetUrl = request.nextUrl.clone();
    targetUrl.pathname = "/app";
    return NextResponse.redirect(targetUrl);
  }

  if (pathname === "/sandbox" || pathname.startsWith("/sandbox/")) {
    const targetUrl = request.nextUrl.clone();
    targetUrl.pathname = "/app/forensics";
    return NextResponse.redirect(targetUrl);
  }

  // Check Supabase authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Enforce authentication for private workspace (/app and /app/*)
  if (!user && (pathname === "/app" || pathname.startsWith("/app/"))) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("returnTo", safeReturnTo(pathname + request.nextUrl.search));
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
