"use client"

import { useState, useEffect } from "react"
import { Line } from "react-chartjs-2"

const Sleep = () => {
  const [sleepData, setSleepData] = useState([])
  const [formData, setFormData] = useState({
    bedtime: "",
    wakeTime: "",
    quality: "3",
    notes: "",
  })

  useEffect(() => {
    const savedSleep = localStorage.getItem("sleepData")
    if (savedSleep) {
      setSleepData(JSON.parse(savedSleep))
    }
  }, [])

  const calculateSleepDuration = (bedtime, wakeTime) => {
    const bed = new Date(`2000-01-01 ${bedtime}`)
    let wake = new Date(`2000-01-01 ${wakeTime}`)

    if (wake < bed) {
      wake = new Date(`2000-01-02 ${wakeTime}`)
    }

    const duration = (wake - bed) / (1000 * 60 * 60)
    return Math.round(duration * 10) / 10
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.bedtime || !formData.wakeTime) {
      alert("Please fill in bedtime and wake time")
      return
    }

    const duration = calculateSleepDuration(formData.bedtime, formData.wakeTime)

    const newSleepEntry = {
      id: Date.now(),
      ...formData,
      duration,
      quality: Number.parseInt(formData.quality),
      date: new Date().toISOString(),
    }

    const updatedSleep = [newSleepEntry, ...sleepData]
    setSleepData(updatedSleep)
    localStorage.setItem("sleepData", JSON.stringify(updatedSleep))

    setFormData({ bedtime: "", wakeTime: "", quality: "3", notes: "" })
  }

  const handleDelete = (id) => {
    const updatedSleep = sleepData.filter((entry) => entry.id !== id)
    setSleepData(updatedSleep)
    localStorage.setItem("sleepData", JSON.stringify(updatedSleep))
  }

  const getWeeklySleepData = () => {
    const last7Days = Array(7).fill(0)
    const today = new Date()

    sleepData.forEach((entry) => {
      const entryDate = new Date(entry.date)
      const daysDiff = Math.floor((today - entryDate) / (1000 * 60 * 60 * 24))

      if (daysDiff >= 0 && daysDiff < 7) {
        last7Days[6 - daysDiff] = entry.duration
      }
    })

    return last7Days
  }

  const getAverageSleep = () => {
    if (sleepData.length === 0) return 0
    const total = sleepData.reduce((sum, entry) => sum + entry.duration, 0)
    return Math.round((total / sleepData.length) * 10) / 10
  }

  const getAverageQuality = () => {
    if (sleepData.length === 0) return 0
    const total = sleepData.reduce((sum, entry) => sum + entry.quality, 0)
    return Math.round((total / sleepData.length) * 10) / 10
  }

  const chartData = {
    labels: ["6d ago", "5d ago", "4d ago", "3d ago", "2d ago", "Yesterday", "Today"],
    datasets: [
      {
        label: "Sleep Duration (hours)",
        data: getWeeklySleepData(),
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        tension: 0.4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: { color: "#9ca3af" },
      },
      y: {
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: { color: "#9ca3af" },
        min: 0,
        max: 12,
      },
    },
  }

  const getQualityColor = (quality) => {
    if (quality >= 4) return "#06d6a0"
    if (quality >= 3) return "#f59e0b"
    return "#ef4444"
  }

  return (
    <div className="sleep-page">
      <div className="page-header">
        <h1>Sleep Tracker</h1>
        <p>Monitor your sleep patterns and quality</p>
      </div>

      {/* Sleep Stats */}
      <div className="sleep-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ color: "#6366f1" }}>
            <i className="fas fa-moon"></i>
          </div>
          <div className="stat-info">
            <h3>{getAverageSleep()}h</h3>
            <p>Average Sleep</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ color: getQualityColor(getAverageQuality()) }}>
            <i className="fas fa-star"></i>
          </div>
          <div className="stat-info">
            <h3>{getAverageQuality()}/5</h3>
            <p>Average Quality</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ color: "#06d6a0" }}>
            <i className="fas fa-calendar"></i>
          </div>
          <div className="stat-info">
            <h3>{sleepData.length}</h3>
            <p>Nights Tracked</p>
          </div>
        </div>
      </div>

      <div className="sleep-content">
        <div className="sleep-form-card">
          <h3>Log Sleep</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Bedtime</label>
                <input
                  type="time"
                  value={formData.bedtime}
                  onChange={(e) => setFormData({ ...formData, bedtime: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Wake Time</label>
                <input
                  type="time"
                  value={formData.wakeTime}
                  onChange={(e) => setFormData({ ...formData, wakeTime: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Sleep Quality (1-5)</label>
              <select value={formData.quality} onChange={(e) => setFormData({ ...formData, quality: e.target.value })}>
                <option value="1">1 - Very Poor</option>
                <option value="2">2 - Poor</option>
                <option value="3">3 - Average</option>
                <option value="4">4 - Good</option>
                <option value="5">5 - Excellent</option>
              </select>
            </div>

            <div className="form-group">
              <label>Notes (optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="How did you sleep? Any factors affecting your sleep?"
                rows="3"
              />
            </div>

            <button type="submit" className="btn-primary">
              <i className="fas fa-plus"></i>
              Log Sleep
            </button>
          </form>
        </div>

        <div className="sleep-chart-card">
          <div className="chart-header">
            <h3>Weekly Sleep Pattern</h3>
            <p>Your sleep duration over the last 7 days</p>
          </div>
          <div className="chart-container">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Sleep Entries */}
      <div className="sleep-entries">
        <div className="entries-header">
          <h3>Recent Sleep Entries</h3>
          <span className="entries-count">{sleepData.length} entries</span>
        </div>

        {sleepData.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-moon"></i>
            <p>No sleep data logged yet</p>
            <span>Start tracking your sleep patterns!</span>
          </div>
        ) : (
          <div className="entries-grid">
            {sleepData.slice(0, 7).map((entry) => (
              <div key={entry.id} className="sleep-entry-card">
                <div className="entry-header">
                  <div className="entry-main">
                    <div className="entry-date">{new Date(entry.date).toLocaleDateString()}</div>
                    <div className="entry-duration">
                      <i className="fas fa-clock"></i>
                      <span>{entry.duration}h</span>
                    </div>
                    <div className="entry-times">
                      <span>
                        {entry.bedtime} - {entry.wakeTime}
                      </span>
                    </div>
                  </div>
                  <button 
                    className="delete-btn" 
                    onClick={() => handleDelete(entry.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
                <div className="entry-quality">
                  <div className="quality-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i
                        key={star}
                        className={`fas fa-star ${star <= entry.quality ? "active" : ""}`}
                        style={{ color: star <= entry.quality ? getQualityColor(entry.quality) : "#374151" }}
                      />
                    ))}
                  </div>
                </div>
                {entry.notes && (
                  <div className="entry-notes">
                    <p>{entry.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Sleep