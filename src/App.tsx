import "./App.css"
import { Routes, Route, Navigate } from "react-router-dom"

import SchedulingDashboard from "./pages/SchedulingDashboard"
import DisplayPanel from "./pages/DisplayPanel"
import LoginPage from "./pages/LoginPage"

import { AuthProvider, useAuth } from "@/components/AuthContext"
import CallBoardPage from "./pages/CallBoardPage"

// Rota protegida
function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" />
}

function AppRoutes() {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <Routes>
      {/* Rota pública */}
      <Route path="/telao" element={<CallBoardPage />} />

      {/* Login */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/" /> : <LoginPage />
        }
      />

      <Route path="/" element={<SchedulingDashboard />} />


      {/* Dashboard protegido */}
      {/* <Route
        path="/"
        element={
          <PrivateRoute>
            <SchedulingDashboard
              onLogout={logout}
              currentUser={user?.email || ""}
            />
          </PrivateRoute>
        }
      /> */}

      

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
