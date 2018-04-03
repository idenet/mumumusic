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

import './disc.styl'

@connect(state => state)
export default class Disc extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      songs: []
    }
  }
  // 另外一种方法
  // static getDerivedStateFromProps(nextProps, prevState) {
  //   let { dissid } = nextProps
  //   if (!dissid) {
  //     nextProps.history.goBack()
  //     return {
  //       isMounted: false
  //     }
  //   }
  //   return { isMounted: true }
  // }
  componentDidMount() {
    // console.log(this.props.dissid)
    if (!this.props.dissid) {
      this.props.history.goBack()
      return
    }
    // if (!this.state.isMounted) {
    //   return
    // }
    this.setState({
      show: true
    })
    this._getSongList(this.props.match.params.id)
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
    const { dissname, imgurl } = this.props
    return (
      <CSSTransition
        in={this.state.show}
        timeout={300}
        classNames="fade"
        unmountOnExit
        onExited={() => {
          this.setState({
            show: false
          })
        }}
      >
        <MusicList title={dissname} bgImage={imgurl} songs={this.state.songs} />
      </CSSTransition>
    )
  }
}
