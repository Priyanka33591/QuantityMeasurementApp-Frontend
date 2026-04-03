import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import './Layout.css'

export default function Layout() {
  const { isAuthenticated, username, logout } = useAuth()
  const { pathname } = useLocation()
  const isAuthRoute = pathname === '/login' || pathname === '/signup'

  return (
    <div className="layout">
      <header className="layout-header">
        <Link to="/calculator" className="brand">
          <span className="brand-mark" aria-hidden>
            Q
          </span>
          <span>Quantity</span>
        </Link>
        <nav className="nav">
          <NavLink
            to="/calculator"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Calculator
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            History
          </NavLink>
          {isAuthenticated ? (
            <>
              <span className="user-pill">{username}</span>
              <button type="button" className="btn-ghost" onClick={() => logout()}>
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Log in
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Sign up
              </NavLink>
            </>
          )}
        </nav>
      </header>
      <main
        className={
          isAuthRoute
            ? 'layout-main layout-main--auth'
            : pathname === '/calculator'
              ? 'layout-main layout-main--calc'
              : pathname === '/history'
                ? 'layout-main layout-main--wide'
                : pathname === '/auth/callback'
                  ? 'layout-main layout-main--callback'
                  : 'layout-main'
        }
      >
        <Outlet />
      </main>
    </div>
  )
}
