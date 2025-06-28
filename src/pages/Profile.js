"use client"

import { useState, useEffect } from "react"

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    goal: "",
    avatar: null,
  })
  const [bmi, setBmi] = useState(null)
  const [bmiCategory, setBmiCategory] = useState("")

  useEffect(() => {
    const savedProfile = localStorage.getItem("profile")
    if (savedProfile) {
      const profileData = JSON.parse(savedProfile)
      setProfile(profileData)
      if (profileData.height && profileData.weight) {
        calculateBMI(profileData.height, profileData.weight)
      }
    }
  }, [])

  const calculateBMI = (height, weight) => {
    const heightInM = Number.parseFloat(height) / 100
    const weightInKg = Number.parseFloat(weight)

    if (heightInM > 0 && weightInKg > 0) {
      const bmiValue = weightInKg / (heightInM * heightInM)
      setBmi(Math.round(bmiValue * 10) / 10)

      if (bmiValue < 18.5) setBmiCategory("Underweight")
      else if (bmiValue < 25) setBmiCategory("Normal weight")
      else if (bmiValue < 30) setBmiCategory("Overweight")
      else setBmiCategory("Obese")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    localStorage.setItem("profile", JSON.stringify(profile))

    if (profile.height && profile.weight) {
      calculateBMI(profile.height, profile.weight)
    }

    alert("Profile updated successfully!")
  }

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setProfile({ ...profile, avatar: event.target.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const getBMIColor = () => {
    if (!bmi) return "#6b7280"
    if (bmi < 18.5) return "#06d6a0"
    if (bmi < 25) return "#10b981"
    if (bmi < 30) return "#f59e0b"
    return "#ef4444"
  }

  const fitnessGoals = [
    "Weight Loss",
    "Strength Training",
    "Cardio Fitness",
    "Flexibility",
  ]

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>Profile</h1>
        <p>Manage your personal information and fitness goals</p>
      </div>

      <div className="profile-content">
        <div className="profile-form-card">
          <h3>Personal Information</h3>
          <form onSubmit={handleSubmit}>
            <div className="avatar-section">
              <div className="avatar-preview">
                {profile.avatar ? (
                  <img src={profile.avatar || "/placeholder.svg"} alt="Profile" />
                ) : (
                  <div className="avatar-placeholder">
                    <i className="fas fa-user"></i>
                  </div>
                )}
              </div>
              <div className="avatar-upload">
                <label htmlFor="avatar-input" className="btn-secondary">
                  <i className="fas fa-camera"></i>
                  Upload Photo
                </label>
                <input
                  id="avatar-input"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  style={{ display: "none" }}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                  placeholder="Enter your age"
                  min="1"
                  max="120"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Height (cm)</label>
                <input
                  type="number"
                  value={profile.height}
                  onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                  placeholder="Enter height in cm"
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  value={profile.weight}
                  onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                  placeholder="Enter weight in kg"
                  min="1"
                  step="0.1"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Fitness Goal</label>
              <select value={profile.goal} onChange={(e) => setProfile({ ...profile, goal: e.target.value })}>
                <option value="">Select your fitness goal</option>
                {fitnessGoals.map((goal) => (
                  <option key={goal} value={goal}>
                    {goal}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn-primary">
              <i className="fas fa-save"></i>
              Save Profile
            </button>
          </form>
        </div>

        <div className="profile-summary">
          <div className="summary-card">
            <div className="profile-info">
              <div className="profile-avatar">
                {profile.avatar ? (
                  <img src={profile.avatar || "/placeholder.svg"} alt="Profile" />
                ) : (
                  <div className="avatar-placeholder">
                    <i className="fas fa-user"></i>
                  </div>
                )}
              </div>
              <div className="profile-details">
                <h3>{profile.name || "Your Name"}</h3>
                <p>{profile.age ? `${profile.age} years old` : "Age not set"}</p>
                <p>{profile.goal || "No fitness goal set"}</p>
              </div>
            </div>
          </div>

          <div className="bmi-card">
            <h3>BMI Calculator</h3>
            {bmi ? (
              <div className="bmi-result">
                <div className="bmi-value" style={{ color: getBMIColor() }}>
                  {bmi}
                </div>
                <div className="bmi-category" style={{ color: getBMIColor() }}>
                  {bmiCategory}
                </div>
                <div className="bmi-details">
                  <p>Height: {profile.height}cm</p>
                  <p>Weight: {profile.weight}kg</p>
                </div>
              </div>
            ) : (
              <div className="bmi-placeholder">
                <i className="fas fa-calculator"></i>
                <p>Enter your height and weight to calculate BMI</p>
              </div>
            )}
          </div>

          <div className="bmi-categories">
            <h4>BMI Categories</h4>
            <div className="category-list">
              <div className="category-item">
                <span className="category-range">{"< 18.5"}</span>
                <span className="category-label">Underweight</span>
              </div>
              <div className="category-item">
                <span className="category-range">18.5 - 24.9</span>
                <span className="category-label">Normal</span>
              </div>
              <div className="category-item">
                <span className="category-range">25.0 - 29.9</span>
                <span className="category-label">Overweight</span>
              </div>
              <div className="category-item">
                <span className="category-range">{"≥ 30.0"}</span>
                <span className="category-label">Obese</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
