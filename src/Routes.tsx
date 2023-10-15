import { Route, Routes } from 'react-router-dom'

import HomePage from 'app/pages/Home'
import { RoomCreation } from 'app/pages/RoomCreation'
import RoomPage from 'app/pages/Room'
import NotFound from 'app/pages/NotFound'

function App() {
  return (
    <Routes>
      <Route Component={HomePage} path="/" />
      <Route Component={RoomCreation} path="/rooms" />
      <Route Component={RoomPage} path="/rooms/:id" />
      <Route Component={NotFound} path="*" />
    </Routes>
  )
}

export default App
