"use client"

import { useState, useEffect } from "react"
import { Line, Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js"
import MetricCard from "../components/MetricCard"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement)

const Dashboard = () => {
  const [viewMode, setViewMode] = useState("Weekly")
  const [dashboardData, setDashboardData] = useState({
    steps: 8942,
    calories: 1842,
    water: 1.8,
    sleep: 7.2,
  })

  useEffect(() => {
    // Load data from localStorage
    const savedData = localStorage.getItem("dashboardData")
    if (savedData) {
      setDashboardData(JSON.parse(savedData))
    }
  }, [])

  // Weekly data
  const weeklyData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Steps",
        data: [7500, 8200, 9100, 8800, 10200, 9500, 8942],
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        tension: 0.4,
        yAxisID: "y",
      },
      {
        label: "Calories",
        data: [1200, 1400, 1600, 1500, 1800, 1700, 1842],
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        tension: 0.4,
        yAxisID: "y1",
      },
    ],
  }

  // Monthly data - example with 4 weeks
  const monthlyData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Steps",
        data: [32000, 35000, 38000, 36000],
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        tension: 0.4,
        yAxisID: "y",
      },
      {
        label: "Calories",
        data: [6000, 6500, 7000, 6800],
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        tension: 0.4,
        yAxisID: "y1",
      },
    ],
  }

  // Use the appropriate data based on viewMode
  const activityData = viewMode === "Weekly" ? weeklyData : monthlyData

  const calorieBreakdownData = {
    labels: ["Protein", "Carbs", "Fat"],
    datasets: [
      {
        data: [25, 50, 25],
        backgroundColor: ["#8b5cf6", "#06d6a0", "#f59e0b"],
        borderWidth: 0,
        cutout: "70%",
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#374151",
        borderWidth: 1,
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
        type: "linear",
        display: true,
        position: "left",
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#9ca3af",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: "#9ca3af",
        },
      },
    },
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>View your fitness stats and progress</p>
      </div>

      {/* Metrics Cards */}
      <div className="metrics-grid">
        <MetricCard
          title="Steps"
          value={dashboardData.steps}
          progress={dashboardData.steps}
          target={10000}
          icon="fas fa-walking"
          color="#6366f1"
        />
        <MetricCard
          title="Calories"
          value={dashboardData.calories}
          progress={dashboardData.calories}
          target={2200}
          icon="fas fa-fire"
          color="#f59e0b"
        />
        <MetricCard
          title="Water"
          value={dashboardData.water}
          unit="L"
          progress={dashboardData.water}
          target={2.5}
          icon="fas fa-tint"
          color="#06d6a0"
        />
        <MetricCard
          title="Sleep"
          value={`${Math.floor(dashboardData.sleep)}h ${Math.round((dashboardData.sleep % 1) * 60)}m`}
          progress={dashboardData.sleep}
          target={8}
          icon="fas fa-moon"
          color="#8b5cf6"
        />
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3>Activity Overview</h3>
              <p>Track your daily steps and calories burned</p>
            </div>
            <div className="view-toggle">
              <button
                className={viewMode === "Weekly" ? "active" : ""}
                onClick={() => setViewMode("Weekly")}
              >
                Weekly
              </button>
              <button
                className={viewMode === "Monthly" ? "active" : ""}
                onClick={() => setViewMode("Monthly")}
              >
                Monthly
              </button>
            </div>
          </div>
          <div className="chart-container">
            <Line 
              key={viewMode} // This forces re-render when viewMode changes
              data={activityData} 
              options={chartOptions} 
            />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3>Calorie Breakdown</h3>
              <p>Macronutrient distribution</p>
            </div>
          </div>
          <div className="chart-container doughnut-container" style={{ height: "225px" }}>
            <Doughnut data={calorieBreakdownData} options={doughnutOptions} />
            <div className="doughnut-legend">
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: "#8b5cf6" }}></span>
                <span>Protein: 25%</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: "#06d6a0" }}></span>
                <span>Carbs: 50%</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: "#f59e0b" }}></span>
                <span>Fat: 25%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard