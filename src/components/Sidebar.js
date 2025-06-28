import { NavLink } from "react-router-dom"

const Sidebar = ({ collapsed }) => {
  const mainMenuItems = [
    { path: "/", icon: "fas fa-chart-line", label: "Dashboard" },
    { path: "/activities", icon: "fas fa-running", label: "Activities" },
    { path: "/workouts", icon: "fas fa-dumbbell", label: "Workouts" },
    { path: "/nutrition", icon: "fas fa-apple-alt", label: "Nutrition" },
    { path: "/heart-rate", icon: "fas fa-heartbeat", label: "Heart Rate" }
  ]

  const footerMenuItems = [
    { path: "/profile", icon: "fas fa-user", label: "Profile" },
    { path: "/settings", icon: "fas fa-cog", label: "Settings" },
  ]

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="logo">
          <i className="fas fa-heartbeat"></i>
          {!collapsed && <span>FitTracker</span>}
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {mainMenuItems.map((item) => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <i className={item.icon}></i>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        {footerMenuItems.map((item) => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <i className={item.icon}></i>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export default Sidebar