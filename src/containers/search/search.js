import React, { Component } from 'react'

// redux
import { connect } from 'react-redux'
import { set_singer } from 'store/action-creator'
import { insertSong, clearSearchHistory } from 'store/action'
// url
import { Route } from 'react-router-dom'
import SingerDetail from 'components/singer-detail/singer-detail'
// 子组件
import SearchBox from 'base/search-box/search-box'
import Suggest from 'components/suggest/suggest'
import Scroll from 'base/scroll/scroll'
import SearchList from 'base/search-list/search-list'
import Confirm from 'base/confirm/confirm'
//api
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/config'
import { searchHOC } from 'common/js/HOC'
import Singer from 'common/js/singer'

import './search.styl'

const SINGER_TYPE = 'singer'
@searchHOC
@connect(state => state, { set_singer, insertSong, clearSearchHistory })
export default class Search extends Component {
  constructor() {
    super()
    this.state = {
      hotKey: []
    }
    this.selectItem = this.selectItem.bind(this)
    this.showConfirm = this.showConfirm.bind(this)
    this.probeType = 3
    this.confirm = React.createRef()
    this.shortcutWrapper = React.createRef()
    this.shortcut = React.createRef()
    this.searchResult = React.createRef()
    this.suggest = React.createRef()
  }
  componentDidMount() {
    this._getHotKey()
  }
  shouldComponentUpdate(nextProps) {
    const bottom = nextProps.player.playList.length > 0 ? '60px' : ''
    if (this.shortcutWrapper.current) {
      this.shortcutWrapper.current.style.bottom = bottom
      this.shortcut.current.refresh()
    }

    if (this.searchResult.current) {
      this.searchResult.current.style.bottom = bottom
      this.suggest.current.refresh()
    }
    return true
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
  showConfirm() {
    this.confirm.current.show()
  }
  render() {
    let { changeQuery, match, searchHistory } = this.props
    let shortcut = this.state.hotKey.concat(searchHistory)
    return (
      <div className="search">
        <div className="search-box-wrapper">
          <SearchBox
            ref={this.props.refSearchbox}
            onInput={this.props.onQueryChange}
          />
        </div>
        {!changeQuery ? (
          <div className="shortcut-wrapper" ref={this.shortcutWrapper}>
            <Scroll
              className="shortcut"
              probeType={this.probeType}
              data={shortcut}
              ref={this.shortcut}
            >
              <div>
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
                {searchHistory.length > 0 ? (
                  <div className="search-history">
                    <h1 className="title">
                      <span className="text">搜索历史</span>
                      <span className="clear" onClick={this.showConfirm}>
                        <i className="icon-clear" />
                      </span>
                    </h1>
                    <SearchList
                      searches={searchHistory}
                      selectItem={this.props.addQuery}
                      deleteOne={this.props.deleteSearchHistory}
                    />
                  </div>
                ) : null}
              </div>
            </Scroll>
          </div>
        ) : (
          <div className="search-result" ref={this.searchResult}>
            <Suggest
              query={changeQuery}
              onBeforeScroll={this.props.blurInput}
              selectItem={this.selectItem}
              ref={this.suggest}
            />
          </div>
        )}
        <Confirm
          ref={this.confirm}
          text="是否清空所有搜索历史"
          confirmBtnText="清空"
          confirm={this.props.clearSearchHistory}
        />
        <Route path={`${match.url}/:id`} component={SingerDetail} />
      </div>
    )
  }
}
