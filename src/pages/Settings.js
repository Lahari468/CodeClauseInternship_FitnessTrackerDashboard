"use client"

import { useState, useEffect } from "react"

const Settings = ({ darkMode, setDarkMode }) => {
  const [settings, setSettings] = useState({
    units: "metric",
    weekStart: "monday",
    dataRetention: "365",
    autoBackup: false,
    workoutReminder: true,
    reminderTime: "09:00",
    defaultWorkoutDuration: 30,
    showWorkoutCalendar: true
  })

  const [dataCounts, setDataCounts] = useState({
    activities: 0,
    meals: 0,
    sleepData: 0,
    heartRateData: 0,
    profile: 0,
    scheduledWorkouts: 0
  })

  useEffect(() => {
    const savedSettings = localStorage.getItem("appSettings")
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings)
      // Exclude darkMode from settings since it's managed by App
      const { darkMode: _, ...rest } = parsedSettings
      setSettings(rest)
    }
    updateDataCounts()
  }, [])

  const updateDataCounts = () => {
    setDataCounts({
      activities: JSON.parse(localStorage.getItem("activities") || "[]").length,
      meals: JSON.parse(localStorage.getItem("meals") || "[]").length,
      heartRateData: JSON.parse(localStorage.getItem("heartRateData") || "[]").length,
      profile: Object.keys(JSON.parse(localStorage.getItem("profile") || "{}")).length,
      scheduledWorkouts: JSON.parse(localStorage.getItem("scheduledWorkouts") || "[]").length
    })
  }

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    localStorage.setItem("appSettings", JSON.stringify({ ...newSettings, darkMode }))
  }

  const exportData = () => {
    const data = {
      activities: JSON.parse(localStorage.getItem("activities") || "[]"),
      meals: JSON.parse(localStorage.getItem("meals") || "[]"),
      heartRateData: JSON.parse(localStorage.getItem("heartRateData") || "[]"),
      profile: JSON.parse(localStorage.getItem("profile") || "{}"),
      scheduledWorkouts: JSON.parse(localStorage.getItem("scheduledWorkouts") || "[]"),
      settings: { ...settings, darkMode },
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `fitness-tracker-data-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
  }

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Customize your fitness tracker experience</p>
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <h3>Appearance</h3>
          <div className="setting-item">
            <div className="setting-info">
              <label>Dark Mode</label>
              <p>Switch between light and dark themes</p>
            </div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={toggleDarkMode}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>Preferences</h3>
          <div className="setting-item">
            <div className="setting-info">
              <label>Units</label>
              <p>Choose your preferred measurement system</p>
            </div>
            <div className="setting-control">
              <select 
                value={settings.units} 
                onChange={(e) => handleSettingChange("units", e.target.value)}
              >
                <option value="metric">Metric (kg, cm, km)</option>
                <option value="imperial">Imperial (lbs, ft, miles)</option>
              </select>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label>Week Starts On</label>
              <p>Choose the first day of your week</p>
            </div>
            <div className="setting-control">
              <select 
                value={settings.weekStart} 
                onChange={(e) => handleSettingChange("weekStart", e.target.value)}
              >
                <option value="sunday">Sunday</option>
                <option value="monday">Monday</option>
              </select>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>Data Management</h3>
          <div className="setting-item">
            <div className="setting-info">
              <label>Data Retention</label>
              <p>How long to keep your fitness data</p>
            </div>
            <div className="setting-control">
              <select
                value={settings.dataRetention}
                onChange={(e) => handleSettingChange("dataRetention", e.target.value)}
              >
                <option value="30">30 days</option>
                <option value="90">90 days</option>
                <option value="365">1 year</option>
                <option value="forever">Forever</option>
              </select>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label>Auto Backup</label>
              <p>Automatically backup data to browser storage</p>
            </div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.autoBackup}
                  onChange={(e) => handleSettingChange("autoBackup", e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>Data Actions</h3>
          <div className="data-actions">
            <button className="btn-secondary" onClick={exportData}>
              <i className="fas fa-download"></i>
              Export Data
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h3>About</h3>
          <div className="about-info">
            <div className="app-info">
              <h4>Fitness Tracker Dashboard</h4>
              <p>Version 1.0.0</p>
              <p>Built with React, Bootstrap, and Chart.js</p>
            </div>
            <div className="storage-info">
              <h4>Storage Usage</h4>
              <p>Activities: {dataCounts.activities} entries</p>
              <p>Meals: {dataCounts.meals} entries</p>
              <p>Heart Rate: {dataCounts.heartRateData} entries</p>
              <p>Workouts: {dataCounts.scheduledWorkouts} scheduled</p>
              <p>Profile: {dataCounts.profile > 0 ? "Saved" : "Not saved"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings