import initState from './state.js'
import * as types from './action-types.js'

export default function(state = initState.disc, action) {
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
