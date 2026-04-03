import { useCallback, useMemo, useState } from 'react'
import { AuthContext } from './auth-context.js'
import * as api from '../api/client'

export function AuthProvider({ children }) {
  const [username, setUsername] = useState(() =>
    localStorage.getItem('qma_user') || ''
  )
  const [token, setToken] = useState(() => localStorage.getItem('qma_token') || '')

  const completeOAuthLogin = useCallback((jwt, user) => {
    localStorage.setItem('qma_token', jwt)
    localStorage.setItem('qma_user', user)
    setToken(jwt)
    setUsername(user)
  }, [])

  const value = useMemo(
    () => ({
      username,
      token,
      isAuthenticated: Boolean(token),
      async login(u, p) {
        const jwt = await api.login(u, p)
        localStorage.setItem('qma_token', jwt)
        localStorage.setItem('qma_user', u)
        setToken(jwt)
        setUsername(u)
      },
      logout() {
        localStorage.removeItem('qma_token')
        localStorage.removeItem('qma_user')
        setToken('')
        setUsername('')
      },
      async signup(payload) {
        return api.signup(payload)
      },
      completeOAuthLogin,
    }),
    [username, token, completeOAuthLogin]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
