// Endpoint for editing an existing post user only//

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

  // Parse form data//
  const formData = await request.formData()

  const post_id = formData.get("post_id")?.toString()
  const title = formData.get("title")?.toString()
  const content = formData.get("content")?.toString()

  if (!post_id || !title || !content) {
    return new Response("Missing fields", { status: 400 })
  }

  // Update the post//
  const { error } = await supabase
    .from("posts")
    .update({ title, content })
    .eq("id", Number(post_id))

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
