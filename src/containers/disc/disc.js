import React, { Component } from 'react'

// 第三方库
import { CSSTransition } from 'react-transition-group'
import { connect } from 'react-redux'
// api
import { getSongList } from 'api/recommend'
import { ERR_OK } from 'api/config'
// util
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'

//子组件
import MusicList from 'components/music-list/music-list'

@connect(state => state, null)
export default class Disc extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      songs: []
    }
  }
  componentDidMount() {
    this.setState({
      show: true
    })
    this._getSongList(this.props.disc.dissid)
  }
  _getSongList(dissid) {
    getSongList(dissid).then(res => {
      if (res.code === ERR_OK) {
        processSongsUrl(this._mormalizeSongs(res.cdlist[0].songlist)).then(
          songs => {
            this.setState({
              songs: songs
            })
          }
        )
      }
    })
  }
  _mormalizeSongs(list) {
    let ret = []
    list.forEach(musicData => {
      if (isValidMusic(musicData)) {
        ret.push(createSong(musicData))
      }
    })
    return ret
  }
  render() {
    const { dissid, dissname, imgurl } = this.props.disc
    //如果id不存在则返回
    if (!dissid) {
      this.props.history.goBack()
      return null
    }
    return (
      <CSSTransition in={this.state.show} timeout={300} classNames="fade">
        <MusicList title={dissname} bgImage={imgurl} songs={this.state.songs} />
      </CSSTransition>
    )
  }
}
