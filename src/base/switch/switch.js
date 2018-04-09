import React from 'react'

import './switch.styl'

const Switch = (
  { switches, currentIndex, switchFn } = {
    switches: [],
    currentIndex: 0,
    switchFn: f => f
  }
) => (
  <div className="switches">
    {switches.length
      ? switches.map((v, i) => (
          <li
            className={'switch-item ' + (i === currentIndex ? 'active' : '')}
            onClick={() => switchFn(i)}
            key={v.name}
          >
            <span>{v.name}</span>
          </li>
        ))
      : null}
  </div>
)

export default Switch
