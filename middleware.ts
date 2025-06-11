import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // If user is not signed in and the current path is not /auth
  // redirect the user to /auth
  if (!user && request.nextUrl.pathname !== "/auth") {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // If user is signed in and the current path is /auth
  // redirect the user to /
  if (user && request.nextUrl.pathname === "/auth") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Check if the user is trying to access admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const { data: { user: userWithRole } } = await supabase.auth.getUser();
    
    // If user is not an admin, redirect to home page
    if (!userWithRole?.user_metadata?.role || userWithRole.user_metadata.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}; 