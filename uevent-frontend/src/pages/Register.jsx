import React, {useState} from 'react'
import { useDispatch, useSelector } from "react-redux";
import { fetchRegister } from '../utils/authActions';

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const { loading, error } = useSelector(
    (state) => state.register
  )
  const dispatch = useDispatch();
  //const isLoggedIn = useSelector(state => Boolean(state.auth.userInfo));

  const handleSubmit = (e) => {
    e.preventDefault();
    if(password !== passwordConfirm) {
      alert('Password mismatch')
    }
    dispatch(fetchRegister(firstName, email, password, passwordConfirm))
  };

  return (
    <form onSubmit={handleSubmit}>
      { error && <>{error}</> }
      <input type="text" value={firstName} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="text" value={email} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
      <input type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} placeholder="Repeat password"/>
      <button type="submit" disabled={loading}>
        {loading ? 'Signing up...' : 'Sign up'}
      </button>
    </form>
  )
}
