import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  set_playing,
  set_currentIndex,
  set_playMode,
  set_playList
} from 'store/action-creator'
import { deleteSongList, saveSearchHistory } from 'store/action'

import { playMode } from 'common/js/config'
import { shuffle, debounce } from 'common/js/util'

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
          ref={this.props.forwardedRef}
        />
      )
    }
  }
  const ForwardRefCompoent = connect(state => state, {
    set_currentIndex,
    set_playList,
    set_playMode,
    set_playing,
    deleteSongList
  })(PlayerHOC)
  return React.forwardRef((props, ref) => (
    <ForwardRefCompoent {...props} forwardedRef={ref} />
  ))
}

export const searchHOC = WrapperComponent => {
  class Search extends Component {
    constructor(props) {
      super(props)
      this.state = {
        query: ''
      }
      this.addQuery = this.addQuery.bind(this)
      this.blurInput = this.blurInput.bind(this)
      this.saveSearch = this.saveSearch.bind(this)
      this.searchBox = React.createRef()
    }
    // 这种算是调用就执行吗
    onQueryChange = debounce(query => {
      this.setState({
        query
      })
    }, 300)
    blurInput() {
      this.searchBox.current.blur()
    }
    saveSearch() {
      this.props.saveSearchHistory(this.state.query)
    }
    addQuery(query) {
      this.searchBox.current.setQuery(query)
    }
    render() {
      return (
        <WrapperComponent
          {...this.props}
          changeQuery={this.state.query}
          addQuery={this.addQuery}
          saveSearch={this.saveSearch}
          refSearchbox={this.searchBox}
          onQueryChange={this.onQueryChange}
          blurInput={this.blurInput}
        />
      )
    }
  }
  return connect(state => state, { saveSearchHistory })(Search)
}
