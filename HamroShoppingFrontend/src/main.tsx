import React from 'react'
import ReactDOM from 'react-dom/client'
import './App.css'
import { Provider } from 'react-redux'
import { store } from './store'
import router from './routes'
import { RouterProvider } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
