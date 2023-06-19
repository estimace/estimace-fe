import { Route, Routes } from 'react-router-dom'

import HomePage from './Home'
import CreateRoom from './NewRoom'

function App() {
  return (
    <Routes>
      <Route Component={HomePage} path="/" />
      <Route Component={CreateRoom} path="/rooms" />
      <Route Component={ActiveRoom} path="/rooms/*" />
    </Routes>
  )
}

export default App
