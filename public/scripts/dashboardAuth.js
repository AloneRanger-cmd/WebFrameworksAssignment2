// This script checks if the user is authenticated and hydrates session data on several pages for authentication - Safeguard//

async function hydrateSession() {
  try {
    const res = await fetch('/api/auth/session')
    const data = await res.json()

    if (!data.authenticated) {
      console.warn('User not authenticated')
      return
    }

    console.log('Authenticated user:', data.user)
  } catch (err) {
    console.error('Failed to hydrate session', err)
  }
}

document.addEventListener('DOMContentLoaded', hydrateSession)
