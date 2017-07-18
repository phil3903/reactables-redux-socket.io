import remove from 'lodash/remove'
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
      if (
        typeof shouldExecute === 'function'
        ? shouldExecute(store, action)
        : shouldExecute
      ){
        const socketType = type === EventTypes.SUBSCRIBE || type === EventTypes.INITIAL
          ? 'on' : 'off'

        if(socketType === 'on') {
          const handlers = manager.handlers[eventName] || []
          handlers.push(handler)
          manager.handlers[eventName] = handlers

          if (handlers.length > 0) {
            manager.socket.on(eventName, (eventData) => {
              const currentHandlers = manager.handlers[eventName] || []
              currentHandlers.forEach(h => h(eventData, store, manager.socket))
            })
          }
        }

        if(socketType === 'off') {
          const handlers = manager.handlers[eventName] || []
          manager.handlers[eventName] = remove(handlers, (h)=> h !== handler)

          if(manager.handlers[eventName].length <= 0){
            delete manager.handlers[eventName]
            manager.socket.removeAllListeners(eventName)
          }
        }
      }
    }
  }
}




