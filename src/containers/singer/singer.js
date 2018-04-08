import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { connect } from 'react-redux'

// api
import { getSingerList } from 'api/singer'

// 子组件
import ListView from 'components/list-view/list-view'
import SingerDetail from 'components/singer-detail/singer-detail'

//util
import { ERR_OK } from 'api/config'
import Singers from 'common/js/singer'

// action
import { set_singer } from 'store/action-creator'

import './singer.styl'

const HOT_SINGER_LEN = 10
const HOT_NAME = '热门'
@connect(null, { set_singer })
export default class Singer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      singers: []
    }
    this.selctSinger = this.selctSinger.bind(this)
  }
  componentDidMount() {
    this._getSingerList()
  }
  _getSingerList() {
    getSingerList().then(res => {
      if (res.code === ERR_OK) {
        this.setState({
          singers: this._normalizeSinger(res.data.list)
        })
      }
    })
  }
  /**
   * 重新组织singer的数据结构
   *
   * @author 香香鸡
   * @param {any} list
   * @memberof Singer
   */
  _normalizeSinger(list) {
    let map = {
      hot: {
        title: HOT_NAME,
        items: []
      }
    }
    list.forEach((item, index) => {
      if (index < HOT_SINGER_LEN) {
        // 保存hot的内容
        map.hot.items.push(
          new Singers({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          })
        )
      }
      // 保存根据Findex的内容
      const key = item.Findex
      if (!map[key]) {
        map[key] = {
          title: key,
          items: []
        }
      }
      map[key].items.push(
        new Singers({
          name: item.Fsinger_name,
          id: item.Fsinger_mid
        })
      )
    })
    let ret = []
    let hot = []
    // 根据key获取a-z的内容和hot的内容
    for (let key in map) {
      let val = map[key]
      if (val.title.match(/[a-zA-Z]/)) {
        ret.push(val)
      } else if (val.title === HOT_NAME) {
        hot.push(val)
      }
    }
    // 排序a-z
    ret.sort((a, b) => {
      return a.title.charCodeAt(0) - b.title.charCodeAt(0)
    })
    return hot.concat(ret)
  }
  selctSinger(item) {
    const { match } = this.props
    this.props.set_singer(item)
    this.props.history.push(`${match.url}/${item.id}`)
  }
  render() {
    let { match } = this.props
    return (
      <div className="singer-wrapper">
        <ListView data={this.state.singers} selectItem={this.selctSinger} />
        <Route path={`${match.url}/:id`} component={SingerDetail} />
      </div>
    )
  }
}
