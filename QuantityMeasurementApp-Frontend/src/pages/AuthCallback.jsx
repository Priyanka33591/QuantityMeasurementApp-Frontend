import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import './AuthCallback.css'

const OAUTH_DONE_KEY = 'qma_oauth_last_token'

export default function AuthCallback() {
  const navigate = useNavigate()
  const { completeOAuthLogin } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const username = params.get('username')
    const error = params.get('error')

    if (error === 'no_email') {
      navigate('/login?error=google_no_email', { replace: true })
      return
    }
    if (error) {
      navigate(`/login?error=${encodeURIComponent(error)}`, { replace: true })
      return
    }

    if (token && username) {
      if (sessionStorage.getItem(OAUTH_DONE_KEY) === token) {
        navigate('/calculator', { replace: true })
        return
      }
      sessionStorage.setItem(OAUTH_DONE_KEY, token)
      completeOAuthLogin(token, username)
      navigate('/calculator', { replace: true })
      return
    }

    navigate('/login', { replace: true })
  }, [navigate, completeOAuthLogin])

  return (
    <div className="auth-callback">
      <div className="auth-callback-card" aria-busy="true" aria-live="polite">
        <div className="auth-callback-logo" aria-hidden>
          Q
        </div>
        <div className="auth-callback-spinner" />
        <p className="auth-callback-title">Signing you in</p>
        <p className="auth-callback-hint">Securing your session…</p>
      </div>
    </div>
  )
}
