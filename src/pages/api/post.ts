// src/pages/api/posts.ts
import { supabase } from '../../lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, content, author, date, time')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}
