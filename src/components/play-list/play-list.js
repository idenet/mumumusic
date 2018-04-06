import React, { Component } from 'react'

import './play-list.styl'

export default class PlayList extends Component {
  render() {
    return (
      <div className="playlist">
        <div className="list-wrapper">
          <div className="list-header">
            <h1 className="title">
              <i className="icon icon-random" />
              <span className="text">随机播放</span>
              <span className="clear">
                <i className="icon-clear" />
              </span>
            </h1>
          </div>
        </div>
      </div>
    )
  }
}
