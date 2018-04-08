import React, { Component } from 'react'
import PropTypes from 'prop-types'

// router
import { withRouter } from 'react-router-dom'

// 第三方库
// import classnames from 'classnames'

// 子组件
import SongList from 'base/song-list/song-list'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'

// util
import { prefix } from 'common/js/prefix'

// redux
import { connect } from 'react-redux'
import { selectPlay, randomPlay } from 'store/action'

// css
import './music-list.styl'

const RESERVED_HEIGHT = 40
const transform = prefix('transform')
const backdrop = prefix('backdrop-filter')

@withRouter
@connect(state => state, { selectPlay, randomPlay })
export default class MusicLlist extends Component {
  static propTypes = {
    title: PropTypes.string,
    bgImage: PropTypes.string,
    songs: PropTypes.array
  }
  static defaultProps = {
    title: '',
    bgImage: '',
    songs: []
  }

  constructor(props) {
    super(props)
    this.state = {
      scrollY: 0,
      rank: false
    }
    this.handleBack = this.handleBack.bind(this)
    this.slectItem = this.slectItem.bind(this)
    this.onScroll = this.onScroll.bind(this)
    this.handlePlayRandom = this.handlePlayRandom.bind(this)
    // ref
    this.bgImage = React.createRef()
    this.filter = React.createRef()
    this.bgLayer = React.createRef()
    this.list = React.createRef()
    this.playBtn = React.createRef()
    // scroll 常量
    this.listenScroll = true
    this.probeType = 3
  }
  componentDidMount() {
    this.style = {
      backgroundImage: `url(${this.props.bgImage})`
    }
    // 动画相关
    this.imageHeight = this.bgImage.current.clientHeight // 图片高度
    // 最小拉伸度y
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
    // 设置scroll的top为图片高度
    this.list.current.scrollWrapper.current.style.top = `${this.imageHeight}px`
  }
  // dom事件
  handleBack() {
    this.props.history.goBack()
  }
  // 随机播放
  handlePlayRandom() {
    this.props.randomPlay &&
      this.props.randomPlay({
        list: this.props.songs
      })
  }
  // 业务操作
  slectItem(song, index) {
    this.props.selectPlay &&
      this.props.selectPlay({
        list: this.props.songs,
        index,
        mode: this.props.player.mode
      })
  }
  onScroll(scroll) {
    let y = scroll.y
    let translateY = Math.max(this.minTranslateY, y) // 当y改变时，最大不超过minTranslateY
    let scale = 1
    let zIndex = 0
    let blur = 0
    const percent = Math.abs(y / this.imageHeight)
    if (y > 0) {
      scale = 1 + percent // 拉伸
      zIndex = 10 //
    } else {
      blur = Math.min(20, percent * 20)
    }
    // 下拉和上滑会表现出不同的效果，下拉取y值，上滑取最大到minTranslateY
    this.bgLayer.current.style[transform] = `translate3d(0, ${translateY}px, 0)`
    // 下拉不虚华， 上滑虚化最大20
    this.filter.current.style[backdrop] = `blur(${blur}px)`
    if (y < this.minTranslateY) {
      zIndex = 10
      // 一直上滑y一直变小，当y小到this.minTranslateY 这个临界值，就设置背景和按钮的style
      this.bgImage.current.style.paddingTop = 0
      this.bgImage.current.style.height = `${RESERVED_HEIGHT}px`
      this.playBtn.current.style.display = 'none'
    } else {
      // 其他情况不变
      this.bgImage.current.style.paddingTop = '70%'
      this.bgImage.current.style.height = 0
      this.playBtn.current.style.display = ''
    }
    // 上滑scale为1， 下滑y为正，scale为1+
    this.bgImage.current.style[transform] = `scale(${scale})`
    // 当上滑的时候，y为负数，滑倒bgLayer到达标题处，zIndex设置为10，这样就能覆盖住bglayer
    // 下滑y为正，zIndex一定要比bglayer大
    this.bgImage.current.style.zIndex = zIndex
  }
  render() {
    return (
      <div className="music-list">
        <div className="back" onClick={this.handleBack}>
          <i className="icon-back" />
        </div>
        <h1 className="title">{this.props.title}</h1>
        <div className="bg-image" style={this.style} ref={this.bgImage}>
          <div className="play-wrapper">
            {this.props.songs.length > 0 ? (
              <div
                className="play"
                ref={this.playBtn}
                onClick={this.handlePlayRandom}
              >
                <i className="icon-play" />
                <span className="text">随机播放全部</span>
              </div>
            ) : null}
          </div>
          <div className="filter" ref={this.filter} />
        </div>
        <div className="bg-layer" ref={this.bgLayer} />
        <Scroll
          data={this.props.songs}
          listenScroll={this.listenScroll}
          probeType={this.probeType}
          onScroll={this.onScroll}
          className="list"
          ref={this.list}
        >
          <div className="song-list-wrapper">
            <SongList
              songs={this.props.songs}
              rank={this.state.rank}
              select={this.slectItem}
            />
          </div>
          {!this.props.songs.length ? <Loading title="正在加载..." /> : null}
        </Scroll>
      </div>
    )
  }
}
