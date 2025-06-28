"use client"

import { useState } from "react"
import { Link } from 'react-router-dom';

const Workouts = () => {

  const [selectedGoal, setSelectedGoal] = useState("all")
  const [selectedWorkout, setSelectedWorkout] = useState(null)
  
  const workouts = [
    {
      id: 1,
      name: "Yoga for Beginners",
      goal: "flexibility",
      duration: 30,
      difficulty: "Intermediate",
      exercises: ["Cat&Cow", "Warrior Poses", "Low Lounge", "Triangle Pose", "Supine Twists","Bridge Pose","Child's Pose","Savasana"],
      description: "Gentle yoga sequence to improve flexibility and reduce stress.",
      video: "https://www.youtube.com/embed/6hZIzMpHl-c"
    },
    {
      id: 2,
      name: "Core Crusher",
      goal: "strength",
      duration: 10,
      difficulty: "Intermediate",
      exercises: ["Bicycle Crunches", "Toe Reach Crunch", "Reach Out Tuck-in", "Roll In", "Oblique Crunches","Sitting Crunch","Jack Knife"],
      description: "Target your abdominal muscles with this intense core workout.",
      video: "https://www.youtube.com/embed/AnYl6Nk9GOA"
    },
    {
      id: 3,
      name: "Full Body Burn",
      goal: "weight-loss",
      duration: 20,
      difficulty: "Intermediate",
      exercises: ["Squat Jumps", "Jumping Jacks", "Plank Jacks", "Superman Pull","Glute Bridge","Reverse Plank","Burpees"],
      description: "Engage every muscle group with this challenging full-body workout.",
      video: "https://www.youtube.com/embed/UBMk30rjy0o"
    },
    {
      id: 4,
      name: "Strength Builder",
      goal: "strength",
      duration: 60,
      difficulty: "Advanced",
      exercises: ["Bicep curls", "Plank Taps", "Rollouts", "Single-arm rows", "Dumbbell Rows","Chest Press","Russian Twists"],
      description: "Comprehensive strength training routine to build lean muscle.",
      video: "https://www.youtube.com/embed/IFR6BjSSwqk"
    },
    {
      id: 5,
      name: "Cardio Blast",
      goal: "cardio",
      duration: 30,
      difficulty: "Beginner",
      exercises: ["Warmup", "Burpee Lunge", "Bear Shoulder Taps", "Leg Kicks", "Double Crunches","Plank Jumps","Pop Squat"],
      description: "Perfect cardio workout for beginners to improve heart health.",
      video: "https://www.youtube.com/embed/R7t3O8UFcHg"
    },
    {
      id: 6,
      name: "Fat Burning HIIT",
      goal: "weight-loss",
      duration: 30,
      difficulty: "Advanced",
      exercises: ["Skater", "Squat", "Mountain Climbers", "Power Jack", "Toe Tap","Star Jump","London Bridge","Wide Toe Touch"],
      description: "High-intensity interval training designed to maximize calorie burn in a short time.",
      video: "https://www.youtube.com/embed/ml6cT4AZdqI"
    },
    {
      id: 7,
      name: "Dance Cardio",
      goal: "cardio",
      duration: 25,
      difficulty: "Intermediate",
      exercises: ["Dance Steps", "Grapevine", "Kickboxing Moves", "Jumping Jacks", "Squats"],
      description: "Fun dance-based cardio to get your heart pumping.",
      video: "https://www.youtube.com/embed/-PuJuk1GtjE"
    },
    {
      id: 8,
      name: "Full Body Stretch",
      goal: "flexibility",
      duration: 20,
      difficulty: "Beginner",
      exercises: ["Neck Rolls", "Shoulder Stretch", "Tricep Stretch","Quad Stretch","Glute Stretch","Calf Stretch","Ankle Rolls"],
      description: "Comprehensive stretching routine for all major muscle groups.",
      video: "https://www.youtube.com/embed/DYGfwPppgO4"
    }
  ]

  const goals = [
    { value: "all", label: "All Workouts", icon: "fas fa-dumbbell" },
    { value: "weight-loss", label: "Weight Loss", icon: "fas fa-fire" },
    { value: "strength", label: "Strength", icon: "fas fa-fist-raised" },
    { value: "cardio", label: "Cardio", icon: "fas fa-heartbeat" },
    { value: "flexibility", label: "Flexibility", icon: "fas fa-spa" },
  ]

  const filteredWorkouts = selectedGoal === "all" 
    ? workouts 
    : workouts.filter((workout) => workout.goal === selectedGoal)

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "beginner": return "#06d6a0"
      case "intermediate": return "#f59e0b"
      case "advanced": return "#ef4444"
      default: return "#6b7280"
    }
  }

  const startWorkout = (workout) => {
    // Save workout completion
    const completedWorkouts = JSON.parse(localStorage.getItem("completedWorkouts")) || []
    completedWorkouts.push({
      ...workout,
      completedDate: new Date().toISOString()
    })
    localStorage.setItem("completedWorkouts", JSON.stringify(completedWorkouts))
    
    setSelectedWorkout(workout)
  }

  const closeVideo = () => {
    setSelectedWorkout(null)
  }

  return (
    <div className="workouts-page">
      {selectedWorkout && (
        <div className="workout-video-modal">
          <div className="video-container">
            <div className="video-header">
              <h2>{selectedWorkout.name}</h2>
              <button className="close-btn" onClick={closeVideo}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="video-wrapper">
              <iframe 
                src={selectedWorkout.video} 
                title={selectedWorkout.name}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen>
              </iframe>
            </div>
            
            <div className="video-details">
              <div className="detail-item">
                <i className="fas fa-clock"></i>
                <span>{selectedWorkout.duration} minutes</span>
              </div>
              <div className="detail-item">
                <i className="fas fa-bolt"></i>
                <span style={{ color: getDifficultyColor(selectedWorkout.difficulty) }}>
                  {selectedWorkout.difficulty}
                </span>
              </div>
            </div>
            
            <div className="video-exercises">
              <h3>Exercises:</h3>
              <div className="exercises-list">
                {selectedWorkout.exercises.map((exercise, index) => (
                  <span key={index} className="exercise-tag">
                    {exercise}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="page-header">
        <h1>Workout Planner</h1>
        <p>Choose workouts based on your fitness goals</p>
        <div className="workout-navigation">
          <Link to="/workout-schedule" className="btn-secondary">
            <i className="fas fa-calendar-alt"></i>
            View Schedule
          </Link>
        </div>
      </div>

      <div className="goal-filter">
        {goals.map((goal) => (
          <button
            key={goal.value}
            className={`goal-btn ${selectedGoal === goal.value ? "active" : ""}`}
            onClick={() => setSelectedGoal(goal.value)}
          >
            <i className={goal.icon}></i>
            <span>{goal.label}</span>
          </button>
        ))}
      </div>

      <div className="workouts-grid">
        {filteredWorkouts.map((workout) => (
          <div key={workout.id} className="workout-card">
            <div className="workout-header">
              <h3>{workout.name}</h3>
              <div className="workout-meta">
                <div className="workout-duration">
                  <i className="fas fa-clock"></i>
                  <span>{workout.duration} minutes</span>
                </div>
                <div className="workout-difficulty" style={{ backgroundColor: getDifficultyColor(workout.difficulty) }}>
                  {workout.difficulty}
                </div>
              </div>
            </div>

            <div className="workout-content">
              <p className="workout-description">{workout.description}</p>

              <div className="workout-exercises">
                <h4>Exercises:</h4>
                <div className="exercises-list">
                  {workout.exercises.map((exercise, index) => (
                    <span key={index} className="exercise-tag">
                      {exercise}
                    </span>
                  ))}
                </div>
              </div>

              <div className="workout-actions">
                <Link 
                  to={`/workout-schedule?workoutId=${workout.id}`}
                  className="btn-secondary"
                >
                  <i className="fas fa-calendar-plus"></i>
                  Schedule
                </Link>
                <button 
                  className="btn-primary" 
                  onClick={() => startWorkout(workout)}
                >
                  <i className="fas fa-play"></i>
                  Start Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredWorkouts.length === 0 && (
        <div className="empty-state">
          <i className="fas fa-search"></i>
          <p>No workouts found</p>
          <span>Try selecting a different goal</span>
        </div>
      )}
    </div>
  )
}

export default Workouts