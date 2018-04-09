import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './search-box.styl'

export default class SearchBox extends Component {
  static propTypes = {
    placeHolder: PropTypes.string,
    onInput: PropTypes.func
  }
  static defaultProps = {
    placeHolder: '搜索歌曲、歌手',
    onInput: f => f
  }
  constructor() {
    super()
    this.state = {
      query: ''
    }
    this.query = React.createRef()
    this.handleClear = this.handleClear.bind(this)
  }
  handleChange(e) {
    let query = e.target.value.trim()
    this.setState({
      query
    })
    // 将改变的query 通过props 传递给父组件
    this.props.onInput(query)
  }
  setQuery(value) {
    this.setState({
      query: value.trim()
    })
    // 将改变的query 通过props 传递给父组件 注意 set的时候也要传
    this.props.onInput(value.trim())
  }
  handleClear() {
    this.setState({
      query: ''
    })
    // 清理的时候也要穿
    this.props.onInput()
  }
  blur() {
    this.query.current.blur()
  }
  render() {
    return (
      <div className="search-box">
        <i className="icon-search" />
        <input
          type="text"
          className="box"
          ref={this.query}
          placeholder={this.props.placeHolder}
          onChange={e => this.handleChange(e)}
          value={this.state.query}
        />
        {this.state.query ? (
          <i className="icon-dismiss" onClick={this.handleClear} />
        ) : null}
      </div>
    )
  }
}
