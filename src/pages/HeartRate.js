"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { Line } from "react-chartjs-2"

const HeartRate = () => {
  const [heartRateData, setHeartRateData] = useState([])
  const [formData, setFormData] = useState({
    bpm: "",
    type: "resting",
    notes: "",
  })

  const chartRef = useRef(null)
  const hrTypes = [
    { value: "resting", label: "Resting HR", color: "#06d6a0" },
    { value: "active", label: "Active HR", color: "#f59e0b" },
    { value: "max", label: "Max HR", color: "#ef4444" },
  ]

  useEffect(() => {
    const savedHR = localStorage.getItem("heartRateData")
    if (savedHR) {
      setHeartRateData(JSON.parse(savedHR))
    }
  }, [])

  const getWeeklyData = useCallback(() => {
    const last7DaysResting = Array(7).fill(null)
    const last7DaysActive = Array(7).fill(null)
    const last7DaysMax = Array(7).fill(null)
    const today = new Date()

    heartRateData.forEach((entry) => {
      const entryDate = new Date(entry.date)
      const daysDiff = Math.floor((today - entryDate) / (1000 * 60 * 60 * 24))

      if (daysDiff >= 0 && daysDiff < 7) {
        const index = 6 - daysDiff
        if (entry.type === "resting") last7DaysResting[index] = entry.bpm
        if (entry.type === "active") last7DaysActive[index] = entry.bpm
        if (entry.type === "max") last7DaysMax[index] = entry.bpm
      }
    })

    return { last7DaysResting, last7DaysActive, last7DaysMax }
  }, [heartRateData])

  const chartData = useMemo(() => {
    const { last7DaysResting, last7DaysActive, last7DaysMax } = getWeeklyData()
    
    return {
      labels: ["6d ago", "5d ago", "4d ago", "3d ago", "2d ago", "Yesterday", "Today"],
      datasets: [
        {
          label: "Resting HR",
          data: last7DaysResting,
          borderColor: "#06d6a0",
          backgroundColor: "rgba(6, 214, 160, 0.1)",
          borderWidth: 2,
          tension: 0.4,
          spanGaps: true,
        },
        {
          label: "Active HR",
          data: last7DaysActive,
          borderColor: "#f59e0b",
          backgroundColor: "rgba(245, 158, 11, 0.1)",
          borderWidth: 2,
          tension: 0.4,
          spanGaps: true,
        },
        {
          label: "Max HR",
          data: last7DaysMax,
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          borderWidth: 2,
          tension: 0.4,
          spanGaps: true,
        }
      ],
    }
  }, [getWeeklyData])

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update()
    }
  }, [chartData])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.bpm) {
      alert("Please enter heart rate")
      return
    }

    const newEntry = {
      id: Date.now(),
      ...formData,
      bpm: Number.parseInt(formData.bpm),
      date: new Date().toISOString(),
    }

    const updatedData = [newEntry, ...heartRateData]
    setHeartRateData(updatedData)
    localStorage.setItem("heartRateData", JSON.stringify(updatedData))
    setFormData({ bpm: "", type: "resting", notes: "" })
  }

  const handleDelete = (id) => {
    const updatedData = heartRateData.filter((entry) => entry.id !== id)
    setHeartRateData(updatedData)
    localStorage.setItem("heartRateData", JSON.stringify(updatedData))
  }

  const getAverageHR = (type) => {
    const filteredData = heartRateData.filter((entry) => entry.type === type)
    if (filteredData.length === 0) return 0
    const total = filteredData.reduce((sum, entry) => sum + entry.bpm, 0)
    return Math.round(total / filteredData.length)
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: true,
        position: 'top',
        labels: {
          color: '#9ca3af',
          boxWidth: 12,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw} BPM`
          }
        }
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: { color: "#9ca3af" },
      },
      y: {
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: { color: "#9ca3af" },
        min: 40,
        max: 200,
      },
    },
  }

  const getHRZone = (bpm, type) => {
    if (type === "resting") {
      if (bpm < 60) return { zone: "Excellent", color: "#06d6a0" }
      if (bpm < 70) return { zone: "Good", color: "#10b981" }
      if (bpm < 80) return { zone: "Average", color: "#f59e0b" }
      return { zone: "Above Average", color: "#ef4444" }
    }
    return { zone: "Active", color: "#f59e0b" }
  }

  return (
    <div className="heart-rate-page">
      <div className="page-header">
        <h1>Heart Rate Monitor</h1>
        <p>Track your heart rate patterns and zones</p>
      </div>

      <div className="hr-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-heartbeat" style={{ color: "#06d6a0" }}></i>
          </div>
          <div className="stat-info">
            <h3>{getAverageHR("resting")}</h3>
            <p>Avg Resting HR</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-running" style={{ color: "#f59e0b" }}></i>
          </div>
          <div className="stat-info">
            <h3>{getAverageHR("active")}</h3>
            <p>Avg Active HR</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-chart-line" style={{ color: "#ef4444" }}></i>
          </div>
          <div className="stat-info">
            <h3>{getAverageHR("max")}</h3>
            <p>Max HR Recorded</p>
          </div>
        </div>
      </div>

      <div className="hr-content">
        <div className="hr-form-card">
          <h3>Log Heart Rate</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Heart Rate (BPM) *</label>
              <input
                type="number"
                value={formData.bpm}
                onChange={(e) => setFormData({ ...formData, bpm: e.target.value })}
                min="30"
                max="220"
                required
              />
            </div>

            <div className="form-group">
              <label>Type</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                {hrTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Notes (optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Activity, feeling, or context..."
                rows="3"
              />
            </div>

            <button type="submit" className="btn-primary">
              <i className="fas fa-plus"></i>
              Log Heart Rate
            </button>
          </form>
        </div>

        <div className="hr-chart-card">
          <div className="chart-header">
            <h3>Heart Rate Trends</h3>
            <p>Your HR over the last 7 days</p>
          </div>
          <div className="chart-container">
            <Line ref={chartRef} data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="hr-entries">
        <div className="entries-header">
          <h3>Recent Heart Rate Entries</h3>
          <span className="entries-count">{heartRateData.length} entries</span>
        </div>

        {heartRateData.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-heartbeat"></i>
            <p>No heart rate data logged yet</p>
            <span>Start monitoring your heart rate!</span>
          </div>
        ) : (
          <div className="entries-grid">
            {heartRateData.slice(0, 8).map((entry) => {
              const zone = getHRZone(entry.bpm, entry.type)
              return (
                <div key={entry.id} className="hr-entry-card">
                  <div className="entry-header">
                    <div>
                      <div className="entry-bpm" style={{ color: zone.color }}>
                        {entry.bpm} BPM
                      </div>
                      <div className="entry-type">{hrTypes.find((t) => t.value === entry.type)?.label}</div>
                    </div>
                    <button 
                      className="delete-btn" 
                      onClick={() => handleDelete(entry.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                  <div className="entry-zone" style={{ color: zone.color }}>
                    {zone.zone}
                  </div>
                  <div className="entry-date">{new Date(entry.date).toLocaleDateString()}</div>
                  {entry.notes && (
                    <div className="entry-notes">
                      <p>{entry.notes}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default HeartRate