import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { isForwardRef } from 'react-is'

import {
  set_playing,
  set_currentIndex,
  set_playMode,
  set_playList
} from 'store/action-creator'

import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'

export const playerHOC = WrapperComponent => {
  class PlayerHOC extends Component {
    constructor(props) {
      super(props)
      this.state = {}
      this.changeMode = this.changeMode.bind(this)
    }
    changeMode() {
      const mode = (this.props.player.mode + 1) % 3
      this.props.set_playMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.props.player.sequenceList)
      } else {
        list = this.props.player.sequenceList
      }
      this.props.set_playList(list)
      this.resetCurrentIndex(list)

      console.log(mode)
    }
    resetCurrentIndex(list) {
      let index = list.findIndex(v => {
        return v.id === this.props.player.currentSong.id
      })
      this.props.set_currentIndex(index)
    }

    render() {
      const mode = this.props.player.mode
      const modeIcon =
        mode === playMode.sequence
          ? 'icon-sequence'
          : mode === playMode.loop ? 'icon-loop' : 'icon-random'
      return (
        <WrapperComponent
          changeMode={this.changeMode}
          {...this.props}
          modeIcon={modeIcon}
        />
      )
    }
  }
  return connect(state => state, {
    set_currentIndex,
    set_playList,
    set_playMode,
    set_playing
  })(PlayerHOC)
}
