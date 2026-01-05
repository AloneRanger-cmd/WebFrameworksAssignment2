// src/lib/supabase-server.ts
import { createServerClient } from '@supabase/ssr'

export function createSupabaseServerClient(request: Request) {
  return createServerClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          const cookieHeader = request.headers.get('cookie') ?? ''

          return cookieHeader
            .split(';')
            .map((c) => c.trim())
            .filter(Boolean)
            .map((c) => {
              const [name, ...rest] = c.split('=')
              return {
                name,
                value: decodeURIComponent(rest.join('=')),
              }
            })
        },
        setAll() {
          // Not needed for API routes (no session mutation)
        },
      },
    }
  )
}
