import React, { Component } from 'react'

// HOC
import { playerHOC } from 'common/js/HOC'
//redux
//子组件
import Scroll from 'base/scroll/scroll'
import Confirm from 'base/confirm/confirm'
import AddSong from 'components/add-song/add-song'
//util
import { playMode } from 'common/js/config'
import classnames from 'classnames'
// animation
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import './play-list.styl'

@playerHOC
// @connect(null, { deleteSongList }) // 被包裹高阶组件的子组件，这个被包裹的用ref调用会出问题
export default class PlayList extends Component {
  constructor() {
    super()
    this.state = {
      showFlag: false,
      showSong: false
    }
    this.probeType = 3
    this.hide = this.hide.bind(this)
    this.show = this.show.bind(this)
    this.confirmClear = this.confirmClear.bind(this)
    this.showConfirm = this.showConfirm.bind(this)
    this.showAddSong = this.showAddSong.bind(this)
    this.hideAddSong = this.hideAddSong.bind(this)
    //ref
    this.listContent = React.createRef()
    this.listGroup = React.createRef()
    this.confirm = React.createRef()
    this.addsong = React.createRef()
  }
  shouldComponentUpdate(nextProps, nextState) {
    const oldSong = this.props.player.currentSong
    const newSong = nextProps.player.currentSong
    const sequenceList = nextProps.player.sequenceList
    if (newSong.id !== oldSong.id) {
      this._scrollToCurrent(newSong, sequenceList)
    }
    return true
  }
  _scrollToCurrent(song, list) {
    const index = list.findIndex(v => {
      return song.id === v.id
    })
    if (!this.listContent.current) return
    this.listContent.current.scrollToElement(
      [...this.listGroup.current.children[0].children][index],
      300
    )
  }
  exit(el) {
    // 离开动画hack 离开动画在exit直接变成了dispaly none
    el.style.display = 'block'
  }
  exited(el) {
    el.style.display = 'none'
  }
  selectItem(v, i) {
    if (this.props.player.mode === playMode.random) {
      i = this.props.player.playList.findIndex(song => {
        return song.id === v.id
      })
    }
    this.props.set_currentIndex(i)
    this.props.set_playing(true)
  }
  show() {
    this.setState(
      {
        showFlag: true
      },
      () => {
        // 使用回调，在set为true后直接刷新scroll
        if (this.listContent.current) {
          this.listContent.current.refresh()
          this._scrollToCurrent(
            this.props.player.currentSong,
            this.props.player.sequenceList
          )
        }
      }
    )
  }
  hide() {
    this.setState({
      showFlag: false
    })
  }
  showConfirm() {
    this.confirm.current.show()
  }
  confirmClear() {
    this.props.deleteSongList()
    this.hide()
  }
  toggleFavorite(v, e) {
    e.stopPropagation()
    this.props.toggleFavorite(v)
  }
  deleteOne(v, e) {
    e.stopPropagation()
    this.props.deleteSong(v)
  }
  showAddSong() {
    this.setState({
      showSong: true
    })
  }
  hideAddSong() {
    this.setState({
      showSong: false
    })
  }
  render() {
    const { mode, sequenceList, currentSong } = this.props.player
    const modeText =
      mode === playMode.sequence
        ? '顺序播放'
        : mode === playMode.random ? '随机播放' : '循环播放'
    return (
      <CSSTransition
        in={this.state.showFlag}
        timeout={300}
        classNames="list-fade"
        onExit={el => this.exit(el)}
        onExited={el => this.exited(el)}
      >
        <div
          className="playlist"
          style={{ display: this.state.showFlag ? 'block' : 'none' }}
          onClick={this.hide}
        >
          <div className="list-wrapper" onClick={e => e.stopPropagation()}>
            <div className="list-header">
              <h1 className="title">
                <i
                  className={`icon ${this.props.modeIcon}`}
                  onClick={this.props.changeMode}
                />
                <span className="text">{modeText}</span>
                <span className="clear" onClick={this.showConfirm}>
                  <i className="icon-clear" />
                </span>
              </h1>
            </div>
            <Scroll
              probeType={this.probeType}
              data={sequenceList}
              className="list-content"
              ref={this.listContent}
            >
              <div ref={this.listGroup}>
                <TransitionGroup>
                  {sequenceList.map((v, i) => (
                    <CSSTransition key={v.id} timeout={300} classNames="list">
                      <li
                        className="item"
                        onClick={() => this.selectItem(v, i)}
                      >
                        <i
                          className={classnames('current', {
                            'icon-play': currentSong.id === v.id
                          })}
                        />
                        <span className="text">{v.name}</span>
                        <span
                          className="like"
                          onClick={e => this.toggleFavorite(v, e)}
                        >
                          <i className={this.props.getFavoriteIcon(v)} />
                        </span>
                        <span
                          className="delete"
                          onClick={e => this.deleteOne(v, e)}
                        >
                          <i className="icon-delete" />
                        </span>
                      </li>
                    </CSSTransition>
                  ))}
                </TransitionGroup>
              </div>
            </Scroll>
            <div className="list-operate">
              <div className="add" onClick={this.showAddSong}>
                <i className="icon-add" />
                <span className="text">添加歌曲到列表</span>
              </div>
            </div>
            <div className="list-close" onClick={this.hide}>
              <span>关闭</span>
            </div>
          </div>
          <Confirm
            ref={this.confirm}
            text="是否清空播放列表"
            confirmBtnText="清空"
            confirm={this.confirmClear}
          />
          <AddSong showFlag={this.state.showSong} hide={this.hideAddSong} />
        </div>
      </CSSTransition>
    )
  }
}
