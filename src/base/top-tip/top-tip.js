import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './top-tip.styl'

export default class TopTip extends Component {
  static propTypes = {
    delay: PropTypes.number
  }
  static defaultProps = {
    delay: 2000
  }
  constructor() {
    super()
    this.state = {
      showTip: false
    }
    this.show = this.show.bind(this)
  }
  show() {
    this.setState(
      {
        showTip: true
      },
      () => {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.hideTip()
        }, this.props.delay)
      }
    )
  }
  hideTip() {
    this.setState({
      showTip: false
    })
  }
  render() {
    return (
      <div className={'top-tip ' + (this.state.showTip ? 'drop' : '')}>
        {this.props.children}
      </div>
    )
  }
}
