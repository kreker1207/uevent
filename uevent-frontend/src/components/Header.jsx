import React from 'react'
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header>
      <Nav>
        <img src={require('../assets/logo.png')} alt="logo" />
        <ul>
          <li><NavLink to='/'>Events</NavLink></li>
          <li><NavLink to='/'>Companies</NavLink></li>
          <li><NavLink to='/'>Orders</NavLink></li>
          <li><NavLink to='/user-profile'>Account</NavLink></li>
          <li><NavLink to='/login'>Sign In</NavLink></li>
          <li><NavLink to='/basket'><img src={require('../assets/basket.png')} alt="logo" /></NavLink></li>
        </ul>
      </Nav>
    </header>
  )
}

const Nav = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ul {
    display: flex;
    align-items: center;
    li {
      display: inline-block;
      list-style: none;
      margin: 10px 30px;
      a {
        text-decoration: none;
        color: red;
        img {
          display: inline-block;
          width: 32px;
          height: 32px;
        }
      }
    }
  }
  img {
    width: 72px;
    height: 72px;
  }
`;