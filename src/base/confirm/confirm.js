import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './confirm.styl'
export default class Confirm extends Component {
  static propTypes = {
    text: PropTypes.string,
    confirmBtnText: PropTypes.string,
    cancelBtnText: PropTypes.string,
    confirm: PropTypes.func
  }
  static defaultProps = {
    text: '',
    confirmBtnText: '确认',
    cancelBtnText: '取消',
    confirm: f => f
  }
  constructor(props) {
    super(props)
    this.state = {
      showFlag: false
    }
    this.cancelBtn = this.cancelBtn.bind(this)
    this.confirmBtn = this.confirmBtn.bind(this)
  }
  hide() {
    this.setState({
      showFlag: false
    })
  }
  show() {
    this.setState({
      showFlag: true
    })
  }
  cancelBtn() {
    this.hide()
  }
  confirmBtn() {
    this.props.confirm()
    this.hide()
  }
  render() {
    return (
      <div
        className={
          'confirm ' +
          (this.state.showFlag
            ? 'confirm-fade-enter-active'
            : 'confirm-content')
        }
        onClick={e => e.stopPropagation()}
        style={{ display: !this.state.showFlag ? 'none' : 'block' }}
      >
        <div className="confirm-wrapper">
          <div className="confirm-content">
            <p className="text">{this.props.text}</p>
            <div className="operate">
              <div onClick={this.cancelBtn} className="operate-btn left">
                {this.props.cancelBtnText}
              </div>
              <div onClick={this.confirmBtn} className="operate-btn">
                {this.props.confirmBtnText}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
