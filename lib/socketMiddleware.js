import { EventTypes } from './events'
import { INIT_SOCKET } from './configureSocket'

export default function socketMiddleware(manager, events) {

  /**
   * Reduce Event Types
   */

  events = events.reduce((events, event) => {
    switch(event.type) {
      case EventTypes.INITIAL:
        events.initial = [...event.initial, event]
        return events
      case EventTypes.SUBSCRIBE:
        events.subscribers = [...events.subscribers, event]
        return events
      case EventTypes.UNSUBSCRIBE:
        events.unsubscribers = [...events.unsubscribers, event]
        return events
      case EventTypes.EMIT:
        events.emitters = [...events.emitters, event]
        return events
      default:
        return events
    }
  }, {initial:[], subscribers:[], unsubscribers:[], emitters: [] })


  /**
   * Middleware
   */
  return store => next => action => {

    /**
     * INIT_SOCKET_MANAGER
     */
    if(action.type === INIT_SOCKET.type){
      //connect and finish config
      const socket = manager.connect()
      manager['disconnect'] =()=> socket.disconnect()
      manager['socket'] = socket
      manager['handlers'] = {}
      events.initial.forEach(event =>{
        event.func(manager, store, action)
      })
    }

    /**
     * Subscribe
     */
    events.subscribers.forEach(event =>{
      const { func } = event
      if(!doesSocketExist(manager, event))
        func(manager, store, action)
    })

    /**
     * Unsubscribe
     */
    events.unsubscribers.forEach(event =>{
      const { func } = event
      if(doesSocketExist(manager, event)){
        func(manager, store, action)
      }
    })

    /**
     * Emit
     */
    events.emitters.forEach(event =>{

    })

    return next(action)
  }
}

/**
 * Helpers
 */
function doesSocketExist(manager, event){
  const { eventName, handler } = event
  const handlers = manager.handlers[eventName] || []
  return handlers.some(h => h === handler)
  //return manager.socket._callbacks !== undefined && manager.socket._callbacks[`$${eventName}`]
}

function addHandler(){

}

function removeHandler(){

}
