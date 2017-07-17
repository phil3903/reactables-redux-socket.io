import { subscribe, unsubscribe, emit, connect,  } from '../../lib/events'
import { testAction, buttonClick } from '../actions'

const BUTTON_WAS_CLICKED = 'button:wasClicked'

const onConnect =()=> {
  console.log('connected to server')
}
/**
 Subscribe events
 */
const STATUS_CHANGED = 'event:statusChanged'
const statusChanged =(eventData, store) =>{
  const { dispatch } = store
  dispatch(testAction(eventData))
}

/**
 * Emitters
 */


/**
 * Rules
 */
const shouldSubscribe =(store, action)=>{
  const state = store.getState()
  return state.main < 2
}

const shouldUnsubscribe = (store, action)=>{
  const state = store.getState()

  console.log(state.main)
  return state.main >= 2
}

export const events = [
  connect(onConnect),
  subscribe(STATUS_CHANGED, statusChanged, shouldSubscribe),
  //subscribe(STATUS_CHANGED, (eventData)=> console.log(eventData)),
  unsubscribe(STATUS_CHANGED, statusChanged, shouldUnsubscribe),
  emit(BUTTON_WAS_CLICKED, buttonClick)
]