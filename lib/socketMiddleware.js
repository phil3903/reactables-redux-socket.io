import { EventTypes } from './events'
import { INIT_SOCKET } from './configureSocket'

export default function socketMiddleware(manager, events) {

  /**
   * Reduce Event Types
   */

  const initializers = events.filter(e => e.type === EventTypes.INITIAL)
  const subscribers = events.filter(e => e.type === EventTypes.SUBSCRIBE)
  const unsubscribers = events.filter(e => e.type === EventTypes.UNSUBSCRIBE)
  const emitters = events.filter(e => e.type === EventTypes.EMIT)

  /**
   * Middleware
   */
  return store => next => action => {

    if(action.type === INIT_SOCKET.type) {
      const socket = manager.connect()

      manager['disconnect'] = () => socket.disconnect()
      manager['socket'] = socket
      manager['handlers'] = {}
      initializers.forEach(event => event.func(manager, store, action))
    }

    subscribers.forEach(event => event.func(manager, store, action))
    unsubscribers.forEach(event => event.func(manager, store, action))
    emitters.forEach(event => event.func(manager, store, action))

    next(action)
  }
}