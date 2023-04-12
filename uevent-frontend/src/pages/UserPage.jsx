import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import api from '../utils/apiSetting'

export default function UserPage() {
  const [userSettings, setUserSettings] = useState('user')
  const { userInfo } = useSelector((state) => state.auth)
  const [user, setUser] = useState({ data: {}, isLoading: true })
  const inputFileRef = useRef(null)

  useEffect(() => {
    api.get(`/users/${userInfo.id}`)
      .then(response => {
        setUser({
          data: response.data,
          isLoading: false
        })
      })
      .catch(error => {
        console.log(error.message)
      })
  }, [userInfo])

  const handleUploadPhoto = async (event) => {
    try {
        let formData = new FormData()
        const file = event.target.files[0]
        console.log(file)
        formData.append('avatar', file)
        console.log(formData)

        const { data } = await axios({
            method: "post",
            url: `http://localhost:8080/api/users/avatar`,
            data: formData,
            headers: {'Access-Control-Allow-Origin': '*', "Content-Type": "multipart/form-data" },
            credentials: 'include',   
            withCredentials: true
        })

        console.log(data);

    } catch (error) {
        console.warn(error)
        alert('Error occured!')
    }
  }

  return (
    <Container>
      {
        user.isLoading ? 
        <div className="loading">Loading...</div>
        :
        <div className='first-block'>
          <div className="preview">
            <div className="photo">
              <img src = {`http://localhost:8080/profile_pics/${user.data.profile_pic}`} alt="" />
            </div>
            <h3>{user.data.login}</h3>
            <button>Settings</button>
            <button onClick={() => inputFileRef.current.click()}>Upload Photo</button>
            <input ref={inputFileRef} onChange={handleUploadPhoto} type="file" hidden/>
          </div>
          {
            userSettings === 'user' ? 
            <div className="user-settings">
              <div className="buttons">
                <button className='active'>User</button>
                <button className='unactive' onClick={()=>setUserSettings('companies')}>Companies</button>
              </div>
              <h2>My tickets</h2>
              <h2>Notification subscriptions</h2>
            </div>
            :
            <div className="companies-settings">
              <div className="buttons">
                <button className='unactive' onClick={()=>setUserSettings('user')}>User</button>
                <button className='active'>Companies</button>
              </div>
              <h2>My companies</h2>
              <h2>All companies events</h2>
            </div>
          }
        </div>
      }
    </Container>
  )
}

const Container = styled.div`
    max-width: 1480px;
    margin: 0 auto;
    padding: 0px 20px;

    .first-block {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 35px;
      .preview {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        button {
          width: 100%;
          height: 40px;
          background: #FFD100;
          border: none;
          color: #fff;
          cursor: pointer;
        }
        .photo {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          overflow: hidden; /* hide the overflow of the image */
          position: relative; /* set position to relative to contain the image */
          img {
            height: 100%; /* set the height of the image to 100% */
            object-fit: cover; /* to fill the entire container and maintain aspect ratio */
            position: absolute; /* position the image absolutely */
            top: 0; /* set the top position to 0 */
            left: 0; /* set the left position to 0 */
          }
        }
      }
      .user-settings {
        flex-grow: 1;
        h2 {
          margin: 20px 0px;
        }
        button {
          width: 225px;
          height: 50px;
          background: rgb(32, 32, 32);
          border: 1px solid #fff;
          color: #fff;
          cursor: pointer;
          &.active {
            background: #FFD100;
            border-right: none;
          }
          &.unactive {
            border-left: none;
          }
        }
      }
      .companies-settings {
        flex-grow: 1;
        h2 {
          margin: 20px 0px;
        }
        button {
          width: 225px;
          height: 50px;
          background: rgb(32, 32, 32);
          border: 1px solid #fff;
          color: #fff;
          cursor: pointer;
          &.active {
            background: #FFD100;
            border-left: none;
          }
          &.unactive {
            border-right: none;
          }
        }
      }
    }
`
