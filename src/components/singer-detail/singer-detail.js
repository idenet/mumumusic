import React, { Component } from 'react'

// d动画
import { CSSTransition } from 'react-transition-group'

//子组件
import MusicList from 'components/music-list/music-list'

// api
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/config'

//util
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'

// redux
import { connect } from 'react-redux'

// css
import './singer-detail.styl'

@connect(state => state, null)
export default class SingerDetail extends Component {
  constructor() {
    super()
    this.state = {
      show: false,
      songList: []
    }
  }
  // 最好放到这里判断，如果放到didmount手机上回报错
  static getDerivedStateFromProps(nextProps, prevState) {
    let { id } = nextProps.singer
    if (!id) {
      nextProps.history.goBack()
      return {
        isMounted: false
      }
    }
    return { isMounted: true }
  }
  componentDidMount() {
    if (!this.state.isMounted) {
      return
    }
    this.setState({
      show: true
    })
    let { id } = this.props.match.params
    this._getSingerDetail(id)
  }
  _getSingerDetail(id) {
    getSingerDetail(id).then(res => {
      if (res.code === ERR_OK) {
        processSongsUrl(this._mormalizeSongs(res.data.list)).then(songs => {
          this.setState({
            songList: songs
          })
        })
      }
    })
  }
  _mormalizeSongs(list) {
    let ret = []
    list.forEach(item => {
      let { musicData } = item
      if (isValidMusic(musicData)) {
        ret.push(createSong(musicData))
      }
    })
    return ret
  }
  render() {
    let { name, avatar } = this.props.singer
    return (
      <CSSTransition in={this.state.show} timeout={300} classNames="slider">
        <MusicList title={name} bgImage={avatar} songs={this.state.songList} />
      </CSSTransition>
    )
  }
}
