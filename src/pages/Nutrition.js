"use client"

import { useState, useEffect } from "react"
import { Bar,} from "react-chartjs-2"

const Nutrition = () => {
  const [meals, setMeals] = useState([])
  const [formData, setFormData] = useState({
    type: "",
    calories: "",
    food: "",
  })
  const [profile, setProfile] = useState({})

  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"]

  useEffect(() => {
    const savedMeals = localStorage.getItem("meals")
    const savedProfile = localStorage.getItem("profile")

    if (savedMeals) setMeals(JSON.parse(savedMeals))
    if (savedProfile) setProfile(JSON.parse(savedProfile))
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.type || !formData.calories) {
      alert("Please fill in all required fields")
      return
    }

    const newMeal = {
      id: Date.now(),
      ...formData,
      calories: Number.parseInt(formData.calories),
      date: new Date().toISOString(),
    }

    const updatedMeals = [newMeal, ...meals]
    setMeals(updatedMeals)
    localStorage.setItem("meals", JSON.stringify(updatedMeals))

    setFormData({ type: "", calories: "", food: "" })
  }

  const handleDelete = (id) => {
    const updatedMeals = meals.filter((meal) => meal.id !== id)
    setMeals(updatedMeals)
    localStorage.setItem("meals", JSON.stringify(updatedMeals))
  }

  const getSuggestedCalories = () => {
    if (!profile.weight) return 2000
    const weight = Number.parseFloat(profile.weight)
    const baseCalories = weight * 24

    switch (profile.goal) {
      case "Weight Loss":
        return Math.round(baseCalories * 0.8)
      case "Muscle Gain":
        return Math.round(baseCalories * 1.2)
      default:
        return Math.round(baseCalories)
    }
  }

  const getDailyCalories = () => {
    const today = new Date().toDateString()
    return meals
      .filter((meal) => new Date(meal.date).toDateString() === today)
      .reduce((sum, meal) => sum + meal.calories, 0)
  }

  const getDailyData = () => {
    const last7Days = Array(7).fill(0)
    const today = new Date()

    meals.forEach((meal) => {
      const mealDate = new Date(meal.date)
      const daysDiff = Math.floor((today - mealDate) / (1000 * 60 * 60 * 24))

      if (daysDiff >= 0 && daysDiff < 7) {
        last7Days[6 - daysDiff] += meal.calories
      }
    })

    return last7Days
  }

  const todayCalories = getDailyCalories()
  const suggestedCalories = getSuggestedCalories()
  const calorieProgress = (todayCalories / suggestedCalories) * 100

  const dailyChartData = {
    labels: ["6d ago", "5d ago", "4d ago", "3d ago", "2d ago", "Yesterday", "Today"],
    datasets: [
      {
        label: "Daily Calories",
        data: getDailyData(),
        backgroundColor: "rgba(99, 102, 241, 0.8)",
        borderColor: "#6366f1",
        borderWidth: 1,
        borderRadius: 4,
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
      },
    },
  }

  return (
    <div className="nutrition-page">
      <div className="page-header">
        <h1>Nutrition Tracker</h1>
        <p>Track your daily calorie intake and meals</p>
      </div>

      {/* Daily Progress */}
      <div className="calorie-progress-card">
        <div className="progress-header">
          <h3>Today's Calorie Intake</h3>
          <div className="calorie-numbers">
            <span className="current">{todayCalories}</span>
            <span className="separator">/</span>
            <span className="target">{suggestedCalories} calories</span>
          </div>
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{
              width: `${Math.min(calorieProgress, 100)}%`,
              backgroundColor: calorieProgress > 100 ? "#f59e0b" : "#06d6a0",
            }}
          ></div>
        </div>
        <div className="progress-text">
          {calorieProgress > 100 && (
            <span className="over-target">{todayCalories - suggestedCalories} calories over target</span>
          )}
        </div>
      </div>

      <div className="nutrition-content">
        <div className="meal-form-card">
          <h3>Log Meal</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Meal Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                <option value="">Select Meal Type</option>
                {mealTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Calories *</label>
              <input
                type="number"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label>Food Items</label>
              <textarea
                value={formData.food}
                onChange={(e) => setFormData({ ...formData, food: e.target.value })}
                placeholder="e.g., Grilled chicken, rice, vegetables..."
                rows="3"
              />
            </div>

            <button type="submit" className="btn-primary">
              <i className="fas fa-plus"></i>
              Log Meal
            </button>
          </form>
        </div>

        <div className="nutrition-charts">
          <div className="chart-card">
            <div className="chart-header">
              <h3>Daily Calorie Intake</h3>
            </div>
            <div className="chart-container">
              <Bar data={dailyChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Meals */}
      <div className="meals-list">
        <div className="meals-header">
          <h3>Recent Meals</h3>
          <span className="meal-count">{meals.length} meals</span>
        </div>

        {meals.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-utensils"></i>
            <p>No meals logged yet</p>
            <span>Start tracking your nutrition!</span>
          </div>
        ) : (
          <div className="meals-grid">
            {meals.slice(0, 6).map((meal) => (
              <div key={meal.id} className="meal-card">
                <div className="meal-header">
                  <div className="meal-type">
                    <span className="meal-badge">{meal.type}</span>
                  </div>
                  <button className="delete-btn" onClick={() => handleDelete(meal.id)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>

                <div className="meal-info">
                  <div className="meal-calories">
                    <i className="fas fa-fire"></i>
                    <span>{meal.calories} cal</span>
                  </div>
                  <div className="meal-date">{new Date(meal.date).toLocaleDateString()}</div>
                </div>

                {meal.food && (
                  <div className="meal-food">
                    <p>{meal.food}</p>
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

export default Nutrition
