import {subscribe, unsubscribe, emit, connect } from '../../lib/events'
import {testAction, buttonClick} from '../actions'

const BUTTON_WAS_CLICKED = 'button:wasClicked'

const onConnect =()=> {
  console.log('connected to server')
}
/**
 Subscribe events
 */
const STATUS_CHANGED = 'event:statusChanged'
const statusChanged = (eventData, store, socket) =>{
  const { dispatch } = store
  dispatch(testAction(eventData))
}

const secondaryHandler =(eventData, store, socket)=>{
  console.log(eventData, 'secondary')
}

/**
 * Emitters
 */


/**
 * Rules
 */
const shouldSubscribe =(store, action)=>{
  const state = store.getState()
  return state.main < 1
}

const shouldUnsubscribe = (store, action) =>{
  const state = store.getState()
  return state.main >= 3
}

const secondaryShouldUnsubscribe =(store) =>{
  const state = store.getState()
  return state.main >= 2
}

export const events = [
  connect(onConnect),
  subscribe(STATUS_CHANGED, statusChanged),
  subscribe(STATUS_CHANGED, secondaryHandler),
  unsubscribe(STATUS_CHANGED, statusChanged, shouldUnsubscribe),
  unsubscribe(STATUS_CHANGED, secondaryHandler, secondaryShouldUnsubscribe),
  emit(BUTTON_WAS_CLICKED, buttonClick)
]