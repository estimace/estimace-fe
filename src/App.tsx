import { Route, Routes } from 'react-router-dom'

import HomePage from './Home'
import CreateRoom from './NewRoom'
import RoomPage from './RoomPage'

function App() {
  return (
    <Routes>
      <Route Component={HomePage} path="/" />
      <Route Component={CreateRoom} path="/rooms" />
      <Route Component={RoomPage} path="/rooms/:slug" />
    </Routes>
  )
}

export default App
