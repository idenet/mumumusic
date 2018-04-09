import React, { Component } from 'react'

// redux
import { connect } from 'react-redux'
import { set_singer } from 'store/action-creator'
import { insertSong } from 'store/action'
// url
import { Route } from 'react-router-dom'
import SingerDetail from 'components/singer-detail/singer-detail'
// 子组件
import SearchBox from 'base/search-box/search-box'
import Suggest from 'components/suggest/suggest'
//api
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/config'
import { searchHOC } from 'common/js/HOC'
import Singer from 'common/js/singer'

import './search.styl'

const SINGER_TYPE = 'singer'
@searchHOC
@connect(null, { set_singer, insertSong })
export default class Search extends Component {
  constructor() {
    super()
    this.state = {
      hotKey: []
    }
    this.selectItem = this.selectItem.bind(this)
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
  selectItem(v) {
    if (v.type === SINGER_TYPE) {
      const singer = new Singer({
        id: v.singermid,
        name: v.singername
      })
      const { match } = this.props
      const url = `${match.url}/${singer.id}`
      this.props.history.push(url)
      this.props.set_singer(singer)
    } else {
      this.props.insertSong(v)
    }
    this.props.saveSearch()
  }
  render() {
    let { changeQuery, match } = this.props
    return (
      <div className="search">
        <div className="search-box-wrapper">
          <SearchBox
            ref={this.props.refSearchbox}
            onInput={this.props.onQueryChange}
          />
        </div>
        {!changeQuery ? (
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
        ) : null}
        {changeQuery ? (
          <div className="search-result">
            <Suggest
              query={changeQuery}
              onBeforeScroll={this.props.blurInput}
              selectItem={this.selectItem}
            />
          </div>
        ) : null}
        <Route path={`${match.url}/:id`} component={SingerDetail} />
      </div>
    )
  }
}
