"use client"

import { useState, useEffect } from "react"

const Activities = () => {
  const [activities, setActivities] = useState([])
  const [formData, setFormData] = useState({
    type: "",
    duration: "",
    calories: "",
    notes: "",
  })

  const activityTypes = [
    "Running",
    "Walking",
    "Cycling",
    "Swimming",
    "Yoga",
    "Weight Training",
    "Dancing",
    "Basketball",
    "Soccer",
    "Tennis",
  ]

  useEffect(() => {
    const savedActivities = localStorage.getItem("activities")
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities))
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.type || !formData.duration || !formData.calories) {
      alert("Please fill in all required fields")
      return
    }

    const newActivity = {
      id: Date.now(),
      ...formData,
      duration: Number.parseInt(formData.duration),
      calories: Number.parseInt(formData.calories),
      date: new Date().toISOString(),
    }

    const updatedActivities = [newActivity, ...activities]
    setActivities(updatedActivities)
    localStorage.setItem("activities", JSON.stringify(updatedActivities))

    setFormData({ type: "", duration: "", calories: "", notes: "" })
  }

  const handleDelete = (id) => {
    const updatedActivities = activities.filter((activity) => activity.id !== id)
    setActivities(updatedActivities)
    localStorage.setItem("activities", JSON.stringify(updatedActivities))
  }

  const getActivityIcon = (type) => {
    const icons = {
      Running: "fas fa-running",
      Walking: "fas fa-walking",
      Cycling: "fas fa-biking",
      Swimming: "fas fa-swimmer",
      Yoga: "fas fa-spa",
      "Weight Training": "fas fa-dumbbell",
      Dancing: "fas fa-music",
      Basketball: "fas fa-basketball-ball",
      Soccer: "fas fa-futbol",
      Tennis: "fas fa-table-tennis",
    }
    return icons[type] || "fas fa-running"
  }

  return (
    <div className="activities-page">
      <div className="page-header">
        <h1>Activity Logger</h1>
        <p>Track your workouts and activities</p>
      </div>

      <div className="activities-content">
        <div className="activity-form-card">
          <h3>Log Activity</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Activity Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                <option value="">Select Activity</option>
                {activityTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Duration (min) *</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label>Calories Burned *</label>
                <input
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Notes (optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any additional notes about your workout..."
                rows="3"
              />
            </div>

            <button type="submit" className="btn-primary">
              <i className="fas fa-plus"></i>
              Log Activity
            </button>
          </form>
        </div>

        <div className="activities-list">
          <div className="activities-header">
            <h3>Recent Activities</h3>
            <span className="activity-count">{activities.length} activities</span>
          </div>

          {activities.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-dumbbell"></i>
              <p>No activities logged yet</p>
              <span>Start by adding your first workout!</span>
            </div>
          ) : (
            <div className="activities-grid">
              {activities.map((activity) => (
                <div key={activity.id} className="activity-card">
                  <div className="activity-header">
                    <div className="activity-icon">
                      <i className={getActivityIcon(activity.type)}></i>
                    </div>
                    <div className="activity-info">
                      <h4>{activity.type}</h4>
                      <span className="activity-date">{new Date(activity.date).toLocaleDateString()}</span>
                    </div>
                    <button className="delete-btn" onClick={() => handleDelete(activity.id)}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>

                  <div className="activity-stats">
                    <div className="stat">
                      <i className="fas fa-clock"></i>
                      <span>{activity.duration} min</span>
                    </div>
                    <div className="stat">
                      <i className="fas fa-fire"></i>
                      <span>{activity.calories} cal</span>
                    </div>
                  </div>

                  {activity.notes && (
                    <div className="activity-notes">
                      <p>{activity.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Activities
