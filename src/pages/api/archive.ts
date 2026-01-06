// Endpoint to fetch all posts and comments from Supabase for archive page//

import type { APIRoute } from 'astro'
import { supabase } from '../../lib/supabase'

export const GET: APIRoute = async () => {
  // Fetch posts//
  const { data: posts, error: postsError } = await supabase
    .from('posts')
    .select('id, title, content, author, date, time')
    .order('created_at', { ascending: false })

  if (postsError) {
    return new Response(
      JSON.stringify({ error: postsError.message }),
      { status: 500 }
    )
  }

  // Fetch comments//
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
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}
