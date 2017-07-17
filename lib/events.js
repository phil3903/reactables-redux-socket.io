export const EventTypes = {
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
export const subscribe = (eventName, handler, shouldExecute) =>
  event(eventName, handler, shouldExecute)
export const unsubscribe  = (eventName, handler, shouldExecute) =>
  event(eventName, handler, shouldExecute, EventTypes.UNSUBSCRIBE)
export const emit  = (eventName, data) =>
  (socket)=> socket.emit(eventName, data)

/**
 * helper
 */
function event(eventName, handler, shouldExecute = true, type = EventTypes.SUBSCRIBE) {

  return {
    eventName,
    type,
    func: (manager, store, action) => {
      if (
        typeof shouldExecute === 'function'
        ? shouldExecute(store, action)
        : shouldExecute
      ){
        const socketType = type === EventTypes.SUBSCRIBE ? 'on' : 'off'

        if(socketType === 'on') {
          const cb = (eventData) => handler(eventData, store, manager.socket)
          manager.handlers[eventName] = cb
          return manager.socket[socketType](eventName, cb)
        }

        if(socketType === 'off') {
          const cb = manager.handlers[eventName]
          return manager.socket.removeListener(eventName, cb)
        }
      }
    }
  }
}




