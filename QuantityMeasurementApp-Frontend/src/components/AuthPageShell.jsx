import './Auth.css';


export default function AuthPageShell({ children }) {
  return (
    <div className="auth-page page-shell">
      <aside className="auth-visual">
        <div className="auth-visual-mesh" aria-hidden />
        <div className="auth-visual-orb auth-visual-orb--a" aria-hidden />
        <div className="auth-visual-orb auth-visual-orb--b" aria-hidden />
        <img
          className="auth-visual-img"
          src="photo1.png"
          alt=""
          width={800}
          height={1000}
          decoding="async"
        />
      </aside>

      <div className="auth-form-column">{children}</div>
    </div>
  )
}
