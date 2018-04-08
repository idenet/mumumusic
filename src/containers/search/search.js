import React, { Component } from 'react'

// 子组件
import SearchBox from 'base/search-box/search-box'
//api
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/config'
import { searchHOC } from 'common/js/HOC'

import './search.styl'
@searchHOC
export default class Search extends Component {
  constructor() {
    super()
    this.state = {
      hotKey: []
    }
  }
  componentDidMount() {
    this._getHotKey()
  }
  _getHotKey() {
    getHotKey().then(res => {
      if (res.code === ERR_OK) {
        this.setState({
          hotKey: res.data.hotkey.slice(0, 10)
        })
      }
    })
  }
  render() {
    return (
      <div className="search">
        <div className="search-box-wrapper">
          <SearchBox ref={this.props.refSearchbox} />
        </div>
        <div className="shortcut-wrapper">
          <div className="shortcut">
            <div className="hot-key">
              <h1 className="title">热门搜索</h1>
              <ul>
                {this.state.hotKey
                  ? this.state.hotKey.map(v => (
                      <li
                        className="item"
                        key={v.k}
                        onClick={() => this.props.addQuery(v.k)}
                      >
                        <span>{v.k}</span>
                      </li>
                    ))
                  : null}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
