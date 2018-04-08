import React, { Component } from 'react'

// redux
import { Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { set_topList } from 'store/action-creator'

import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import TopList from 'components/top-list/top-list'

//api
import { getTopList } from 'api/rank'
import { ERR_OK } from 'api/config'

// lazyload
import LazyLoad, { forceCheck } from 'react-lazyload'

import './rank.styl'

@connect(null, { set_topList })
export default class Rank extends Component {
  constructor() {
    super()
    this.state = {
      topList: []
    }
    this.probeType = 3
    this.listenScroll = true
  }
  componentDidMount() {
    this._getTopList()
  }
  _getTopList() {
    getTopList().then(res => {
      if (res.code === ERR_OK) {
        this.setState({
          topList: res.data.topList
        })
      }
    })
  }
  selectItem(toplist) {
    let { match } = this.props
    this.props.set_topList(toplist)
    this.props.history.push(`${match.url}/${toplist.id}`)
  }
  render() {
    const { match } = this.props
    return (
      <div className="rank-wrapper">
        <Scroll
          className="top-list"
          listenScroll={this.listenScroll}
          probeType={this.probeType}
          data={this.state.topList}
          onScroll={() => forceCheck()}
        >
          <ul>
            {this.state.topList.length
              ? this.state.topList.map((v, i) => (
                  <li
                    className="item"
                    key={v.id}
                    onClick={() => this.selectItem(v)}
                  >
                    <div className="icon">
                      <LazyLoad height={100} throttle={300}>
                        <img src={v.picUrl} alt="" width="100" height="100" />
                      </LazyLoad>
                    </div>
                    <ul className="song-list">
                      {v.songList.map((k, j) => (
                        <li className="song" key={k.songname}>
                          <span>{j + 1}</span>
                          <span>
                            {k.songname}-{k.singername}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))
              : null}
          </ul>
          {!this.state.topList.length ? <Loading title="正在加载..." /> : null}
        </Scroll>
        <Route path={`${match.url}/:id`} component={TopList} />
      </div>
    )
  }
}
