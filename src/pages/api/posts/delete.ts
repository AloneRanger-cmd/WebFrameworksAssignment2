// Endpoint for deleting an existing post user only//

import type { APIRoute } from "astro"
import { createServerClient } from "@supabase/ssr"

export const prerender = false

export const POST: APIRoute = async ({ request, redirect }) => {
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

  const formData = await request.formData()
  const postId = formData.get("post_id")?.toString()

  if (!postId) {
    return new Response("Missing post_id", { status: 400 })
  }

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", Number(postId))

  if (error) {
    return new Response(error.message, { status: 500 })
  }

  return redirect("/dashboard")
}

function getAccessTokenFromCookie(request: Request) {
  const cookie = request.headers.get("cookie")
  if (!cookie) return null
  const match = cookie.match(/sb-access-token=([^;]+)/)
  return match ? match[1] : null
}
