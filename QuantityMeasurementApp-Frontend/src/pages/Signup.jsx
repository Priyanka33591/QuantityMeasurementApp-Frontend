import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import AuthPageShell from '../components/AuthPageShell'
import { IconGoogle, IconLock, IconMail, IconUser } from '../components/AuthIcons.jsx'
import { getGoogleOAuthUrl } from '../config/oauth.js'
import './Page.css'

export default function Signup() {
  const { signup, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/calculator" replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    const em = email.trim().toLowerCase()
    if (!em) {
      setError('Email is required')
      return
    }
    setLoading(true)
    try {
      const msg = await signup({
        username: username.trim(),
        password,
        email: em,
      })
      setSuccess(msg)
      setTimeout(() => navigate('/login', { replace: true }), 900)
    } catch (err) {
      setError(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthPageShell>
      <div className="auth-card">
        <header className="auth-card-header">
          <h1 className="auth-card-title">Sign up</h1>
        </header>

        <a className="auth-google" href={getGoogleOAuthUrl()}>
          <IconGoogle />
          Sign up with Google
        </a>

        <div className="auth-divider"></div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="su-user">Username</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">
                <IconUser />
              </span>
              <input
                id="su-user"
                autoComplete="username"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="su-email">Email</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">
                <IconMail />
              </span>
              <input
                id="su-email"
                type="email"
                autoComplete="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="su-pass">Password</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">
                <IconLock />
              </span>
              <input
                id="su-pass"
                type="password"
                autoComplete="new-password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={4}
              />
            </div>
          </div>

          {error ? <p className="form-error">{error}</p> : null}
          {success ? <p className="form-success">{success}</p> : null}

          <button className="btn-primary auth-submit" type="submit" disabled={loading}>
            {loading ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          Already registered? <Link to="/login">Log in</Link>
        </p>
      </div>
    </AuthPageShell>
  )
}
