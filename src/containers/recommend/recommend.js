import React, { Component } from 'react'
import { Route, withRouter } from 'react-router-dom'
// api
import { getRecommend, getDiscList } from 'api/recommend'
import { ERR_OK } from 'api/config'

// 第三方库
import LazyLoad, { forceCheck } from 'react-lazyload'

// 子组件
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import Disc from 'containers/disc/disc'

// css
import './recommend.styl'

@withRouter
export default class Recommend extends Component {
  constructor(props) {
    super(props)
    this.state = {
      recommends: [],
      discList: []
    }
    this.Slider = React.createRef()
    this.handleOnLoad = this.handleOnLoad.bind(this)
  }

  componentDidMount() {
    this._getRecommend()
    this._getDiscList()
  }
  componentWillUnmount() {
    clearTimeout(this.timer)
  }
  _getRecommend() {
    getRecommend().then(res => {
      if (res.code === ERR_OK) {
        this.setState({
          recommends: res.data.slider
        })
      }
    })
  }
  _getDiscList() {
    getDiscList().then(res => {
      if (res.code === ERR_OK) {
        this.setState({
          discList: res.data.list
        })
      }
    })
  }
  handleOnLoad() {
    if (!this.checkLoaded) {
      this.checkLoaded = true
      this.timer = setTimeout(() => {
        this.Slider.current.slider.refresh()
      }, 60)
    }
  }
  handleClickItem(v) {
    this.props.history.push(`/recommend/${v.dissid}`)
    // console.log(this.props.history.go(`/recommend/${v.dissid}`))
  }
  render() {
    return (
      <div className="recommend">
        <Scroll
          className="recommend-content"
          data={this.state.discList}
          listenScroll={true}
          probeType={3}
          onScroll={() => forceCheck()}
        >
          <div>
            <div className="slider-wrapper">
              <div className="slider-content">
                {this.state.recommends.length ? (
                  <Slider ref={this.Slider}>
                    {this.state.recommends.map((v, i) => (
                      <a href={v.linkUrl} key={v.id}>
                        <img src={v.picUrl} alt="" onLoad={this.handleOnLoad} />
                      </a>
                    ))}
                  </Slider>
                ) : null}
              </div>
            </div>
            <div className="recommend-list">
              <h1 className="list-title">热门歌单推荐</h1>
              <ul>
                {this.state.discList.length
                  ? this.state.discList.map(v => (
                      <li
                        className="item"
                        key={v.dissid}
                        onClick={() => this.handleClickItem(v)}
                      >
                        <div className="icon">
                          <LazyLoad height={62} throttle={200}>
                            <img src={v.imgurl} alt="" width="60" height="60" />
                          </LazyLoad>
                        </div>
                        <div className="text">
                          <h2 className="name">{v.creator.name}</h2>
                          <p className="desc">{v.dissname}</p>
                        </div>
                      </li>
                    ))
                  : null}
              </ul>
            </div>
          </div>
          {!this.state.discList.length && !this.state.recommends.length ? (
            <div className="loading-container">
              <Loading title="正在加载..." />
            </div>
          ) : null}
        </Scroll>
        <Route path={`/recommend/:id`} component={Disc} />
      </div>
    )
  }
}
