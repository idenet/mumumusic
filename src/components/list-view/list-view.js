import React, { Component } from 'react'
import PropTypes from 'prop-types'

// 第三方组件

// 子组件
import Scroll from 'base/scroll/scroll'
import LazyLoad, { forceCheck } from 'react-lazyload'
import Loading from 'base/loading/loading'
//css
import './list-view.styl'

const TITLE_HEIGHT = 30
const ANCHOR_HEIGHT = 18

export default class ListView extends Component {
  static propTypes = {
    data: PropTypes.array,
    selectItem: PropTypes.func
  }
  static defaultProps = {
    data: [],
    selectItem: f => f
  }
  constructor() {
    super()
    this.state = {
      shortcutList: [],
      currentIndex: 0,
      diff: -1,
      scrollY: -1
    }
    this.onScroll = this.onScroll.bind(this)
    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
    // 不知道为什么一定要放在这里才有效果， 异步的原因？
    this.probeType = 3
    this.listenScroll = true
    this.touch = {}
    this.listHeight = []
    // ref
    this.listGroup = React.createRef()
    this.listview = React.createRef()
    this.fixed = React.createRef()
  }
  // 接收到新的props触发
  static getDerivedStateFromProps(nextProps, prevState) {
    // 触发两次，第二次在父组件setState导致重新渲染后，nexProps获得数据触发
    if (nextProps.data.length) {
      return {
        shortcutList: nextProps.data.map(v => v.title.substr(0, 1))
      }
    }
    return null
  }
  // 接收到新的props和state触发
  shouldComponentUpdate(nextProps, nextState) {
    // 有render函数了
    if (this.props.data.length !== nextProps.data.length) {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    }

    // 滚动实时改变scrollY，进而改变currentIndex值，这两个值都需要判断，如果改变了，需要更新视图改变fixedTitle
    if (this.state.currentIndex !== nextState.currentIndex) {
      return true
    }
    if (this.state.scrollY !== nextState.scrollY) {
      return this._getCurrentIndex(nextProps, nextState)
    }

    if (this.state.diff !== nextState.diff) {
      return this._getDiff(nextProps, nextState)
    }

    return true
  }
  componentWillUnmount() {
    clearTimeout(this.timer)
  }
  onScroll(scroll) {
    this.setState({
      scrollY: scroll.y
    })
    forceCheck()
  }
  //*************动画 */
  onTouchStart(e) {
    let anchorIndex = e.target.dataset.index
    let firstTouch = e.touches[0]
    this.touch.y1 = firstTouch.pageY
    this.touch.anchorIndex = anchorIndex
    this._scrollTo(anchorIndex)
  }
  onTouchMove(e) {
    e.stopPropagation()
    let firstTouch = e.touches[0]
    this.touch.y2 = firstTouch.pageY
    // start到move之间的间隔几个区块
    let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0
    // move到的区块index
    let anchorIndex = Number.parseInt(this.touch.anchorIndex, 10) + delta
    this._scrollTo(anchorIndex)
  }
  onTouchEnd(e) {
    e.stopPropagation()
  }
  /**************动画结束 */
  _calculateHeight() {
    // 刷新有可能处报错
    if (!this.listGroup.current) {
      return false
    }
    let list = [...this.listGroup.current.children]
    let height = 0
    this.listHeight.push(height)
    for (let i = 0; i < list.length; i++) {
      let item = list[i]
      height += item.clientHeight
      this.listHeight.push(height)
    }
  }
  _getCurrentIndex(nextProps, nextState) {
    let y = nextState.scrollY
    let listHeight = this.listHeight
    if (y > 0) {
      this.setState({
        currentIndex: 0
      })
      return false
    }
    // 在中间滚动
    for (let i = 0; i < listHeight.length - 1; i++) {
      let height1 = listHeight[i]
      let height2 = listHeight[i + 1]
      // 到达下一个区间
      if (-y >= height1 && -y < height2) {
        this.setState({
          diff: height2 + y, // diff时时改变
          currentIndex: i
        })
        return false
      }
    }
    // 当滚动到底部时，且-y大于最后一个元素的上限
    this.setState({
      currentIndex: listHeight.length - 2
    })
    return false
  }
  _getDiff(nextState) {
    let newVal = nextState.diff
    let fixedTop =
      newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0
    // 让相同的fixedTop不在使用动画
    if (this.fixedTop === fixedTop) {
      return false
    }
    this.fixedTop = fixedTop
    this.fixed.current.style.transform = `translate3d(0, ${fixedTop}px, 0)`
    return false
  }
  _scrollTo(index) {
    // forceCheck() // 如果不添加滚动后，不会加载图片
    // 点击黑色区域有可能index为undefined
    if (!index && index !== 0) {
      return
    }
    if (index < 0) {
      index = 0
    } else if (index > this.listHeight.length - 2) {
      index = this.listHeight.length - 2
    }
    this.listview.current.scrollToElement(
      this.listGroup.current.children[index],
      0
    )
    // 滚动后设置scrollY
    this.setState({
      scrollY: this.listview.current.scroll.y
    })
    forceCheck()
  }
  render() {
    return (
      <Scroll
        probeType={this.probeType}
        listenScroll={this.listenScroll}
        onScroll={this.onScroll}
        className="list-view"
        ref={this.listview}
      >
        <ul ref={this.listGroup}>
          {this.props.data.length
            ? this.props.data.map((v, i) => (
                <li className="list-group" key={v.title}>
                  <h2 className="list-group-title">{v.title}</h2>
                  <ul>
                    {v.items.map((k, j) => (
                      <li
                        className="list-group-item"
                        key={k.id}
                        onClick={() => {
                          this.props.selectItem(k)
                        }}
                      >
                        <LazyLoad height={50} throttle={300}>
                          <img src={k.avatar} className="avatar" alt="" />
                        </LazyLoad>
                        <span className="name">{k.name}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))
            : null}
        </ul>
        <div
          className="list-shortcut"
          onTouchStart={this.onTouchStart}
          onTouchMove={this.onTouchMove}
          onTouchEnd={this.onTouchEnd}
        >
          <ul>
            {this.state.shortcutList.length
              ? this.state.shortcutList.map((v, i) => (
                  <li
                    className={
                      'item' + (this.state.currentIndex === i ? ' current' : '')
                    }
                    key={v}
                    data-index={i}
                  >
                    {v}
                  </li>
                ))
              : null}
          </ul>
        </div>
        <div className="list-fixed" ref={this.fixed}>
          {this.state.scrollY < 0 ? (
            <div className="fixed-title">
              {this.props.data[this.state.currentIndex]
                ? this.props.data[this.state.currentIndex].title
                : ''}
            </div>
          ) : null}
        </div>
        {!this.props.data.length ? <Loading title="正在加载..." /> : null}
      </Scroll>
    )
  }
}
