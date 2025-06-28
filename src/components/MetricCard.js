const MetricCard = ({ title, value, unit, progress, target, icon, color }) => {
  const percentage = Math.round((progress / target) * 100)

  return (
    <div className="metric-card">
      <div className="metric-header">
        <div className="metric-info">
          <h3 className="metric-title">{title}</h3>
          <div className="metric-icon" style={{ color }}>
            <i className={icon}></i>
          </div>
        </div>
      </div>

      <div className="metric-value">
        <span className="value">{value.toLocaleString()}</span>
        {unit && <span className="unit">{unit}</span>}
      </div>

      <div className="metric-progress">
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: color,
            }}
          ></div>
        </div>
        <div className="progress-text">
          <span>
            {percentage}% of {target.toLocaleString()}
            {unit}
          </span>
        </div>
      </div>
    </div>
  )
}

export default MetricCard

