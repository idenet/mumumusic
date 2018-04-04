import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Player extends Component {
  static propTypes = {
    prop: PropTypes
  }

  render() {
    return (
      <div className="player">
        <div className="normal-player">播放器</div>
        <div className="mini-player">迷你播放器</div>
      </div>
    )
  }
}
