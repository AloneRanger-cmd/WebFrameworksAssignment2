// Endpoint for creating a new post//
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
  
  // Verify the access token and get the user Due to nature of the site this error is just a backup//
  const {
    data: { user },
  } = await supabase.auth.getUser(accessToken)

  if (!user) {
    return new Response('Unauthorized (invalid user)', { status: 401 })
  }

  console.log('auth uid:', user.id)

  const formData = await request.formData()
  const title = formData.get('title')?.toString()
  const content = formData.get('content')?.toString()

  if (!title || !content) {
    return new Response('Missing fields', { status: 400 })
  }
  // Insert the new post into the database//
  const { error } = await supabase.from('posts').insert({
    title,
    content,
    user_id: user.id,
    author: user.email,
  })

  if (error) {
    return new Response(error.message, { status: 500 })
  }
  return redirect("/dashboard");
}

function getAccessTokenFromCookie(request: Request) {
  const cookie = request.headers.get('cookie')
  if (!cookie) return null
  const match = cookie.match(/sb-access-token=([^;]+)/)
  return match ? match[1] : null
  
}

