import * as actions from './action-creator'

// utl
import { shuffle } from 'common/js/util'
import { playMode } from 'common/js/config'
import {
  saveSearch,
  deleteSearch,
  clearSearch,
  savePlay,
  saveFavorite,
  deleteFavorite
} from 'common/js/cache'

// 其实这里可以不要 如果是单个dispatch connect是会注入的
/**
 * 点击歌曲播放 mousic-list组件
 *
 * @author 香香鸡
 * @export
 * @param {Array, Number} { list, index
 * @returns
 */
export function selectPlay({ list, index }) {
  return (dispatch, getState) => {
    let mode = getState().player.mode
    dispatch(actions.set_sequenceList(list))
    if (mode === playMode.random) {
      let randomList = shuffle(list)
      dispatch(actions.set_playList(randomList))
      index = findIndex(randomList, list[index])
    } else {
      dispatch(actions.set_playList(list))
    }
    dispatch(actions.set_fullScreen(true))
    dispatch(actions.set_playing(true))
    dispatch(actions.set_currentIndex(index))
  }
}

/**
 *点击随机播放
 *
 * @author 香香鸡
 * @export
 * @param {Array} { list }
 * @returns
 */
export function randomPlay({ list }) {
  let randomList = shuffle(list)
  return dispatch => {
    dispatch(actions.set_playMode(playMode.random))
    dispatch(actions.set_sequenceList(list))
    dispatch(actions.set_playList(randomList))
    dispatch(actions.set_currentIndex(0))
    dispatch(actions.set_fullScreen(true))
    dispatch(actions.set_playing(true))
  }
}

/**
 * 插入歌曲
 *
 * @author 香香鸡
 * @export
 * @param {Array} song
 * @returns
 */
export function insertSong(song) {
  return (dispatch, getState) => {
    let player = getState().player // 获取player的state
    let playList = player.playList.slice() // 获取播放列表的副本
    let sequenceList = player.sequenceList.slice()
    let currentIndex = player.currentIndex

    let currentSong = playList[currentIndex] // 返回当前歌曲
    // 返回传入song的位置
    let fIndex = findIndex(playList, song)

    // 插入 索引+1
    currentIndex++
    playList.splice(currentIndex, 0, song) //将歌曲添加到currentIndex后面
    // 如果包含了这首歌
    if (fIndex > -1) {
      if (currentIndex > fIndex) {
        // [1, 2, 3, 4, 5] ===> [1, 2, 3, 4, 5 (当前播放为5，插入数为3)]===>[1, 2, 4, 5, 3]
        playList.splice(fIndex, 1) // 删除重复的歌曲
        currentIndex-- // 减少多加的
      } else {
        // [1, 2(当前播放歌曲), 3, 4] ===> [1, 2, 4, 3, 4] ===>[1, 2, 4, 3]
        playList.splice(fIndex + 1, 1) // 要把重复的删除需下标+1
      }
    }
    // sequenceList要插入的位置
    let currentSIndex = findIndex(sequenceList, currentSong) + 1
    // 查找song的位置
    let fsIndex = findIndex(sequenceList, song)
    sequenceList.splice(currentSIndex, 0, song)

    if (fsIndex > -1) {
      if (currentSIndex > fsIndex) {
        sequenceList.splice(fsIndex, 1)
      } else {
        sequenceList.splice(fsIndex + 1, 1)
      }
    }
    dispatch(actions.set_playList(playList))
    dispatch(actions.set_sequenceList(sequenceList))
    dispatch(actions.set_currentIndex(currentIndex))
    dispatch(actions.set_fullScreen(true))
    dispatch(actions.set_playing(true))
  }
}

export function deleteSong(song) {
  return (dispatch, getState) => {
    let player = getState().player
    let playList = player.playList.slice()
    let sequenceList = player.sequenceList.slice()
    let currentIndex = player.currentIndex

    let fIndex = findIndex(playList, song) //找到删除曲目的下标
    playList.splice(fIndex, 1)

    let fsIndex = findIndex(sequenceList, song)
    sequenceList.splice(fsIndex, 1)

    // 当要删除下标在播放曲目的前面
    if (currentIndex > fIndex || currentIndex === playList.length) {
      currentIndex--
    }

    dispatch(actions.set_playList(playList))
    dispatch(actions.set_sequenceList(sequenceList))
    dispatch(actions.set_currentIndex(currentIndex))

    // 当只有一首歌
    if (!playList.length) {
      dispatch(actions.set_playing(false))
    } else {
      dispatch(actions.set_playing(true))
    }
  }
}

/**
 * 清空播放列表
 *
 * @author 香香鸡
 * @export
 * @returns
 */
export function deleteSongList() {
  return dispatch => {
    dispatch(actions.set_currentIndex(-1))
    dispatch(actions.set_playList([]))
    dispatch(actions.set_sequenceList([]))
    dispatch(actions.set_playing(false))
  }
}

function findIndex(list, song) {
  return list.findIndex(item => {
    return item.id === song.id
  })
}

export function saveSearchHistory(query) {
  return dispatch => {
    dispatch(actions.set_search_history(saveSearch(query)))
  }
}

export function deleteSearchHistory(query) {
  return dispatch => {
    dispatch(actions.set_search_history(deleteSearch(query)))
  }
}

export function clearSearchHistory(query) {
  return dispatch => {
    dispatch(actions.set_search_history(clearSearch(query)))
  }
}

export function savePlayHistory(song) {
  return dispatch => {
    dispatch(actions.set_play_history(savePlay(song)))
  }
}

export function saveFavoriteHistory(song) {
  return dispatch => {
    dispatch(actions.set_favorite_history(saveFavorite(song)))
  }
}
export function deleteFavoriteHistory(song) {
  return dispatch => {
    dispatch(actions.set_favorite_history(deleteFavorite(song)))
  }
}
