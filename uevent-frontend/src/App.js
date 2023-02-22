import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import MainPage from './pages/MainPage'
import Login from './pages/Login'
import Register from './pages/Register'
import EventPage from './pages/EventPage'
import UserPage from './pages/UserPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainPage/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/events/:id' element={<EventPage/>}/>
        <Route path='/users/:id' element={<UserPage/>}/>
      </Routes>
    </BrowserRouter>
  )
}
