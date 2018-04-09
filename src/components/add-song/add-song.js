import React, { Component } from 'react'
import PropTypes from 'prop-types'

// 子组件
import { searchHOC } from 'common/js/HOC'
import SearchBox from 'base/search-box/search-box'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import SearchList from 'base/search-list/search-list'
import Suggest from 'components/suggest/suggest'
import Switch from 'base/switch/switch'
import TopTip from 'base/top-tip/top-tip'
// 动画
import { CSSTransition } from 'react-transition-group'
//util
import { Song } from 'common/js/song'

import './add-song.styl'

@searchHOC
export default class AddSong extends Component {
  static propTypes = {
    showFlag: PropTypes.bool
  }
  static defaultProps = {
    showFlag: false
  }
  constructor() {
    super()
    this.state = {
      currentIndex: 0, // 显示那一页
      switches: [{ name: '最近播放' }, { name: '搜索历史' }],
      showTip: false
    }
    this.probeType = 3
    this.showSinger = false
    this.delay = 2000

    this.switchFn = this.switchFn.bind(this)
    this.selectSong = this.selectSong.bind(this)
    this.enter = this.enter.bind(this)
    this.selectSuggest = this.selectSuggest.bind(this)

    this.playScroll = React.createRef()
    this.topTip = React.createRef()
  }

  switchFn(i) {
    this.setState({
      currentIndex: i
    })
  }
  selectSong(song, index) {
    // 为0 是正在播放的不用添加
    if (index !== 0) {
      this.props.insertSong(new Song(song))
      this.topTip.current.show()
    }
  }
  selectSuggest(song) {
    this.topTip.current.show()
    this.props.insertSong(song)
    this.props.saveSearch()
  }
  // hack正确的做法应该是使用三木运算选择渲染，但是这样就没有动画了
  enter(e) {
    this.playScroll.current.refresh()
  }
  render() {
    const { changeQuery, playHistory, searchHistory } = this.props
    return (
      <CSSTransition
        onEnter={this.enter}
        in={this.props.showFlag}
        timeout={300}
        classNames="fade"
      >
        <div
          className="add-song"
          onClick={e => e.stopPropagation()}
          style={{ display: this.props.showFlag ? '' : 'none' }}
        >
          <div className="header">
            <h1 className="title">添加歌曲到列表</h1>
            <div className="close" onClick={() => this.props.hide()}>
              <i className="icon-close" />
            </div>
          </div>
          <div className="search-box-wrapper">
            <SearchBox
              placeholder="搜索歌曲"
              ref={this.props.refSearchbox} // 取消blur
              onInput={this.props.onQueryChange}
            />
          </div>
          {!changeQuery ? (
            <div className="shortcut">
              <Switch
                switches={this.state.switches}
                currentIndex={this.state.currentIndex}
                switchFn={this.switchFn}
              />
              <div className="add-list-wrapper">
                {this.state.currentIndex === 0 ? (
                  <Scroll
                    probeType={this.probeType}
                    ref={this.playScroll}
                    className="list-scroll"
                    data={playHistory}
                  >
                    <div className="list-inner">
                      <SongList songs={playHistory} select={this.selectSong} />
                    </div>
                  </Scroll>
                ) : (
                  <Scroll
                    probeType={this.probeType}
                    className="list-scroll"
                    data={searchHistory}
                  >
                    <div className="list-inner">
                      <SearchList
                        deleteOne={this.props.deleteSearchHistory}
                        selectItem={this.props.addQuery}
                        searches={searchHistory}
                      />
                    </div>
                  </Scroll>
                )}
              </div>
            </div>
          ) : (
            <div className="search-result">
              <Suggest
                query={changeQuery}
                showSinger={this.showSinger}
                selectItem={this.selectSuggest}
                onBeforeScroll={this.props.blurInput}
              />
            </div>
          )}
          <TopTip ref={this.topTip}>
            <div className="tip-title">
              <i className="icon-ok" />
              <span className="text">1首歌已经添加到播放列表</span>
            </div>
          </TopTip>
        </div>
      </CSSTransition>
    )
  }
}
