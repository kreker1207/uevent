import React, {useEffect} from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header'
import MainPage from './pages/MainPage'
import Login from './pages/Login'
import Register from './pages/Register'
import EventPage from './pages/EventPage'
import UserPage from './pages/UserPage'
import Footer from './components/Footer'
import Basket from './pages/Basket'
import Orders from './pages/Orders'
import Companies from './pages/Companies'

import { useDispatch, useSelector } from 'react-redux'
import { fetchProfile } from './utils/authActions'
import { EmailActivation } from './pages/EmailConfirmation'

export default function App() {
  const dispatch = useDispatch()
  const { userInfo } = useSelector(state => state.auth)
  useEffect(() => {
      const updateToken = async () => {
        const data = await dispatch(fetchProfile())
        console.log(data)
        if (Object.keys(userInfo).length !== 0 && 'accessToken' in userInfo) {
          window.localStorage.setItem('accessToken', data.payload.accessToken)
        } 
    }
    updateToken()
    // eslint-disable-next-line
  }, [dispatch])
  return (
    <BrowserRouter>
      <Header/>
      <main>
        <Routes>
          <Route path='/' element={<MainPage/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route exact path='/confirmEmail/:activationToken' element={ <EmailActivation/> } />

          <Route path='/events/:id' element={<EventPage/>}/>
          <Route path='/companies' element={<Companies/>}/>
          <Route element = {<ProtectedRoute/>}>
            <Route path='/user-profile' element={<UserPage/>}/>
          </Route>
          <Route element = {<ProtectedRoute/>}>
            <Route path='/orders' element={<Orders/>}/>
          </Route>
          <Route element = {<ProtectedRoute/>}>
            <Route path='/basket' element={<Basket/>}/>
          </Route>
        </Routes>
      </main>
      <Footer/>
    </BrowserRouter>
  )
}
