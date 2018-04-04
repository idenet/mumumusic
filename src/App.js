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

// 播放器

// css

class App extends Component {
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
                <Route path="/search" component={Search} />
              </Switch>
            </CSSTransition>
          </TransitionGroup>
        </div>
      </Router>
    )
  }
}

export default App
