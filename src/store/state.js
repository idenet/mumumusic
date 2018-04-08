import { playMode } from 'common/js/config'
const state = {
  disc: {},
  singer: {},
  player: {
    playing: false, // 是否播放
    fullScreen: false, // 大播放器还是小播放器
    playList: [], // 播放顺序
    sequenceList: [], // 需要改变的列表
    mode: playMode.sequence, // 播放模式
    currentIndex: -1, // 当前播放下标
    currentSong: {} // 当前播放歌曲
  },
  topList: []
}

export default state
