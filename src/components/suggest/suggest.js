import React, { Component } from 'react'
import PropTypes from 'prop-types'

//子组件
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import NoResult from 'base/no-result/no-result'
// api
import { search } from 'api/search'
import { ERR_OK } from 'api/config'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'

import './suggest.styl'

const TYPE_SINGER = 'singer'
const perpage = 20

export default class Suggest extends Component {
  static propTypes = {
    query: PropTypes.string,
    showSinger: PropTypes.bool,
    selectItem: PropTypes.func
  }
  static defaultProps = {
    query: '',
    showSinger: true,
    selectItem: f => f
  }
  constructor() {
    super()
    this.state = {
      page: 1,
      hasMore: true,
      result: []
    }
    this.probeType = 3
    this.beforeScroll = true
    this.pullup = true

    //ref
    this.suggest = React.createRef()
    // bind
    this.searchMore = this.searchMore.bind(this)
    this.getIconCls = this.getIconCls.bind(this)
  }
  componentDidMount() {
    this._search(this.props.query)
  }
  _search(query) {
    this.setState(
      {
        page: 1,
        hasMore: true
      },
      () => {
        this.suggest.current.scrollTo(0, 0)
        search(query, this.state.page, this.props.showSinger, perpage).then(
          res => {
            if (res.code === ERR_OK) {
              this._genResult(res.data).then(result => {
                this.setState({
                  result: result
                })
              })
              this._checkMore(res.data)
            }
          }
        )
      }
    )
  }
  searchMore() {
    if (!this.state.hasMore) {
      return
    }
    let page = this.state.page
    page++
    this.setState(
      {
        page: page
      },
      () => {
        search(
          this.props.query,
          this.state.page,
          this.props.showSinger,
          perpage
        ).then(res => {
          if (res.code === ERR_OK) {
            this._genResult(res.data).then(result => {
              this.setState({
                result: this.state.result.concat(result)
              })
            })
            this._checkMore(res.data)
          }
        })
      }
    )
  }
  _checkMore(data) {
    const song = data.song
    if (
      !song.list.length ||
      song.curnum + (song.curpage - 1) * perpage >= song.totalnum
    ) {
      this.setState({
        hasMore: false
      })
    }
  }
  _genResult(data) {
    let ret = []
    if (data.zhida && data.zhida.singerid && this.state.page === 1) {
      ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } })
    }
    return processSongsUrl(this._normalizeSongs(data.song.list)).then(songs => {
      ret = ret.concat(songs)
      return ret
    })
  }
  _normalizeSongs(list) {
    let ret = []
    list.forEach(musicData => {
      if (isValidMusic(musicData)) {
        ret.push(createSong(musicData))
      }
    })
    return ret
  }
  getIconCls(v) {
    if (v.type === TYPE_SINGER) {
      return 'icon-mine'
    } else {
      return 'icon-music'
    }
  }
  getDisplayName(v) {
    if (v.type === TYPE_SINGER) {
      return { __html: v.singername }
    } else {
      return { __html: `${v.name}-${v.singer}` }
    }
  }
  render() {
    return (
      <Scroll
        probeType={this.probeType}
        data={this.state.result}
        pullup={this.pullup}
        onPullup={this.searchMore}
        className="suggest"
        beforeScroll={this.beforeScroll}
        onBeforeScroll={this.props.onBeforeScroll}
        ref={this.suggest}
      >
        <ul className="suggest-list">
          {this.state.result.length
            ? this.state.result.map((v, i) => (
                <li
                  className="suggest-item"
                  key={v.mid + v.name}
                  onClick={() => this.props.selectItem(v)}
                >
                  <div className="icon">
                    <i className={this.getIconCls(v)} />
                  </div>
                  <div className="name">
                    <p
                      dangerouslySetInnerHTML={this.getDisplayName(v)}
                      className="text"
                    />
                  </div>
                </li>
              ))
            : null}
          <div className="loading">
            {this.state.hasMore ? <Loading title="" /> : null}
          </div>
        </ul>
        <div className="no-result-wrapper">
          {!this.state.hasMore && !this.state.result.length ? (
            <NoResult title="抱歉，暂无搜索结果" />
          ) : null}
        </div>
      </Scroll>
    )
  }
}
