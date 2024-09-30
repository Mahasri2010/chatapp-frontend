import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Login from './Component/Authentication/Login'
import Profile from './Component/Profile/Profile'
import Chat from './Component/Chat/Chat'

const App = () => {
  return (
    <div>

      <Routes>
        
        <Route path='/' element={<Login />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/chat' element={<Chat />} />

      </Routes>
      
    </div>
  )
}

export default App