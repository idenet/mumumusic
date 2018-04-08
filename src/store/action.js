import * as actions from './action-creator'

// utl
import { shuffle } from 'common/js/util'
import { playMode } from 'common/js/config'

// 其实这里可以不要 如果是单个dispatch connect是会注入的
/**
 * 点击歌曲播放 mousic-list组件
 *
 * @author 香香鸡
 * @export
 * @param {Array, Number} { list, index }
 * @returns
 */
export function selectPlay({ list, index, mode }) {
  return dispatch => {
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
