import type { APIRoute } from 'astro'
import { supabase } from '../../lib/supabase'
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
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401 }
    )
  }

  const { data: sessionData, error: sessionError } =
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })

  if (sessionError || !sessionData.session) {
    return new Response(
      JSON.stringify({ error: 'Invalid session' }),
      { status: 401 }
    )
  }

  const user = sessionData.session.user

  // Fetch user's posts
  const { data: posts, error: postsError } = await supabase
    .from('posts')
    .select('id,title,content,author,date,time')
    .eq('user_id', user.id)

  if (postsError) {
    return new Response(
      JSON.stringify({ error: postsError.message }),
      { status: 500 }
    )
  }

  // Fetch comments
  const { data: comments, error: commentsError } = await supabase
    .from('comments')
    .select('content, post_id, author')
    .order('created_at', { ascending: true })

  if (commentsError) {
    return new Response(
      JSON.stringify({ error: commentsError.message }),
      { status: 500 }
    )
  }

  return new Response(
    JSON.stringify({ posts, comments }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  )
}
