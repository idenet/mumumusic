import React from 'react'
// import PropTypes from 'prop-types'

import './song-list.styl'

const SongList = ({ songs, rank, select }) => {
  const getRankText = index => {
    if (index > 2) {
      return index + 1
    }
  }
  const getRankCls = index => {
    if (index <= 2) {
      return `icon icon${index}`
    } else {
      return 'text'
    }
  }
  const selectItem = (song, index) => {
    select && select(song, index)
  }
  return (
    <div className="song-list">
      <ul>
        {songs
          ? songs.map((v, i) => (
              <li
                className="item"
                key={v.id}
                // 如果不放到函数里，会直接执行
                onClick={() => {
                  selectItem(v, i)
                }}
              >
                {rank ? (
                  <div className="rank">
                    <span className={getRankCls(i)}>{getRankText(i)}</span>
                  </div>
                ) : null}
                <div className="content">
                  <h2 className="name">{v.name}</h2>
                  <p className="desc">{`${v.singer}·${v.album}`}</p>
                </div>
              </li>
            ))
          : null}
      </ul>
    </div>
  )
}

export default SongList
