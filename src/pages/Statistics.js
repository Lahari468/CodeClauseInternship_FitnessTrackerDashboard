"use client"

import { useState, useEffect } from "react"
import { Bar, Pie } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

const Statistics = () => {
  const [activities, setActivities] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [activityDistribution, setActivityDistribution] = useState({})

  useEffect(() => {
    const savedActivities = localStorage.getItem("activities")
    if (savedActivities) {
      const activitiesData = JSON.parse(savedActivities)
      setActivities(activitiesData)
      processStatistics(activitiesData)
    }
  }, [])

  const processStatistics = (activitiesData) => {
    // Process monthly data
    const monthlyCalories = Array(12).fill(0)
    const currentDate = new Date()

    activitiesData.forEach((activity) => {
      const activityDate = new Date(activity.date)
      const monthsDiff =
        (currentDate.getFullYear() - activityDate.getFullYear()) * 12 +
        (currentDate.getMonth() - activityDate.getMonth())

      if (monthsDiff >= 0 && monthsDiff < 12) {
        monthlyCalories[11 - monthsDiff] += activity.calories
      }
    })
    setMonthlyData(monthlyCalories)

    // Process activity distribution
    const distribution = {}
    activitiesData.forEach((activity) => {
      distribution[activity.type] = (distribution[activity.type] || 0) + activity.duration
    })
    setActivityDistribution(distribution)
  }

  const getMonthNames = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const currentMonth = new Date().getMonth()
    const result = []

    for (let i = 11; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12
      result.push(months[monthIndex])
    }

    return result
  }

  const monthlyChartData = {
    labels: getMonthNames(),
    datasets: [
      {
        label: "Calories Burned",
        data: monthlyData,
        backgroundColor: "rgba(99, 102, 241, 0.8)",
        borderColor: "#6366f1",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }

  const pieChartData = {
    labels: Object.keys(activityDistribution),
    datasets: [
      {
        data: Object.values(activityDistribution),
        backgroundColor: ["#6366f1", "#f59e0b", "#06d6a0", "#8b5cf6", "#ef4444", "#3b82f6", "#10b981", "#f97316"],
        borderWidth: 0,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#9ca3af",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#9ca3af",
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#9ca3af",
        },
      },
    },
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#9ca3af",
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
  }

  const totalCalories = activities.reduce((sum, activity) => sum + activity.calories, 0)
  const totalDuration = activities.reduce((sum, activity) => sum + activity.duration, 0)
  const averageCalories = activities.length > 0 ? Math.round(totalCalories / activities.length) : 0

  return (
    <div className="statistics-page">
      <div className="page-header">
        <h1>Statistics</h1>
        <p>Analyze your fitness progress and trends</p>
      </div>

      {/* Summary Stats */}
      <div className="stats-summary">
        <div className="summary-card">
          <div className="summary-icon">
            <i className="fas fa-fire"></i>
          </div>
          <div className="summary-info">
            <h3>{totalCalories.toLocaleString()}</h3>
            <p>Total Calories Burned</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="summary-info">
            <h3>{Math.round(totalDuration / 60)}h</h3>
            <p>Total Workout Time</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="summary-info">
            <h3>{averageCalories}</h3>
            <p>Avg Calories/Session</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <i className="fas fa-dumbbell"></i>
          </div>
          <div className="summary-info">
            <h3>{activities.length}</h3>
            <p>Total Sessions</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Monthly Trends</h3>
            <p>Calories burned over the last 12 months</p>
          </div>
          <div className="chart-container">
            <Bar data={monthlyChartData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Activity Distribution</h3>
            <p>Time spent on different activities</p>
          </div>
          <div className="chart-container">
            {Object.keys(activityDistribution).length > 0 ? (
              <Pie data={pieChartData} options={pieOptions} />
            ) : (
              <div className="empty-chart">
                <i className="fas fa-chart-pie"></i>
                <p>No data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Statistics
