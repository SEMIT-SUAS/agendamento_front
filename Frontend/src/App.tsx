"use client"

import { useState } from "react"
import "./App.css"
import SchedulingDashboard from "./pages/SchedulingDashboard"
import DisplayPanel from "./pages/DisplayPanel"

type AppView = "dashboard" | "display"

function App() {
  const [currentView, setCurrentView] = useState<AppView>("dashboard")

  return (
    <div className="app">
      {currentView === "dashboard" && <SchedulingDashboard onNavigate={() => setCurrentView("display")} />}
      {currentView === "display" && <DisplayPanel onNavigate={() => setCurrentView("dashboard")} />}
    </div>
  )
}

export default App
