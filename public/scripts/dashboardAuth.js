async function hydrateSession() {
  try {
    const res = await fetch('/api/auth/session')
    const data = await res.json()

    if (!data.authenticated) {
      console.warn('User not authenticated')
      // Optional redirect:
      // window.location.href = '/login'
      return
    }

    console.log('Authenticated user:', data.user)
  } catch (err) {
    console.error('Failed to hydrate session', err)
  }
}

document.addEventListener('DOMContentLoaded', hydrateSession)
