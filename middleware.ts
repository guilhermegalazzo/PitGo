import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Skip middleware for static assets, images, etc.
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.includes('.') ||
    request.nextUrl.pathname === '/favicon.ico'
  ) {
    return supabaseResponse;
  }

  try {
    const supabaseUrl = "https://zotruzuokkvbpekiqvxd.supabase.co";
    const supabaseAnonKey = "sb_publishable_nlAIs5ltpgwOvlY2JXwFVQ_UVslba81";

    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === "your-supabase-url") {
      return supabaseResponse;
    }

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // IMPORTANT: Only check user session for authenticated routes
    const authRoutes = ['/account', '/orders', '/provider', '/admin'];
    const isAuthRoute = authRoutes.some(route => request.nextUrl.pathname.startsWith(route));

    if (isAuthRoute) {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
      }
    } else {
      // Just refresh the session in the background for other routes
      await supabase.auth.getSession();
    }

  } catch (error) {
    return supabaseResponse;
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/webhooks|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
