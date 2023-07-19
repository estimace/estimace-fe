import { Route, Routes } from 'react-router-dom'

import HomePage from './Home'
import { RoomCreation } from './RoomCreation'
import RoomPage from './RoomPage'

function App() {
  return (
    <Routes>
      <Route Component={HomePage} path="/" />
      <Route Component={RoomCreation} path="/rooms" />
      <Route Component={RoomPage} path="/rooms/:id" />
    </Routes>
  )
}

export default App
