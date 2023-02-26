import React, {useState} from 'react'
import styled from 'styled-components';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth)
  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate()
  const handleOnClick = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const li = [
    { id: 1, label: "Events", path: '/'},
    { id: 2, label: "Companies", path: '/companies' },
    { id: 3, label: "Orders", path: '/orders' },
    { id: 4, label: "Account", path: '/user-profile' },
    { id: 5, label: Object.keys(userInfo).length !== 0 ? 'Sign Out ' : 'Sign In' , path: '/login' }
  ];


  const handleSign = async (e) => {
    if(Object.keys(userInfo).length !== 0) {
      if(isOpen) {
        setIsOpen(!isOpen)
      }
      navigate('/login')
    } else {
        //await dispatch(fetchLogout)
        if(isOpen) 
          setIsOpen(!isOpen)
        navigate('/login')
    }
  }

  return (
    <header>
      <Nav>
        <img src={require('../assets/logo.png')} alt="logo" />
        <ul className={`${isOpen && "open"}`}>
          {
            li.map(({ id, label, path }, index) => (
              <li
                key={id}
                onClick=
                {
                  id !== 5 ?
                    (
                      isOpen ? 
                      () => { setIsOpen(!isOpen); handleOnClick(index) } 
                      : 
                      () => handleOnClick(index)
                    ) 
                    : 
                    (
                      isOpen ? 
                      () => { setIsOpen(!isOpen); handleOnClick(index); handleSign()} 
                      : 
                      () => { handleOnClick(index); handleSign()}
                    )
                }
                className= {index === activeIndex ? "active" : ""}
              >
                {
                  id !== 5 ? <NavLink to={path}>{label}</NavLink> : `${label}`
                }
              </li>
            ))
          }
          {/* <li> <NavLink onClick={handleSign} to='/login'> {Object.keys(userInfo).length !== 0 ? 'Sign Out ' : 'Sign In' }</NavLink></li> */}
          <div onClick={() => setIsOpen(!isOpen)}>
            <NavLink to='/basket'>
              <img src={require('../assets/basket.png')} alt="logo" />
              <div className= {Object.keys(userInfo).length !== 0 ? 'auth' : ''}><p>2</p></div>
            </NavLink>
            </div>
        </ul>
        <div
          className={`nav-toggle ${isOpen && "open"}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="bar"></div>
        </div>
      </Nav>
    </header>
  )
}

const Nav = styled.nav`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ul {
    display: flex;
    align-items: center;
    div {
      position: relative;
      opacity: 0.9;
      display: inline-block;
      list-style: none;
      margin: 10px 30px;
      a {
        text-decoration: none;
        position: relative;
        img {
          display: inline-block;
          width: 32px;
          height: 32px;
        }
        div {
          display: none;
          &.auth {
            margin: 0;

            display: flex;
            justify-content: center; 
            align-items: center; 

            position: absolute;
            right: -15px;
            top: 10px;

            width: 20px;
            height: 20px;
            border-radius: 50%;
            color: #ffffff;
            background-color: red;
          }
        }
      }
    }
    li {
      position: relative;
      opacity: 0.9;
      display: inline-block;
      list-style: none;
      margin: 10px 30px;
      cursor: pointer;
      color: black;
      &.active {
          &::after {
          content: "";
          position: absolute;
          left: 0;
          top: 120%;
          width: 100%;
          opacity: 1;
          height: 2px;
          background: #ffffff;
          transition: all 0.45s;
        }
      }

      &:hover {
        opacity: 1;
        &::after {
          width: 100%;
        }
      }
      &::after {
        content: "";
        position: absolute;
        left: 0;
        top: 120%;
        width: 0;
        height: 2px;
        background: #ffffff;
        transition: all 0.45s;
      }
      a {
        text-decoration: none;
        color: black;
      }
    }
  }
  
  .nav-toggle {
    display: none
  }

  @media (max-width: 800px) {
    ul {
      position: absolute;
      top: 92px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      background: #cbc6c0;
      left: 0;
      width: 100%;
      height: 100%;
      transform: translateX(-100%);
      transition: all .45s;
      padding-top: 20px;

      li {
        &::before {
          background: transparent;
        }
      }

      &.open {
        transform: translateX(0);
      }
    }

    .nav-toggle {
      display: flex;
      width: 50px;
      height: 50px;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      .bar {
        position: relative;
        width: 32px;
        height: 2px;
        background: #ffffff;
        transition: all 0.45s ease-in-out;

        &::before,
        &::after {
          content: "";
          position: absolute;
          height: 2px;
          background: #ffffff;
          border-radius: 2px;
          transition: all 0.45s ease-in-out;
        }

        &::before {
          width: 25px;
          transform: translateY(-8px);
          right: 0;
        }
        &::after {
          width: 32px;
          transform: translateY(8px);
        }
      }

      &.open {
        .bar {
          transform: translateX(-40px);
          background: transparent;
          &::before {
            width: 32px;
            transform: rotate(45deg) translate(26px, -26px);
          }
          &::after {
            transform: rotate(-45deg) translate(26px, 26px);
          }
        }
      }
    }
  }

  img {
    width: 72px;
    height: 72px;
  }
`;