"use client"

import "./App.css"
import SchedulingDashboard from "./pages/SchedulingDashboard"
import DisplayPanel from "./pages/DisplayPanel"
import LoginPage from "./pages/LoginPage"
import { AuthProvider, useAuth } from "@/components/AuthContext"
import { useState } from "react"

type AppView = "dashboard" | "display"

// Componente interno que usa o contexto
function AppContent() {
  const { isAuthenticated, user, logout } = useAuth()
  const [currentView, setCurrentView] = useState<AppView>("dashboard")

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return (
    <div className="app">
      {currentView === "dashboard" && (
        <SchedulingDashboard
          onNavigate={() => setCurrentView("display")}
          onLogout={logout}
          currentUser={user?.email || ""}
        />
      )}
      {currentView === "display" && (
        <DisplayPanel
          onNavigate={() => setCurrentView("dashboard")}
          onLogout={logout}
          currentUser={user?.email || ""}
        />
      )}
    </div>
  )
}

// Componente principal que fornece o contexto
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App