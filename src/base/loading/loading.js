import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './loading.styl'

export default class Loading extends Component {
  static propTypes = {
    title: PropTypes.string
  }
  static defaultProps = {
    title: '正在加载...'
  }
  render() {
    return (
      <div className="loading-content">
        <div className="loading-wrapper">
          <img src={require('./loading.gif')} alt="" width="24" height="24" />
          <p className="desc">{this.props.title}</p>
        </div>
      </div>
    )
  }
}
