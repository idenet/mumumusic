import React, { Component } from 'react'

// 第三方库
import { withRouter } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
// api
import { getSongList } from 'api/recommend'
import { ERR_OK } from 'api/config'
import './disc.styl'

// @withRouter
export default class Disc extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false
    }
  }
  componentDidMount() {
    this.setState({
      show: true
    })
    this._getSongList(this.props.match.params.id)
  }
  _getSongList(dissid) {
    getSongList(dissid).then(res => {
      if (res.code === ERR_OK) {
        console.log(res.cdlist[0].songlist)
      }
    })
  }
  render() {
    return (
      <CSSTransition in={this.state.show} classNames="fade" timeout={300}>
        <div className="disc">disc</div>
      </CSSTransition>
    )
  }
}
