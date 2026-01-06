// Endpoint to delete user account and associated data securely using Supabase//

import type { APIRoute } from "astro"
import { createClient } from "@supabase/supabase-js"
import { createServerClient } from "@supabase/ssr"

export const prerender = false

export const POST: APIRoute = async ({ request, cookies, redirect }) => {

  const accessToken = getAccessTokenFromCookie(request)
  if (!accessToken) {
    return new Response("Unauthorized", { status: 401 })
  }


  const supabase = createServerClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      cookies: {
        getAll() {
          return []
        },
        setAll() {},
      },
    }
  )

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return new Response("Unauthorized", { status: 401 })
  }

  const userId = user.id

  // Get a Supabase client with service role key for admin operations required for user deletion//
  const admin = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY
  )

  // This operation must be done in a transaction to ensure data integrity not neccesry with the cascade option in supabase bit this line is a backup//
  await admin.from("comments").delete().eq("user_id", userId)
  await admin.from("posts").delete().eq("user_id", userId)
  await admin.from("profiles").delete().eq("id", userId)

  // Delete user from auth//
  const { error: deleteError } = await admin.auth.admin.deleteUser(userId)

  if (deleteError) {
    return new Response(deleteError.message, { status: 500 })
  }

  // Clear auth cookies//
  cookies.delete("sb-access-token", { path: "/" })
  cookies.delete("sb-refresh-token", { path: "/" })

  return redirect("/")
}

function getAccessTokenFromCookie(request: Request) {
  const cookie = request.headers.get("cookie")
  if (!cookie) return null
  const match = cookie.match(/sb-access-token=([^;]+)/)
  return match ? match[1] : null
}
