import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Calculator from './pages/Calculator'
import History from './pages/History'
import AuthCallback from './pages/AuthCallback'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/calculator" replace />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="auth/callback" element={<AuthCallback />} />
            <Route path="calculator" element={<Calculator />} />
            <Route
              path="history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/calculator" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
