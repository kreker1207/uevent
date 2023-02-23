import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import MainPage from './pages/MainPage'
import Login from './pages/Login'
import Register from './pages/Register'
import EventPage from './pages/EventPage'
import UserPage from './pages/UserPage'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainPage/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/events/:id' element={<EventPage/>}/>
        <Route element = {<ProtectedRoute/>}>
          <Route path='/user-profile' element={<UserPage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
