// Standard registration API route using Supabase authentication //

export const prerender = false
import type { APIRoute } from "astro"
import { supabase } from "../../../lib/supabase"

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData()
  const email = formData.get("email")?.toString()
  const password = formData.get("password")?.toString()

  if (!email || !password) {
    return redirect("/register?error=Missing+credentials")
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return redirect(`/register?error=${encodeURIComponent(error.message)}`)
  }

  return redirect("/signin")
}
