import * as actions from './action-creator'

export function setDisc(data) {
  return dispatch => {
    dispatch(actions.set_disc(data))
  }
}
