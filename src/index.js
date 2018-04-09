// core
import React from 'react'
import ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'
// redux
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import { Provider } from 'react-redux'
// 子组件
import App from './App'
import reducers from 'store/index'
// css
import 'common/stylus/index.styl'
import { savePlayHistory, saveFavoriteHistory } from 'store/action'
import { loadPlay, loadFavorite } from 'common/js/cache'
import { processSongsUrl } from 'common/js/song'

// import Vconsole from 'vconsole'
// var vconsole = new Vconsole()
// console.log(vconsole)

const store = createStore(
  reducers,
  compose(
    applyMiddleware(thunk, logger),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
)

const playSongs = loadPlay()
processSongsUrl(playSongs).then(songs => {
  savePlayHistory(songs)
})

const favoriteSongs = loadFavorite()
processSongsUrl(favoriteSongs).then(songs => {
  saveFavoriteHistory(songs)
})

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()
