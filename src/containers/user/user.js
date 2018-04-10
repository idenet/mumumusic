import React, { Component } from 'react'
//redux
import { connect } from 'react-redux'
import { randomPlay, insertSong } from 'store/action'
//子组件
import Switch from 'base/switch/switch'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import NoResult from 'base/no-result/no-result'
//css
import { CSSTransition } from 'react-transition-group'
//util
import { Song } from 'common/js/song'

import './user.styl'
@connect(state => state, { randomPlay, insertSong })
export default class User extends Component {
  constructor() {
    super()
    this.state = {
      showflag: false,
      switches: [{ name: '我喜欢的' }, { name: '最近听的' }],
      currentIndex: 0
    }

    this.back = this.back.bind(this)
    this.switchFn = this.switchFn.bind(this)
    this.random = this.random.bind(this)
    this.selectSong = this.selectSong.bind(this)

    this.probeType = 3

    this.listWrapper = React.createRef()
    this.favoriteList = React.createRef()
    this.playList = React.createRef()
  }
  componentDidMount() {
    // emmm 当进入route的时候 调用这个回调。然后就有动画了
    this.setState({
      showflag: true
    })
  }
  shouldComponentUpdate(nextProps, nextState) {
    const bottom = nextProps.player.playList.length > 0 ? '60px' : ''
    // 如果当前页是user  需要判断·
    if (this.listWrapper.current) {
      this.listWrapper.current.style.bottom = bottom
      this.favoriteList.current && this.favoriteList.current.refresh()
      this.playList.current && this.playList.current.refresh()
    }
    return true
  }
  switchFn(i) {
    this.setState({
      currentIndex: i
    })
  }
  random() {
    let list =
      this.state.currentIndex === 0
        ? this.props.favoriteHistory
        : this.props.playHistory
    if (list.length === 0) {
      return
    }
    list = list.map(v => new Song(v))
    this.props.randomPlay({ list })
  }
  selectSong(v) {
    this.props.insertSong(new Song(v))
  }
  back() {
    this.props.history.goBack()
  }
  render() {
    const noResultDesc =
      this.state.currentIndex === 0 ? '暂无收藏歌曲' : '你还没有听过歌曲'
    const showResult =
      this.state.currentIndex === 0
        ? this.props.favoriteHistory.length
        : this.props.playHistory.length
    return (
      <CSSTransition in={this.state.showflag} timeout={300} classNames="fade">
        <div className="user-center">
          <div className="back" onClick={this.back}>
            <i className="icon-back" />
          </div>
          <div className="switches-wrapper">
            <Switch
              switches={this.state.switches}
              currentIndex={this.state.currentIndex}
              switchFn={this.switchFn}
            />
          </div>
          <div className="play-btn" onClick={this.random}>
            <i className="icon-play" />
            <span className="text">随机播放全部</span>
          </div>
          {showResult ? (
            <div className="list-wrapper" ref={this.listWrapper}>
              {this.state.currentIndex === 0 ? (
                <Scroll
                  ref={this.playList}
                  probeType={this.probeType}
                  className="list-scroll"
                >
                  <div className="list-inner">
                    <SongList
                      songs={this.props.favoriteHistory}
                      select={this.selectSong}
                    />
                  </div>
                </Scroll>
              ) : (
                <Scroll
                  ref={this.favoriteList}
                  className="list-scroll"
                  probeType={this.probeType}
                >
                  <div className="list-inner">
                    <SongList
                      songs={this.props.playHistory}
                      select={this.selectSong}
                    />
                  </div>
                </Scroll>
              )}
            </div>
          ) : (
            <div className="no-result-wrapper">
              <NoResult title={noResultDesc} />
            </div>
          )}
        </div>
      </CSSTransition>
    )
  }
}
