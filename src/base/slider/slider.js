import React, { Component } from 'react'
import PropTypes from 'prop-types'

// 第三房库
import BScroll from 'better-scroll'
import classNames from 'classnames'
// css
import './slider.styl'

export default class Slider extends Component {
  static propTypes = {
    loop: PropTypes.bool, // 是否循环
    autoPlay: PropTypes.bool, // 是否自动播放
    interval: PropTypes.number, // 间隔时间
    loadPic: PropTypes.func
  }

  static defaultProps = {
    loop: true,
    autoplay: true,
    interval: 4000
  }
  constructor(props) {
    super(props)
    this.state = {
      dots: [],
      currentIndex: 0
    }
    this.sliderDom = React.createRef()
    this.sliderGroup = React.createRef()
  }
  componentDidMount() {
    setTimeout(() => {
      this._setSliderWidth() // 初始化轮播图宽度
      this._initDots()
      this._initSlider()
      if (this.props.autoplay) {
        this._play()
      }
    }, 20)
    window.addEventListener('resize', () => {
      if (!this.slider || !this.slider.enabled) {
        return
      }
      clearTimeout(this.resizeTimer)
      this.resizeTimer = setTimeout(() => {
        if (this.slider.isInTransition) {
          this._onScrollEnd()
        } else {
          if (this.props.autoPlay) {
            this._play()
          }
        }
        this._refresh()
      }, 60)
    })
  }
  componentWillUnmount() {
    this.slider.disable() // 禁止better-scroll
    clearTimeout(this.timer)
  }

  _setSliderWidth(isResize) {
    this.childen = this.sliderGroup.current.children
    let width = 0
    let sliderWidth = this.sliderDom.current.clientWidth
    for (let i = 0; i < this.childen.length; i++) {
      let child = this.childen[i]
      !child.classList.contains('slider-item') &&
        child.classList.add('slider-item')
      child.style.width = sliderWidth + 'px'
      width += sliderWidth
    }
    if (this.props.loop && !isResize) {
      width += 2 * sliderWidth
    }
    this.sliderGroup.current.style.width = width + 'px'
  }
  _initDots() {
    this.setState({
      dots: new Array(this.childen.length).fill('')
    })
  }
  _initSlider() {
    this.slider = new BScroll(this.sliderDom.current, {
      scrollX: true,
      scrollY: false,
      click: true,
      momentum: false, // 滚动动画
      snap: {
        loop: this.props.loop, // 轮播
        threshold: 0.3,
        speed: 400
      }
    })
    // 手指离开后
    this.slider.on('scrollEnd', this._onScrollEnd.bind(this))
    // 手指离开后
    this.slider.on('touchEnd', () => {
      if (this.props.autoPlay) {
        this._play()
      }
    })
    // 滚动开始前
    this.slider.on('beforeScrollStart', () => {
      if (this.props.autoplay) {
        clearTimeout(this.timer)
      }
    })
  }
  _onScrollEnd() {
    let pageIndex = this.slider.getCurrentPage().pageX
    this.setState({
      currentIndex: pageIndex
    })
    if (this.props.autoplay) {
      this._play()
    }
  }
  _play() {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.slider.next()
    }, this.props.interval)
  }
  _refresh() {
    if (this.slider) {
      this._setSliderWidth(true)
      this.slider.refresh()
    }
  }
  render() {
    return (
      <div className="slider" ref={this.sliderDom}>
        <div className="slider-group" ref={this.sliderGroup}>
          {this.props.children}
        </div>
        <div className="dots">
          {this.state.dots.map((v, i) => (
            <span
              className={classNames('dot', {
                active: i === this.state.currentIndex
              })}
              key={i}
            />
          ))}
        </div>
      </div>
    )
  }
}
