import remove from 'lodash/remove'
import hasProp from 'lodash/has'
export const EventTypes = {
  INITIAL: 'INITIAL',
  SUBSCRIBE: 'SUBSCRIBE',
  UNSUBSCRIBE: 'UNSUBSCRIBE',
  EMIT: 'EMIT'
}

/**
 * socket events
 */
export const connect = (handler) => event('connect', handler)
export const connectError = (handler) => event('connect_error', handler)
export const connectTimeout = (handler) => event('connect_timeout', handler)
export const disconnect = (handler) => event('disconnect', handler)
export const reconnect = (handler) => event('reconnect', handler)
export const reconnectAttempt = (handler) => event('reconnect_attempt', handler)
export const reconnecting = (handler) => event('reconnecting', handler)
export const reconnectError = (handler) => event('reconnect_error', handler)
export const reconnectFailure = (handler) => event('reconnect_failure', handler)
export const error = (handler) => event('error', handler)
export const ping = (handler) => event('ping', handler)
export const pong = (handler) => event('pong', handler)

/**
 * custom events
 */
export const subscribe =(eventName, handler, shouldExecute) =>
  event(eventName, handler, shouldExecute, EventTypes.SUBSCRIBE)

export const unsubscribe  = (eventName, handler, shouldExecute) =>
  event(eventName, handler, shouldExecute, EventTypes.UNSUBSCRIBE)

export const emit  = (eventName, data) =>
  (socket)=> socket.emit(eventName, data)

/**
 * helper
 */
function event(eventName, handler, shouldExecute = true, type = EventTypes.INITIAL) {

  return {
    eventName,
    handler,
    type,
    func: (manager, store, action) => {
      const willExecute = typeof shouldExecute === 'function' ? shouldExecute(store, action) : shouldExecute

      if (willExecute) {
        const handlers = manager.handlers[eventName] || []
        if (type === EventTypes.SUBSCRIBE || type === EventTypes.INITIAL) {
          // Create callback and event
          createEvent(manager, eventName, store)
          if(!handlers.some(h => h === handler)){
            handlers.push(handler)
            manager.handlers[eventName] = handlers
          }
        }

        if (type === EventTypes.UNSUBSCRIBE) {
          // remove unsubscribe handlers
          manager.handlers[eventName] = remove(handlers, (h) => h !== handler)
          removeEvent(manager, eventName)
        }
      }
    }
  }
}

function createEvent(manager, eventName, store){
  if (!hasProp(manager.handlers, eventName)) {
    manager.socket.on(eventName, (eventData) => {
      const currentHandlers = manager.handlers[eventName] || []
      currentHandlers.forEach(h => h(eventData, store, manager.socket))
    })
  }
}

function removeEvent(manager, eventName){
  if (manager.handlers[eventName].length <= 0) {
    delete manager.handlers[eventName]
    manager.socket.removeAllListeners(eventName)
  }
}





