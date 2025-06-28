"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import Dashboard from "./pages/Dashboard"
import Activities from "./pages/Activities"
import Statistics from "./pages/Statistics"
import Workouts from "./pages/Workouts"
import WorkoutSchedule from "./pages/WorkoutSchedule"
import Profile from "./pages/Profile"
import Nutrition from "./pages/Nutrition"
import HeartRate from "./pages/HeartRate"
import Settings from "./pages/Settings"
import "./App.css"

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("darkMode")
    return savedTheme !== null ? JSON.parse(savedTheme) : true
  })
  const [sidebarCollapsed] = useState(false)

  // Apply theme on initial load and when darkMode changes
  useEffect(() => {
    document.body.className = darkMode ? "dark-theme" : "light-theme"
    localStorage.setItem("darkMode", JSON.stringify(darkMode))
  }, [darkMode])

  return (
    <Router>
      <div className="app">
        <Sidebar collapsed={sidebarCollapsed} />
        <div className={`main-content ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
          <div className="content-wrapper">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/statistics" element={<Statistics />} />
              
              {/* Workout Routes */}
              <Route path="/workouts" element={<Workouts />} />
              <Route path="/workout-schedule" element={<WorkoutSchedule />} />
              
              <Route path="/profile" element={<Profile />} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/heart-rate" element={<HeartRate />} />
              <Route 
                path="/settings" 
                element={
                  <Settings 
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                  />
                } 
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
