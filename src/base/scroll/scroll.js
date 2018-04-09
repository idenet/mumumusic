import React, { Component } from 'react'
import PropTypes from 'prop-types'

import BScroll from 'better-scroll'

export default class componentName extends Component {
  static propTypes = {
    probeType: PropTypes.number, // 滚动方式
    click: PropTypes.bool, // 是否可以点击
    listenScroll: PropTypes.bool, // 监听滚动
    data: PropTypes.array, // 数据
    pullup: PropTypes.bool, // 下拉刷新
    beforeScroll: PropTypes.bool, // 滚动之前
    refreshDelay: PropTypes.number, //刷新
    direction: PropTypes.string,
    className: PropTypes.string,
    onScroll: PropTypes.func,
    onPullup: PropTypes.func,
    onBeforeScroll: PropTypes.func
  }

  static defaultProps = {
    probeType: 1,
    click: true,
    listenScroll: false,
    data: null,
    pullup: false,
    beforeScroll: false,
    refreshDelay: 20,
    direction: this.DIRECTION_V,
    className: 'scroll-wrapper',
    onScroll: f => f,
    onPullup: f => f,
    onBeforeScroll: f => f
  }
  constructor(props) {
    super(props)
    this.state = {}
    this.DIRECTION_H = 'horizontal'
    this.DIRECTION_H = 'horizontal'
    this.scrollWrapper = React.createRef()
  }
  componentDidMount() {
    // 价格延时顺滑很多？？？？
    setTimeout(() => {
      this._initScroll()
    }, 20)
  }
  componentWillUnmount() {
    // 这样music-list滚动时候退出就不会报错
    this.scroll.off('scroll')
    this.scroll = null
  }
  _initScroll() {
    if (!this.scrollWrapper) {
      return
    }
    this.scroll = new BScroll(this.scrollWrapper.current, {
      probeType: this.props.probeType,
      click: this.props.click,
      eventPassthrough:
        this.props.direction === this.DIRECTION_V
          ? this.DIRECTION_H
          : this.DIRECTION_V
    })
    if (this.props.listenScroll) {
      this.scroll.on('scroll', pos => {
        this.props.onScroll(pos)
      })
    }
    if (this.props.pullup) {
      this.scroll.on('scrollEnd', () => {
        if (this.scroll.y <= this.scroll.maxScrollY + 50) {
          this.props.onPullup()
        }
      })
    }
    if (this.props.beforeScroll) {
      this.scroll.on('beforeScrollStart', () => {
        this.props.onBeforeScroll()
      })
    }
  }
  stop() {
    this.scroll && this.scroll.stop()
  }
  disable() {
    this.scroll && this.scroll.disable()
  }
  enable() {
    this.scroll && this.scroll.enable()
  }
  refresh() {
    this.scroll && this.scroll.refresh()
  }
  scrollTo() {
    this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
  }
  scrollToElement() {
    this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
  }

  render() {
    return (
      <div className={this.props.className} ref={this.scrollWrapper}>
        {this.props.children}
      </div>
    )
  }
}
