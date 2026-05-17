import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const { data: { session } } = await supabase.auth.getSession()
  const { data: { user } } = await supabase.auth.getUser()

  let role = 'customer'
  if (session?.access_token) {
    try {
      const payload = jwtDecode(session.access_token) as any
      role = payload.user_role || payload.app_metadata?.user_role || 'customer'
    } catch (e) {
      // ignore
    }
  }

  const url = request.nextUrl.clone()

  const redirectWithCookies = (redirectUrl: URL) => {
    const redirectResponse = NextResponse.redirect(redirectUrl)
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
    })
    return redirectResponse
  }

  // Protect /admin routes
  if (url.pathname.startsWith('/admin')) {
    if (!user) {
      url.pathname = '/login'
      return redirectWithCookies(url)
    }

    const allowedAdminRoles = ['superadmin', 'admin', 'trainer', 'blogger']
    if (!allowedAdminRoles.includes(role.toLowerCase())) {
      url.pathname = '/dashboard' // Send unauthorized users back to dashboard
      return redirectWithCookies(url)
    }
  }

  // Protect /dashboard routes
  if (url.pathname.startsWith('/dashboard')) {
    if (!user) {
      url.pathname = '/login'
      return redirectWithCookies(url)
    }
    // Anyone who is logged in (Customer, Admin, Trainer, etc.) can access /dashboard.
    // No role checks needed here.
  }

  return supabaseResponse
}
