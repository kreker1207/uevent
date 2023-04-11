import React, {useEffect} from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header'
import MainPage from './pages/MainPage'
import Login from './pages/Login'
import Register from './pages/Register'
import EventPage from './pages/EventPage'
import UserPage from './pages/UserPage'
import Companies from './pages/Companies'
import CreateEvent from './pages/CreateEvent'
import CreateCompany from './pages/CreateCompany'
import CompanyPage from './pages/CompanyPage'

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
          <Routes>
            <Route path='/' element={<MainPage/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route exact path='/confirmEmail/:activationToken' element={ <EmailActivation/> } />

            <Route path='/events/:id' element={<EventPage/>}/>
            <Route path='/companies' element={<Companies/>}/>
            <Route path='/companies/:id' element={<CompanyPage/>}/>
            <Route element = {<ProtectedRoute/>}>
              <Route path='/user-profile' element={<UserPage/>}/>
            </Route>
            {/* <Route element = {<ProtectedRoute/>}> */}
              <Route path='/create-event' element={<CreateEvent/>}/>
            {/* </Route> */}
            {/* <Route element = {<ProtectedRoute/>}> */}
            <Route path='/create-company' element={<CreateCompany/>}/>
            {/* </Route> */}
          </Routes>
    </BrowserRouter>
  )
}
