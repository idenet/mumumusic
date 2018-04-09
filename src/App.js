// core
import React, { Component } from 'react'
// router
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
// 组件
import Header from 'components/header/header'
import Tab from 'containers/tab/tab'
// router的子组件
import Recommend from 'containers/recommend/recommend'
import Singer from 'containers/singer/singer'
import Rank from 'containers/rank/rank'
import Search from 'containers/search/search'
import User from 'containers/user/user'

// 播放器
import Player from 'components/player/player'
// history
import { connect } from 'react-redux'
import { set_play_history, set_favorite_history } from 'store/action-creator'
import { loadPlay, loadFavorite } from 'common/js/cache'
import { processSongsUrl } from 'common/js/song'

@connect(null, { set_play_history, set_favorite_history })
class App extends Component {
  componentDidMount() {
    const playSongs = loadPlay()

    processSongsUrl(playSongs).then(songs => {
      this.props.set_play_history(songs)
    })

    const favoriteSongs = loadFavorite()

    processSongsUrl(favoriteSongs).then(songs => {
      this.props.set_favorite_history(songs)
    })
  }
  render() {
    return (
      <Router>
        <div className="app">
          <Header />
          <Tab />
          <TransitionGroup>
            <CSSTransition classNames="route" timeout={500}>
              <Switch>
                <Redirect exact path="/" to="/recommend" />
                <Route path="/recommend" component={Recommend} />
                <Route path="/singer" component={Singer} />
                <Route path="/rank" component={Rank} />
                <Route path="/user" component={User} />
                <Route path="/search" component={Search} />
              </Switch>
            </CSSTransition>
          </TransitionGroup>
          <Player />
        </div>
      </Router>
    )
  }
}

export default App
