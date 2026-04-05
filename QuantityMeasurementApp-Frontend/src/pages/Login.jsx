import { useLayoutEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import AuthPageShell from '../components/AuthPageShell'
import { IconGoogle, IconLock, IconUser } from '../components/AuthIcons.jsx'
import { getGoogleOAuthUrl } from '../config/oauth.js'
import './Page.css'

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/calculator'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useLayoutEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const q = params.get('error')
    if (!q) return

    const decoded = decodeURIComponent(q)
    const lower = decoded.toLowerCase()

    if (q === 'google_no_email') {
      setError('Google did not share an email. Try another Google account.')
    } else if (lower.startsWith('redirect_uri_mismatch')) {
      setError(
        'Google OAuth redirect URI mismatch. In Google Cloud Console → Credentials → your OAuth client, add this exact Authorized redirect URI: ${import.meta.env.VITE_API_BASE_URL}/login/oauth2/code/google'
      )
    } else if (lower.startsWith('invalid_client')) {
      setError(
        'OAuth client rejected (invalid_client). Check that the Google client ID and client secret in application.properties match Google Cloud Console.'
      )
    } else if (lower.startsWith('access_denied')) {
      setError('Google sign-in was cancelled.')
    } else if (lower.includes('invalid credentials')) {
      setError(
        'Google sign-in failed (often redirect URI, client secret, or session). Confirm the redirect URI in Google Console and restart the backend after changing application.properties.'
      )
    } else {
      setError(decoded)
    }

    const url = new URL(window.location.href)
    url.searchParams.delete('error')
    const next = url.pathname + (url.search || '')
    window.history.replaceState({}, '', next)
  }, [])

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username.trim(), password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthPageShell>
      <div className="auth-card">
        <header className="auth-card-header">
          <p className="auth-card-eyebrow">Account</p>
          <h1 className="auth-card-title">Log in</h1>
        </header>

        <a className="auth-google" href={getGoogleOAuthUrl()}>
          <IconGoogle />
          Continue with Google
        </a>

        <div className="auth-divider"></div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="login-user">Username</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">
                <IconUser />
              </span>
              <input
                id="login-user"
                autoComplete="username"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="login-pass">Password</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">
                <IconLock />
              </span>
              <input
                id="login-pass"
                type="password"
                autoComplete="current-password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error ? <p className="form-error">{error}</p> : null}

          <button className="btn-primary auth-submit" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="auth-switch">
          No account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </AuthPageShell>
  )
}
