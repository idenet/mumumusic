import React, { Component } from 'react'
import { Route } from 'react-router-dom'
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

// redux
import { connect } from 'react-redux'
import { setDisc } from 'store/action'

// css
import './recommend.styl'

@connect(state => state, { setDisc }) // 设置state的disc
export default class Recommend extends Component {
  constructor(props) {
    super(props)
    this.state = {
      recommends: [],
      discList: []
    }
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
  // 不需要监听图片加载事件，高度改变后 bs自动刷新
  handleClickItem(v) {
    let { match } = this.props
    this.props.setDisc(v)
    this.props.history.push(`${match.url}/${v.dissid}`)
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
                  <Slider>
                    {this.state.recommends.map((v, i) => (
                      <a href={v.linkUrl} key={v.id}>
                        <img src={v.picUrl} alt="" />
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
            <Loading title="正在加载..." />
          ) : null}
        </Scroll>
        <Route path={`${this.props.match.url}/:id`} component={Disc} />
      </div>
    )
  }
}
