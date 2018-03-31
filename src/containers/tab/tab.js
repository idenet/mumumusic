import React, { Component } from 'react'
import { NavLink, withRouter } from 'react-router-dom'
// css
import './tab.styl'

@withRouter
export default class TabContainer extends Component {
  constructor() {
    super()
    this.state = {
      navList: [
        {
          url: '/recommend',
          text: '推荐',
        },
        {
          url: '/singer',
          text: '歌手',
        },
        {
          url: '/rank',
          text: '排行',
        },
        {
          url: '/search',
          text: '搜索',
        }
      ]
    }
  }

  render() {
    return (
      <div className="nav-bar">
        {this.state.navList.map((v, i) => (
          <NavLink
            to={v.url}
            key={v.url}
            className="nav-item"
            activeClassName="active"
          >
            <span className="tab-link">{v.text}</span>
          </NavLink>
        ))}
      </div>
    )
  }
}
