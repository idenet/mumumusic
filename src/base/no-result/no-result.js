import React from 'react'

import './no-result.styl'

const NoResult = ({ title }) => (
  <div className="no-result">
    <div className="no-result-icon" />
    <p className="no-result-text">{title}</p>
  </div>
)

export default NoResult
