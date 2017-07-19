import {subscribe, unsubscribe, emit, connect } from '../../lib/events'
import {testAction, clickButton, BUTTON_CLICK} from '../actions'

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
  dispatch(clickButton(123))
}

const secondaryHandler =(eventData, store, socket)=>{
  console.log(eventData, 'secondary')
}

/**
 * Emitters
 */

const BUTTON_WAS_CLICKED = 'button:wasClicked'
const buttonClick = (store, action)=>{
  return action.data
}


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

const shouldEmit =(store, action)=>{
  return action.type === BUTTON_CLICK
}

export const events = [
  connect(onConnect),
  subscribe(STATUS_CHANGED, statusChanged),
  subscribe(STATUS_CHANGED, secondaryHandler),
  unsubscribe(STATUS_CHANGED, statusChanged, shouldUnsubscribe),
  unsubscribe(STATUS_CHANGED, secondaryHandler, secondaryShouldUnsubscribe),
  emit(BUTTON_WAS_CLICKED,  buttonClick, shouldEmit)
]