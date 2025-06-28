"use client"

import { useState, useEffect, useCallback } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import timeGridPlugin from "@fullcalendar/timegrid"

const WorkoutSchedule = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchParams] = useSearchParams();
  const workoutId = searchParams.get('workoutId');

  // Get color based on workout difficulty
  const getDifficultyColor = useCallback((difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner": return "#06d6a0";
      case "intermediate": return "#f59e0b";
      case "advanced": return "#ef4444";
      default: return "#6366f1";
    }
  }, []);

  // Load scheduled workouts from localStorage
  const loadScheduledWorkouts = useCallback(() => {
    try {
      const savedWorkouts = JSON.parse(localStorage.getItem("scheduledWorkouts") || "[]");
      const calendarEvents = savedWorkouts.map(workout => ({
        id: workout.id,
        title: workout.name,
        start: workout.scheduledDate,
        extendedProps: { workout },
        backgroundColor: getDifficultyColor(workout.difficulty),
        borderColor: getDifficultyColor(workout.difficulty)
      }));
      setEvents(calendarEvents);
    } catch (error) {
      console.error("Error loading workouts:", error);
      localStorage.setItem("scheduledWorkouts", "[]");
      setEvents([]);
    }
  }, [getDifficultyColor]);

  // Load workouts on component mount
  useEffect(() => {
    loadScheduledWorkouts();
  }, [loadScheduledWorkouts]);

  // Handle date click on calendar
  const handleDateClick = useCallback((arg) => {
    if (workoutId) {
      // If coming from workout selection
      const workout = workouts.find(w => w.id === parseInt(workoutId));
      if (workout) {
        const newEvent = {
          id: Date.now(),
          date: arg.dateStr,
          startTime: "09:00",
          endTime: calculateEndTime("09:00", workout.duration),
          workoutId: workout.id,
          ...workout,
          isNew: true
        };
        setSelectedEvent(newEvent);
        setShowModal(true);
      }
    } else {
      // Create new event
      setSelectedEvent({
        date: arg.dateStr,
        startTime: "09:00",
        endTime: "10:00",
        isNew: true
      });
      setShowModal(true);
    }
  }, [workoutId]);

  // Handle event click on calendar
  const handleEventClick = useCallback((info) => {
    const workout = info.event.extendedProps.workout;
    const startDate = info.event.start;
    const endDate = info.event.end || new Date(startDate.getTime() + workout.duration * 60000);
    
    setSelectedEvent({
      id: info.event.id,
      workoutId: workout.id,
      ...workout,
      date: info.event.startStr.split('T')[0],
      startTime: formatTime(startDate),
      endTime: formatTime(endDate),
      isNew: false,
      extendedProps: info.event.extendedProps
    });
    setShowModal(true);
  }, []);

  // Format time for display
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  // Save or update workout schedule
  const saveWorkout = useCallback(() => {
    if (!selectedEvent) return;

    const savedWorkouts = JSON.parse(localStorage.getItem("scheduledWorkouts") || "[]");
    let updatedWorkouts;

    // Get the workout data (either from workouts array or from extendedProps)
    const workoutData = selectedEvent.workoutId 
      ? workouts.find(w => w.id === selectedEvent.workoutId)
      : selectedEvent.extendedProps?.workout;

    if (!workoutData) return;

    // Create scheduled date from date + time
    const [hours, minutes] = selectedEvent.startTime.split(':').map(Number);
    const scheduledDate = new Date(selectedEvent.date);
    scheduledDate.setHours(hours, minutes);

    const scheduledWorkout = {
      ...workoutData,
      scheduledDate: scheduledDate.toISOString(),
      completed: false,
      id: selectedEvent.isNew ? Date.now() : selectedEvent.id
    };

    if (selectedEvent.isNew) {
      updatedWorkouts = [...savedWorkouts, scheduledWorkout];
    } else {
      updatedWorkouts = savedWorkouts.map(w => 
        w.id === selectedEvent.id ? scheduledWorkout : w
      );
    }

    localStorage.setItem("scheduledWorkouts", JSON.stringify(updatedWorkouts));
    loadScheduledWorkouts();
    setShowModal(false);
    navigate('/workout-schedule');
  }, [selectedEvent, loadScheduledWorkouts, navigate]);

  // Delete scheduled workout
  const deleteWorkout = useCallback(() => {
    if (!selectedEvent?.id) return;

    if (window.confirm("Are you sure you want to delete this scheduled workout?")) {
      const savedWorkouts = JSON.parse(localStorage.getItem("scheduledWorkouts") || "[]");
      const updatedWorkouts = savedWorkouts.filter(w => w.id !== selectedEvent.id);
      
      localStorage.setItem("scheduledWorkouts", JSON.stringify(updatedWorkouts));
      loadScheduledWorkouts();
      setShowModal(false);
      navigate('/workout-schedule');
    }
  }, [selectedEvent, loadScheduledWorkouts, navigate]);

  return (
    <div className="workouts-page">
      <div className="page-header">
        <h1>Workout Schedule</h1>
        <p>View and manage your scheduled workouts</p>
        <div className="workout-navigation">
          <Link to="/workouts" className="btn-secondary">
            <i className="fas fa-dumbbell"></i>
            Browse Workouts
          </Link>
        </div>
      </div>

      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth"
          }}
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          editable={true}
          selectable={true}
          nowIndicator={true}
          dayMaxEvents={true}
          height="auto"
          eventDisplay="block"
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }}
        />
      </div>

      {/* Schedule/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>
              {selectedEvent?.isNew ? "Schedule New Workout" : "Edit Scheduled Workout"}
              <button className="close-btn" onClick={() => {
                setShowModal(false);
                navigate('/workout-schedule');
              }}>
                <i className="fas fa-times"></i>
              </button>
            </h3>
            
            <div className="form-group">
              <label>Date</label>
              <input 
                type="date" 
                value={selectedEvent?.date || ''} 
                onChange={(e) => setSelectedEvent(prev => ({
                  ...prev, 
                  date: e.target.value
                }))}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Start Time</label>
              <input 
                type="time" 
                value={selectedEvent?.startTime || ''}
                onChange={(e) => {
                  const duration = selectedEvent.duration || 60;
                  setSelectedEvent(prev => ({
                    ...prev, 
                    startTime: e.target.value,
                    endTime: calculateEndTime(e.target.value, duration)
                  }));
                }}
                required
              />
            </div>
            
            {selectedEvent?.isNew && (
              <div className="form-group">
                <label>Select Workout</label>
                <select 
                  value={selectedEvent?.workoutId || ''}
                  onChange={(e) => {
                    const workout = workouts.find(w => w.id === parseInt(e.target.value));
                    if (workout) {
                      setSelectedEvent(prev => ({
                        ...prev, 
                        workoutId: workout.id, 
                        ...workout,
                        endTime: calculateEndTime(
                          prev.startTime, 
                          workout.duration
                        )
                      }));
                    }
                  }}
                  required
                >
                  <option value="">Choose a workout</option>
                  {workouts.map(workout => (
                    <option key={workout.id} value={workout.id}>
                      {workout.name} ({workout.duration} mins)
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {!selectedEvent?.isNew && (
              <div className="workout-details">
                <h4>{selectedEvent?.name}</h4>
                <p>Duration: {selectedEvent?.duration} minutes</p>
                <p>Difficulty: {selectedEvent?.difficulty}</p>
              </div>
            )}
            
            <div className="modal-actions">
              {!selectedEvent?.isNew && (
                <button className="btn-danger" onClick={deleteWorkout}>
                  <i className="fas fa-trash"></i> Delete
                </button>
              )}
              <button 
                className="btn-primary" 
                onClick={saveWorkout}
                disabled={
                  !selectedEvent?.date || 
                  !selectedEvent?.startTime || 
                  (selectedEvent?.isNew && !selectedEvent?.workoutId)
                }
              >
                {selectedEvent?.isNew ? "Schedule Workout" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper function to calculate end time
function calculateEndTime(startTime, durationMinutes) {
  const [hours, minutes] = startTime.split(':').map(Number);
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0);
  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
  return endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}
// Workouts data
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
  ];

export default WorkoutSchedule;