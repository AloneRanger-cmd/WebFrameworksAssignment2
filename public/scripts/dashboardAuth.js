// dashboardAuth.js to hydrate Supabase session from cookies So each user can access their own posts in the dashboard//

import { supabase } from "../src/lib/supabase.ts"

// Read tokens from cookies manually//
async function hydrateSession() {

    const cookies = document.cookie

    const accessToken = cookies
        .split("; ")
        .find(c => c.startsWith("sb-access-token="))
        ?.split("=")[1]

    const refreshToken = cookies
        .split("; ")
        .find(c => c.startsWith("sb-refresh-token="))
        ?.split("=")[1]

    if (!accessToken || !refreshToken) {
        console.warn("No auth cookies found")
        return
    }

// Set Supabase auth session//
    await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
    })
    console.log("Supabase session hydrated")
}
hydrateSession()
