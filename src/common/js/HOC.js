import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  set_playing,
  set_currentIndex,
  set_playMode,
  set_playList
} from 'store/action-creator'
import {
  deleteSongList,
  saveSearchHistory,
  deleteSearchHistory,
  saveFavoriteHistory,
  deleteFavoriteHistory,
  deleteSong,
  insertSong
} from 'store/action'

import { playMode } from 'common/js/config'
import { shuffle, debounce } from 'common/js/util'

export const playerHOC = WrapperComponent => {
  class PlayerHOC extends Component {
    constructor(props) {
      super(props)
      this.state = {}
      this.changeMode = this.changeMode.bind(this)
      this.getFavoriteIcon = this.getFavoriteIcon.bind(this)
      this.toggleFavorite = this.toggleFavorite.bind(this)
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
      this._resetCurrentIndex(list)
    }
    _resetCurrentIndex(list) {
      let index = list.findIndex(v => {
        return v.id === this.props.player.currentSong.id
      })
      this.props.set_currentIndex(index)
    }
    toggleFavorite(song) {
      if (this._isFavorite(song)) {
        this.props.deleteFavoriteHistory(song)
      } else {
        this.props.saveFavoriteHistory(song)
      }
    }
    getFavoriteIcon(song) {
      return this._isFavorite(song)
        ? 'icon icon-favorite'
        : 'icon icon-not-favorite'
    }
    _isFavorite(song) {
      // console.log(this.props.favoriteHistory, song)
      const index = this.props.favoriteHistory.findIndex(item => {
        return item.id === song.id
      })
      return index > -1
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
          getFavoriteIcon={this.getFavoriteIcon}
          toggleFavorite={this.toggleFavorite}
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
    deleteSongList, // 只能放到这里
    saveFavoriteHistory,
    deleteFavoriteHistory,
    deleteSong
  })(PlayerHOC)
  return React.forwardRef((props, ref) => (
    <ForwardRefCompoent {...props} forwardedRef={ref} />
  ))
}
// react-router还不支持16.3 的createRef
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
    // 这种算是调用就执行
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
  const ForwardSearchHOC = connect(state => state, {
    saveSearchHistory,
    deleteSearchHistory,
    insertSong
  })(Search)
  return ForwardSearchHOC
}
