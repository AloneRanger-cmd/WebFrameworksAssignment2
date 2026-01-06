// Endpoint to check user session and authentication status needed for dashboardAuth.js//

import type { APIRoute } from 'astro'
import { supabase } from '../../../lib/supabase'
export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const cookieHeader = request.headers.get('cookie') ?? ''

  const accessToken = cookieHeader
    .split('; ')
    .find(c => c.startsWith('sb-access-token='))
    ?.split('=')[1]

  const refreshToken = cookieHeader
    .split('; ')
    .find(c => c.startsWith('sb-refresh-token='))
    ?.split('=')[1]

  if (!accessToken || !refreshToken) {
    return new Response(
      JSON.stringify({ authenticated: false }),
      { status: 200 }
    )
  }

  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  })

  if (error || !data.session) {
    return new Response(
      JSON.stringify({ authenticated: false }),
      { status: 200 }
    )
  }

  return new Response(
    JSON.stringify({
      authenticated: true,
      user: data.session.user,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  )
}
