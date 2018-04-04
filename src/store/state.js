import { playMode } from 'common/js/config'
const state = {
  disc: {},
  singer: {},
  player: {
    playing: false, // 是否播放
    fullScreen: false, // 大播放器还是小播放器
    playList: [], // 播放顺序
    sequenceList: [], // 调整后的顺序
    mode: playMode.sequence, // 播放模式
    currentIndex: -1, // 当前播放下标
    currentSong: {} // 当前播放歌曲
  }
}

export default state
