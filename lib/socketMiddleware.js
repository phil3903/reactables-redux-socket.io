import { EventTypes } from './events'

export default function socketMiddleware(manager, events) {

  //connect and finish config
  const socket = manager.connect()
  manager['disconnect'] =()=> socket.disconnect()
  manager['socket'] = socket
  manager['handlers'] = {}

  /**
   * Reduce Event Types
   */

  events = events.reduce((events, event) => {
    switch(event.type) {
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
  }, {subscribers: [], unsubscribers: [], emitters: []})


  /**
   * Middleware
   */
  return store => next => action => {

    /**
     * Subscribe
     */
    events.subscribers.forEach(event =>{
      const { eventName, func, handler } = event
      if(!doesSocketExist(manager, eventName))
        func(manager, store, action)
    })

    /**
     * Unsubscribe
     */
    events.unsubscribers.forEach(event =>{
      const { eventName, func } = event
      if(doesSocketExist(manager, eventName)){
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
function doesSocketExist(manager, eventName){
  return manager.socket._callbacks !== undefined && manager.socket._callbacks[`$${eventName}`]
}











// const authenticated = !connectEvents || connectEvents.some(event => event === action.type)
// const unauthenticated = disconnectEvents.some(event => event === action.type)
//
// if (authenticated) {
//   const {token} = action.response
//   socket.connect(token)
//   socket.start(store)
// }
//
// if (unauthenticated) {
//   socket.disconnect()
// }
