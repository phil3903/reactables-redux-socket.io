import { createStore, applyMiddleware } from 'redux'
import socketMiddleware  from '../lib/socketMiddleware'
import rootReducer from './root_reducer'
import configureSocket, { INIT_SOCKET } from '../lib/configureSocket'
import { events } from './events/events'

export default function configureStore(initialState){

  const socketConfig = configureSocket('', { query: 'token=' + 'tokenArg' })

  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(
      //logger
      (store) => next => action => {
        console.log(action)
        next(action)
      },

      //smw
      socketMiddleware(socketConfig, events),
    )
  )

  store.dispatch(INIT_SOCKET)
  return store
}
