import { combineReducers } from 'redux'

const initialState = 0

function main( state = initialState, action ) {
  switch(action.type){
    case 'TEST_ACTION':
      return state + 1
    default:
      return state
  }
}

export default combineReducers({
  main
})

