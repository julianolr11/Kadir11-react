import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './global.css'

document.body.classList.add('hide-default-cursor')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
