import React, { Component } from 'react'
import { connect } from 'react-redux'
// api
import { getMusicList } from 'api/rank'
import { ERR_OK } from 'api/config'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
// 动画
import { CSSTransition } from 'react-transition-group'
// 子组件
import MusicList from 'components/music-list/music-list'

@connect(state => state, null)
export default class TopList extends Component {
  constructor() {
    super()
    this.state = {
      show: false,
      songList: [],
      rank: true
    }
  }
  componentDidMount() {
    this.setState({
      show: true
    })
    this._getMusicList(this.props.topList.id)
  }
  _getMusicList(id) {
    getMusicList(id).then(res => {
      if (res.code === ERR_OK) {
        processSongsUrl(this._normalizeSongs(res.songlist)).then(songs => {
          this.setState({
            songList: songs
          })
        })
      }
    })
  }
  _normalizeSongs(list) {
    let ret = []
    list.forEach(item => {
      const musicData = item.data
      if (isValidMusic(musicData)) {
        ret.push(createSong(musicData))
      }
    })
    return ret
  }
  render() {
    const { id, topTitle, picUrl } = this.props.topList
    // 如果id不存在则返回
    if (!id) {
      this.props.history.goBack()
      return null
    }
    return (
      <CSSTransition in={this.state.show} timeout={300} classNames="fade">
        <MusicList
          title={topTitle}
          bgImage={picUrl}
          songs={this.state.songList}
          rank={this.state.rank}
        />
      </CSSTransition>
    )
  }
}
