import React, { Component } from 'react'
// 动画
import { CSSTransition } from 'react-transition-group'
import animations from 'create-keyframe-animation'
import Scroll from 'base/scroll/scroll'
// redux
import { connect } from 'react-redux'
import { set_fullScreen } from 'store/action-creator'
//util
import { playMode } from 'common/js/config'
import { playerHOC } from 'common/js/HOC'
import { prefix } from 'common/js/prefix'
import Lyric from 'lyric-parser'
// 子组件
import ProgressBar from 'components/progress-bar/progress-bar'
import ProgressCircle from 'base/progress-circle/progress-circle'
import PlayList from 'components/play-list/play-list'
// css
import classnames from 'classnames'
import './player.styl'

// util

const transform = prefix('transform')
const transitionDuration = prefix('transitionDuration')
const timeExp = /\[(\d{2}):(\d{2}):(\d{2})]/g
@playerHOC
@connect(state => state, { set_fullScreen })
export default class Player extends Component {
  constructor() {
    super()
    this.state = {
      songReady: false, // 歌曲是否准备的标志位
      currentTime: 0, // 播放的当前时间
      playingLyric: '',
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'cd',
      isPureMusic: false, // 是否是纯音乐歌词
      pureMusicLyric: '' // 纯音乐歌词
    }
    this.touch = {}
    this.probeType = 3
    this.hanldeClickBack = this.hanldeClickBack.bind(this)
    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleTogglePlaying = this.handleTogglePlaying.bind(this)
    this.next = this.next.bind(this)
    this.prev = this.prev.bind(this)
    this.format = this.format.bind(this)
    this.handlePercentChangeEnd = this.handlePercentChangeEnd.bind(this)
    this.handlePercentChanging = this.handlePercentChanging.bind(this)
    // audio
    this.ready = this.ready.bind(this)
    this.error = this.error.bind(this)
    this.updateTime = this.updateTime.bind(this)
    this.end = this.end.bind(this)
    this.paused = this.paused.bind(this)
    // ref
    this.cdWrapper = React.createRef()
    this.audio = React.createRef()
    this.middleL = React.createRef()
    this.lyricList = React.createRef()
    this.lyriclines = React.createRef()
    this.imageWrapper = React.createRef()
    this.image = React.createRef()
    this.miniWrapper = React.createRef()
    this.miniImage = React.createRef()
    this.progressBar = React.createRef()
    // 歌词
    this.touchStart = this.touchStart.bind(this)
    this.touchMove = this.touchMove.bind(this)
    this.touchEnd = this.touchEnd.bind(this)
  }
  shouldComponentUpdate(nextProps, nextState) {
    this._watchCurrentSong(nextProps)
    this._watchPlaying(nextProps)
    return true
  }
  _watchCurrentSong(nextProps) {
    const nextSong = nextProps.player.currentSong
    const oldSong = this.props.player.currentSong
    if (
      !nextSong ||
      !nextSong.id ||
      !nextSong.url ||
      nextSong.id === oldSong.id
    ) {
      return false
    }
    // 这个是vue中$nextTick的问题，react中不需要。？
    // this.setState({
    //   songReady: false
    // })
    this.canLyricPlay = false
    // 切换歌曲，重置歌词数据
    if (this.state.currentLyric) {
      this.state.currentLyric.stop()
      this.setState({
        currentLyric: null,
        playingLyric: '',
        currentLineNum: 0
      })
    }
    let audio = this.audio.current
    audio.src = nextSong.url
    setTimeout(() => {
      audio.play()
    }, 20)
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.setState({
        songReady: true
      })
    }, 5000)
    this.getLyric(nextSong)
  }
  _watchPlaying(nextProps) {
    if (!this.state.songReady) {
      return false
    }
    let audio = this.audio.current
    let newPlaying = nextProps.player.playing
    setTimeout(() => {
      newPlaying ? audio.play() : audio.pause()
    }, 20)
    if (!newPlaying) {
      if (nextProps.player.fullScreen) {
        this.syncWrapperTransform(this.imageWrapper.current, this.image.current)
      } else {
        this.syncWrapperTransform(
          this.miniWrapper.current,
          this.miniImage.current
        )
      }
    }
  }
  /******************歌词 */
  getLyric(nextSong) {
    nextSong
      .getLyric()
      .then(lyric => {
        if (nextSong.lyric !== lyric) {
          return
        }
        const currentLyric = new Lyric(lyric, this.handleLyric.bind(this))
        this.setState(
          {
            currentLyric,
            isPureMusic: !currentLyric.lines.length
          },
          () => {
            if (this.state.isPureMusic) {
              const pureMusicLyric = this.state.currentLyric.lrc
                .replace(timeExp, '')
                .trim()
              this.setState({
                pureMusicLyric,
                playingLyric: pureMusicLyric
              })
            } else {
              if (this.props.player.playing && this.canLyricPlay) {
                this.state.currentLyric.seek(this.state.currentTime * 1000)
              }
            }
          }
        )
      })
      .catch(() => {
        this.setState({
          currentLyric: null,
          playingLyric: '',
          currentLineNum: 0
        })
      })
  }
  handleLyric({ lineNum, txt }) {
    // 根据子元素的长度判断，注意this
    if (!this.lyriclines.current.children.length) {
      return
    }
    if (lineNum > 5) {
      // 让current歌词持续保持在中心
      let lineEl = this.lyriclines.current.children[lineNum - 5]
      this.lyricList.current.scrollToElement(lineEl, 1000)
    } else {
      this.lyricList.current.scrollTo(0, 0, 1000)
    }
    this.setState({
      currentLineNum: lineNum,
      playingLyric: txt
    })
  }
  touchStart(e) {
    const touch = e.touches[0]
    this.touch.init = true
    // 是否为一次移动
    this.touch.moved = false
    this.touch.startX = touch.pageX
    this.touch.startY = touch.pageY
  }
  touchMove(e) {
    if (!this.touch.init) return
    const touch = e.touches[0]
    const deltaX = touch.pageX - this.touch.startX // x轴的移动距离
    const deltaY = touch.pageY - this.touch.startY // Y轴的移动距离
    // 向下滚动
    if (Math.abs(deltaY) > Math.abs(deltaX)) return
    if (!this.touch.moved) {
      this.touch.moved = true
    }
    const left = this.state.currentShow === 'cd' ? 0 : -window.innerWidth
    // 最大移动到0，也就是cd位置，最小移动到-100%，也就是歌词位置
    // offsetWidth --> 0 ~-window.innerWidth之间
    const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
    // 百分比
    this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
    this.scrollWrapper = this.lyricList.current.scrollWrapper.current
    this.scrollWrapper.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
    this.scrollWrapper.style[transitionDuration] = 0
    // 虚化程度
    this.middleL.current.style.opacity = 1 - this.touch.percent
    this.middleL.current.style[transitionDuration] = 0
  }
  touchEnd(e) {
    if (!this.touch.moved) return
    let offsetWidth
    let opacity
    if (this.state.currentShow === 'cd') {
      // 从右往左滑动大于10%
      if (this.touch.percent > 0.1) {
        offsetWidth = -window.innerWidth
        opacity = 0
        this.setState({
          currentShow: 'lyric'
        })
      } else {
        offsetWidth = 0
        opacity = 1
      }
    } else {
      // 从左往右滑动大于10%
      if (this.touch.percent < 0.9) {
        offsetWidth = 0
        opacity = 1
        this.setState({
          currentShow: 'cd'
        })
      } else {
        offsetWidth = -window.innerWidth
        opacity = 0
      }
    }
    const time = 300
    this.scrollWrapper.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
    this.scrollWrapper.style[transitionDuration] = `${time}ms`
    this.middleL.current.style.opacity = opacity
    this.middleL.current.style[transitionDuration] = `${time}ms`
    this.touch.init = false
  }
  /*************动画 */
  enter(el, isAppearing) {
    el.style.display = 'block'
    const { x, y, scale } = this._getPosAndScale()
    let animation = {
      0: {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      },
      60: {
        transform: `translate3d(0,0,0) scale(1.1)`
      },
      100: {
        transform: `translate3d(0,0,0) scale(1)`
      }
    }
    animations.registerAnimation({
      name: 'move',
      animation,
      presets: {
        duration: 400,
        easing: 'linear'
      }
    })
    animations.runAnimation(this.cdWrapper.current, 'move')
  }
  entered(el, isAppearing) {
    animations.unregisterAnimation('move')
    this.cdWrapper.current.style.animation = ''
  }
  exit(el) {
    this.cdWrapper.current.style.transition = 'all 0.4s'
    const { x, y, scale } = this._getPosAndScale()
    this.cdWrapper.current.style[
      transform
    ] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
  }
  exited(el) {
    this.cdWrapper.current.style.transition = ''
    this.cdWrapper.current.style[transform] = ''
    el.style.display = 'none'
  }
  _getPosAndScale() {
    const targetWidth = 40 // 目标，小mini播放器宽度
    const paddingLeft = 40 // 小mini播放器距离左边到中心
    const paddingBottom = 30 // 距离底边到中心的长度
    const paddingTop = 80 // 大的到顶部有个80的距离
    const width = window.innerWidth * 0.8 // 大cd的宽度(80%)
    const scale = targetWidth / width // 缩小比例
    const x = -(window.innerWidth / 2 - paddingLeft) // 动画x偏移
    const y = window.innerHeight - paddingTop - width / 2 - paddingBottom // 动画y偏移
    return {
      x,
      y,
      scale
    }
  }
  /*************动画结束 */
  /*************播放器 */
  ready() {
    clearTimeout(this.timer)
    this.setState({
      songReady: true
    })
    this.canLyricPlay = true // 开始播放歌词
    // 如果歌曲的播放晚于歌词的出现，播放的时候需要同步歌词
    if (this.state.currentLyric && !this.state.isPureMusic) {
      this.state.currentLyric.seek(this.state.currentTime * 1000)
    }
  }
  end() {
    this.setState({
      currentTime: 0
    })
    // 单曲循环
    if (this.props.player.mode === playMode.loop) {
      this.loop()
    } else {
      this.next()
    }
  }
  paused() {
    // 如果网页有多个音频
    this.props.set_playing(false)
    if (this.state.currentLyric) {
      this.state.currentLyric.stop()
    }
  }
  error() {
    // 出错则设置为true，不让程序crash
    clearTimeout(this.timer)
    this.setState({
      songReady: true
    })
  }
  loop() {
    this.audio.current.currentTime = 0
    this.audio.current.play()
    this.props.set_playing(true)
    // 如果是循环播放则把歌词弄到0
    if (this.state.currentLyric) {
      this.state.currentLyric.seek(0)
    }
  }
  updateTime(e) {
    this.setState({
      currentTime: e.target.currentTime
    })
  }
  format(interval) {
    interval = interval | 0 // 向下取整
    const minute = (interval / 60) | 0
    const second = (interval % 60 + '').padStart(2, '0')
    return `${minute}:${second}`
  }
  /*************播放器结束 */
  /*************功能区 */
  next() {
    if (!this.state.songReady) {
      return
    }
    // 如果只有一首歌曲
    if (this.props.player.playList.length === 1) {
      this.loop()
      return
    } else {
      let index = this.props.player.currentIndex + 1
      if (index === this.props.player.playList.length) {
        index = 0
      }
      this.props.set_currentIndex(index)
      // false 状态下 前进后退要改状态
      if (!this.props.player.playing) {
        this.handleTogglePlaying()
      }
    }
    this.setState({
      songReady: false
    })
  }
  prev() {
    if (!this.state.songReady) {
      return
    }
    if (this.props.player.playList.length === 1) {
      this.loop()
      return
    } else {
      let index = this.props.player.currentIndex - 1
      if (index === -1) {
        index = this.props.player.playList.length - 1
      }
      this.props.set_currentIndex(index)
      if (!this.props.player.playing) {
        this.handleTogglePlaying()
      }
    }
    this.setState({
      songReady: false
    })
  }
  handleTogglePlaying(e) {
    if (e) {
      e.stopPropagation()
    }
    // 若audio未准备好
    if (!this.state.songReady) return
    this.props.set_playing(!this.props.player.playing)
    // 歌词也暂停
    if (this.state.currentLyric) {
      this.state.currentLyric.togglePlay()
    }
  }
  handlePercentChanging(percent) {
    const currentTime = this.props.player.currentSong.duration * percent
    this.setState({
      currentTime
    })
    // 改变进度条同时改变歌词进度
    if (this.state.currentLyric) {
      this.state.currentLyric.seek(currentTime * 1000)
    }
  }
  handlePercentChangeEnd(percent) {
    const currentTime = this.props.player.currentSong.duration * percent
    this.setState({
      currentTime
    })
    this.audio.current.currentTime = currentTime
    if (this.state.currentLyric) {
      this.state.currentLyric.seek(currentTime * 1000)
    }
    // 改变后马上变为播放
    if (!this.props.player.playing) {
      this.handleTogglePlaying()
    }
  }
  /*************功能区 */
  // handle事件
  hanldeClickBack() {
    this.props.set_fullScreen(false)
  }
  handleClickOpen() {
    this.props.set_fullScreen(true)
  }
  /**************bug 修复 */
  /**
   * 计算内层Image的transform，并同步到外层容器
   * @param wrapper
   * @param inner
   */
  syncWrapperTransform(wrapper, inner) {
    if (!wrapper) {
      return
    }
    let wTransform = getComputedStyle(wrapper)[transform]
    let iTransform = getComputedStyle(inner)[transform]
    wrapper.style[transform] =
      wTransform === 'none' ? iTransform : iTransform.concat(' ', wTransform)
  }
  render() {
    const { fullScreen, currentSong, currentIndex, playing } = this.props.player
    const playIcon = playing ? 'icon-pause' : 'icon-play'
    const miniIcon = playing ? 'icon-pause-mini' : 'icon-play-mini'
    const cdCls = playing ? 'play' : ''
    const disableCls = this.state.songReady ? '' : 'disable'
    const percent = this.state.currentTime / currentSong.duration
    const radius = 32 // 圆的宽度
    return (
      <div className="player">
        <CSSTransition
          in={fullScreen}
          timeout={300}
          classNames="normal"
          onEnter={el => this.enter(el)}
          onEntered={el => this.entered(el)}
          onExit={el => this.exit(el)}
          onExited={el => this.exited(el)}
        >
          <div className="normal-player">
            {/* 背景 */}
            <div className="background">
              <img src={currentSong.image} alt="" width="100%" height="100%" />
            </div>
            {/* 顶部状态栏 */}
            <div className="top">
              <div className="back" onClick={this.hanldeClickBack}>
                <i className="icon-back" />
              </div>
              <h1 className="title">{currentSong.name}</h1>
              <h2 className="subtitle">{currentSong.singer}</h2>
            </div>
            {/* 中间 */}
            <div
              className="middle"
              onTouchStart={this.touchStart}
              onTouchMove={this.touchMove}
              onTouchEnd={this.touchEnd}
            >
              <div className="middle-l" ref={this.middleL}>
                <div className="cd-wrapper" ref={this.cdWrapper}>
                  <div className="cd" ref={this.imageWrapper}>
                    <img
                      src={currentSong.image}
                      alt=""
                      className={`image ${cdCls}`}
                      ref={this.image}
                    />
                  </div>
                </div>
                <div className="playing-lyric-wrapper">
                  <div className="playing-lyric">{this.state.playingLyric}</div>
                </div>
              </div>
              <Scroll
                className="middle-r"
                probeType={this.probeType}
                ref={this.lyricList}
                data={this.state.currentLyric && this.state.currentLyric.lines}
              >
                <div className="lyric-wrapper">
                  {this.state.currentLyric ? (
                    <div ref={this.lyriclines}>
                      {this.state.currentLyric.lines.map((v, i) => (
                        <p
                          key={v.time}
                          className={classnames('text', {
                            current: this.state.currentLineNum === i
                          })}
                        >
                          {v.txt}
                        </p>
                      ))}
                    </div>
                  ) : null}
                  {this.state.isPureMusic ? (
                    <div className="pure-music">
                      <p>{this.state.pureMusicLyric}</p>
                    </div>
                  ) : null}
                </div>
              </Scroll>
            </div>
            {/* 下面 */}
            <div className="bottom">
              <div className="dot-wrapper">
                <span
                  className={classnames('dot', {
                    active: this.state.currentShow === 'cd'
                  })}
                />
                <span
                  className={classnames('dot', {
                    active: this.state.currentShow === 'lyric'
                  })}
                />
              </div>
              <div className="progress-wrapper">
                <span className="time time-l">
                  {this.format(this.state.currentTime)}
                </span>
                <div className="progress-bar-wrapper">
                  <ProgressBar
                    percent={percent}
                    percentChanging={this.handlePercentChanging}
                    percentChangeEnd={this.handlePercentChangeEnd}
                    ref={this.progressBar}
                  />
                </div>
                <span className="time time-r">
                  {this.format(currentSong.duration)}
                </span>
              </div>
              <div className="operators">
                <div className="icon i-left">
                  <i
                    className={this.props.modeIcon}
                    onClick={this.props.changeMode}
                  />
                </div>
                <div className={`icon i-left ${disableCls}`}>
                  <i className="icon-prev" onClick={this.prev} />
                </div>
                <div className={`icon i-center ${disableCls}`}>
                  <i className={playIcon} onClick={this.handleTogglePlaying} />
                </div>
                <div className={`icon i-right ${disableCls}`}>
                  <i className="icon-next" onClick={this.next} />
                </div>
                <div className={`icon i-right ${disableCls}`}>
                  <i className="icon icon-not-favorite" />
                </div>
              </div>
            </div>
          </div>
        </CSSTransition>
        {!fullScreen && currentIndex > -1 ? (
          <div className="mini-player" onClick={this.handleClickOpen}>
            <div className="icon">
              <div className="img-wrapper" ref={this.miniWrapper}>
                <img
                  src={currentSong.image}
                  alt=""
                  width="40"
                  height="40"
                  className={cdCls}
                  ref={this.miniImage}
                />
              </div>
            </div>
            <div className="text">
              <h2 className="name">{currentSong.name}</h2>
              <p className="desc">{currentSong.singer}</p>
            </div>
            <div className="control">
              <ProgressCircle radius={radius} percent={percent}>
                <i
                  className={`icon-mini ${miniIcon}`}
                  onClick={this.handleTogglePlaying}
                />
              </ProgressCircle>
            </div>
            <div className="control">
              <i className="icon-playlist" />
            </div>
          </div>
        ) : null}
        <PlayList />
        <audio
          ref={this.audio}
          onPlaying={this.ready}
          onError={this.error}
          src={currentSong.url}
          onTimeUpdate={this.updateTime}
          onEnded={this.end}
          onPause={this.paused}
        />
      </div>
    )
  }
}
