import React, { Component } from 'react'
import PropTypes from 'prop-types'

//util
import { prefix } from 'common/js/prefix'

import './progress-bar.styl'

const PROGRESS_BTN_WIDTH = 16

const transform = prefix('transform')

export default class ProgressBar extends Component {
  static propTypes = {
    percent: PropTypes.number,
    percentChanging: PropTypes.func,
    percentChangeEnd: PropTypes.func
  }
  static defaultProps = {
    percent: 0,
    percentChanging: null,
    percentChangeEnd: null
  }
  constructor(props) {
    super(props)
    this.touch = {}
    this.progressBar = React.createRef()
    this.progress = React.createRef()
    this.progressBtn = React.createRef()
    this.handleProgressClick = this.handleProgressClick.bind(this)
    this.touchStart = this.touchStart.bind(this)
    this.touchMove = this.touchMove.bind(this)
    this.touchEnd = this.touchEnd.bind(this)
  }
  shouldComponentUpdate(nextProps) {
    if (this.props.percent !== nextProps.percent) {
      return this._setProgressOffset(nextProps.percent) // 实时改变
    }
    return true
  }
  _setProgressOffset(percent) {
    if (percent > 0 && !this.touch.init) {
      const barWidth = this.progressBar.current.clientWidth - PROGRESS_BTN_WIDTH
      const offsetWidth = barWidth * percent
      this._offset(offsetWidth)
    }
    return false
  }
  _offset(offsetWidth) {
    this.progress.current.style.width = `${offsetWidth}px`
    this.progressBtn.current.style[
      transform
    ] = `translate3d(${offsetWidth}px, 0, 0)`
  }
  _getPercent() {
    const barWidth = this.progressBar.current.clientWidth - PROGRESS_BTN_WIDTH
    return this.progress.current.clientWidth / barWidth
  }
  _triggerPercent() {
    this.props.percentChangeEnd &&
      this.props.percentChangeEnd(this._getPercent())
  }
  handleProgressClick(e) {
    const rect = this.progressBar.current.getBoundingClientRect()
    const offsetWidth = e.pageX - rect.left
    this._offset(offsetWidth)
    this._triggerPercent()
  }
  touchStart(e) {
    this.touch.init = true
    // 获取touch的x
    this.touch.startX = e.touches[0].pageX
    // 进度条宽度
    this.touch.left = this.progress.current.clientWidth
  }
  touchMove(e) {
    if (!this.touch.init) return
    // 移动的距离
    const deltaX = e.touches[0].pageX - this.touch.startX
    // Math.min 最大不能大于，Math.max 最小为0
    const offsetWidth = Math.min(
      this.progressBar.current.clientWidth - PROGRESS_BTN_WIDTH,
      Math.max(0, this.touch.left + deltaX)
    )
    this._offset(offsetWidth)
    this.props.percentChanging && this.props.percentChanging(this._getPercent())
  }
  touchEnd(e) {
    this.touch.init = false
    this._triggerPercent()
  }
  render() {
    return (
      <div
        className="progress-bar"
        ref={this.progressBar}
        onClick={this.handleProgressClick}
      >
        <div className="bar-inner">
          <div className="progress" ref={this.progress} />
          <div
            className="progress-btn-wrapper"
            onTouchStart={this.touchStart}
            onTouchMove={this.touchMove}
            onTouchEnd={this.touchEnd}
            ref={this.progressBtn}
          >
            <div className="progress-btn" />
          </div>
        </div>
      </div>
    )
  }
}
