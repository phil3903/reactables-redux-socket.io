import ReactDOM from 'react-dom'
import React from 'react'
import { Provider } from 'react-redux'
import configureStore from './configureStore'

const store = configureStore(window.__initialState__, history)

// mount app
ReactDOM.render(
  <Provider store={ store } >
    <div>hi</div>
  </Provider>, document.getElementById('root')
)