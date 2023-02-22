import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from "react-redux";
import { fetchLogin } from '../utils/authActions';
import { useNavigate } from 'react-router-dom';
//import { login } from '../utils/store';

export default function Login() {
  const { loading, userInfo, error } = useSelector((state) => state.auth)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect( () => {
    if(userInfo) {
      navigate(`/users/${userInfo.id}`)
    }
  }, [navigate, userInfo] )

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(fetchLogin(email, password))
  };

  return (
    <form onSubmit={handleSubmit}>
      { error && <>{error}</> }
      <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Log in'}
      </button>
    </form>
  )
}
