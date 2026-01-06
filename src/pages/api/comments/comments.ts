// Comments API route to handle posting new comments//

import type { APIRoute } from "astro"
import { createServerClient } from "@supabase/ssr"

export const prerender = false

export const POST: APIRoute = async ({ request, redirect }) => {
  const accessToken = getAccessTokenFromCookie(request)

  // If no access token, redirect to registration user must be logged in//
  if (!accessToken) {
    return redirect(
      "/register?error=" +
        encodeURIComponent("You must be logged in to post comments")
    )
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
  } = await supabase.auth.getUser(accessToken)

  // If no access token, redirect to registration user must be logged in - Backup//
  if (!user) {
    return redirect(
      "/register?error=" +
        encodeURIComponent("You must be logged in to post comments")
    )
  }

  const formData = await request.formData()

  const content = formData.get("content")?.toString()
  const post_id = formData.get("post_id")?.toString()

  if (!content || !post_id) {
    return redirect(
      "/?error=" +
        encodeURIComponent("Missing comment content")
    )
  }

  const { error } = await supabase.from("comments").insert({
    content,
    post_id: Number(post_id),
    user_id: user.id,
    author: user.email,
  })

  if (error) {
    return redirect(
      "/?error=" +
        encodeURIComponent("Failed to post comment")
    )
  }

  return redirect("/")
}

function getAccessTokenFromCookie(request: Request) {
  const cookie = request.headers.get("cookie")
  if (!cookie) return null
  const match = cookie.match(/sb-access-token=([^;]+)/)
  return match ? match[1] : null
}
