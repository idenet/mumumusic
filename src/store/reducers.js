import initState from './state.js'
import * as types from './action-types.js'

export function disc(state = initState.disc, action) {
  switch (action.type) {
    case types.SET_DISC:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}

export function singer(state = initState.singer, action) {
  switch (action.type) {
    case types.SET_SINGER:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}
