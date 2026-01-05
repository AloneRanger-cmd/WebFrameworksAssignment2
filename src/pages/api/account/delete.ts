import type { APIRoute } from "astro"
import { createClient } from "@supabase/supabase-js"
import { createServerClient } from "@supabase/ssr"

export const prerender = false

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  // 1️⃣ Read access token
  const accessToken = getAccessTokenFromCookie(request)
  if (!accessToken) {
    return new Response("Unauthorized", { status: 401 })
  }

  // 2️⃣ Normal client (to identify user)
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

  // 3️⃣ SERVICE ROLE client (admin powers)
  const admin = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY
  )

  // 4️⃣ Delete user-owned data (optional but recommended)
  await admin.from("comments").delete().eq("user_id", userId)
  await admin.from("posts").delete().eq("user_id", userId)
  await admin.from("profiles").delete().eq("id", userId)

  // 5️⃣ Delete auth user
  const { error: deleteError } = await admin.auth.admin.deleteUser(userId)

  if (deleteError) {
    return new Response(deleteError.message, { status: 500 })
  }

  // 6️⃣ Clear cookies
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
