import React from 'react'

import './progress-circle.styl'

const ProgressCircle = ({ percent, radius, children }) => {
  const dashArray = Math.PI * 100
  const dashOffset = (1 - percent) * dashArray
  return (
    <div className="progress-circle">
      <svg
        width={radius}
        height={radius}
        viewBox="0 0 100 100"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="progress-background"
          r="50"
          cx="50"
          cy="50"
          fill="transparent"
        />
        <circle
          className="progress-bar"
          r="50"
          cx="50"
          cy="50"
          fill="transparent"
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
        />
      </svg>
      {children}
    </div>
  )
}

export default ProgressCircle
