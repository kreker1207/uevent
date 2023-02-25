import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from "react-redux";
import { fetchLogin } from '../utils/authActions';
import { useNavigate } from 'react-router-dom';
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';

export default function Login() {
  const { loading, userInfo, error } = useSelector((state) => state.auth)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect( () => {
    if(Object.keys(userInfo).length !== 0) {
      navigate(`/users/${userInfo.id}`)
    }
    console.log(window.innerHeight)
  }, [navigate, userInfo] )

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(handleValidation()) {
        const data = await dispatch(fetchLogin(email, password))
        console.log(data?.payload)
      }
    } catch (error) {
      handleValidation()
    }
  };

  const handleValidation = () => {
    if (email === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    } else if (error) {
      toast.error(error, toastOptions);
      return false;
    }
    return true;
  }


  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
      <ToastContainer/>
    </FormContainer>
  )
}

const FormContainer = styled.div`
  margin: 0 auto;
  width: fit-content;
  background-color: black;
  padding: 10px;
  height 100%;

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    button {
      width: 100%;
    }
  }
`;