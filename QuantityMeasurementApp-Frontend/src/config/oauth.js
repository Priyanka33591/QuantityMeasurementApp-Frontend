/**
 * Google OAuth must start on the **same origin** Spring uses for the callback
 * (`/login/oauth2/code/google`). If you open `/oauth2/authorization/google` via
 * the Vite proxy on :5173, the session cookie is for :5173, but Google redirects
 * to :8080 — state/session no longer match and login fails.
 *
 * In dev, use the backend URL directly. Set VITE_API_BASE in production so this
 * matches your deployed API host.
 */
// export function getGoogleOAuthUrl() {
//   const oauthOrigin = import.meta.env.VITE_OAUTH_ORIGIN
//   if (oauthOrigin) {
//     return `${String(oauthOrigin).replace(/\/$/, '')}/oauth2/authorization/google`
//   }
//   const base = (import.meta.env.VITE_API_BASE ?? '').replace(/\/$/, '')
//   if (base) {
//     return `${base}/oauth2/authorization/google`
//   }
//   if (import.meta.env.DEV) {
//     return 'http://localhost:8080/oauth2/authorization/google'
//   }
//   return '/oauth2/authorization/google'
// }

export function getGoogleOAuthUrl() {
  return `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`;
}