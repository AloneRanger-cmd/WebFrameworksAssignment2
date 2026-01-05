// Endpoint for creating a new comments//
import type { APIRoute } from 'astro'
import { createServerClient } from '@supabase/ssr'
export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const accessToken = getAccessTokenFromCookie(request)

  if (!accessToken) {
    return new Response('Unauthorized (no token)', { status: 401 })
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

  if (!user) {
    return new Response('Unauthorized (invalid user)', { status: 401 })
  }

  console.log('auth uid:', user.id)

  const formData = await request.formData()

const content = formData.get('content')?.toString()
const post_id = formData.get('post_id')?.toString()

if (!content || !post_id) {
  return new Response("Missing fields", { status: 400 })
}


const { error } = await supabase.from('comments').insert({
  content,
  post_id: Number(post_id),
  user_id: user.id,
  author: user.email,
})


  if (error) {
    return new Response(error.message, { status: 500 })
  }
  return redirect("/");
}

function getAccessTokenFromCookie(request: Request) {
  const cookie = request.headers.get('cookie')
  if (!cookie) return null
  const match = cookie.match(/sb-access-token=([^;]+)/)
  return match ? match[1] : null
  
}

