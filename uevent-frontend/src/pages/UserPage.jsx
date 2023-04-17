import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import api from '../utils/apiSetting'
import { IconContext } from 'react-icons'
import { FaCalendar, FaClock, FaMapMarkerAlt, FaPencilAlt, FaTrashAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import Pagination from 'react-js-pagination'

export default function UserPage() {
  const [userSettings, setUserSettings] = useState('user')
  const { userInfo } = useSelector((state) => state.auth)
  const [user, setUser] = useState({ data: {}, isLoading: true })
  const [userCompanies, setUserCompanies] = useState({ data: [], isLoading: true })
  const [userEvents, setUserEvents] = useState({ data: {}, isLoading: true })
  const [subscriptions, setSubscriptions] = useState({data: [], isLoading: true})
  const navigate = useNavigate()
  
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


  useEffect(() => {
    if(Object.keys(user.data) !== 0 && user.data.id) {
      api.get(`/org/users/${user.data.id}`)
      .then(response => {
        console.log(response.data)
        setUserCompanies({
          data: response.data,
          isLoading: false
        })
      })
      .catch(error => {
        console.log(error.message)
      })
    }
  }, [user])

  useEffect(() => {
    if(Object.keys(user.data) !== 0 && user.data.id) {
      api.get(`/event/user/${user.data.id}`)
      .then(response => {
        console.log(response.data)
        setUserEvents({
          data: response.data,
          isLoading: false
        })
      })
      .catch(error => {
        console.log(error.message)
      })
    }
  }, [user])

  useEffect(() => {
    if(Object.keys(user.data) !== 0 && user.data.id) {
      api.get('/users/sub')
      .then(response => {
        setSubscriptions({
          data: response.data,
          isLoading: false
        })
        console.log(response.data)
      })
      .catch(error => {
        console.log(error.message)
      })
    }
  }, [user])

  const handlePageChange = (page) => {
    api.get(`/event/user/${user.data.id}/${page}`)
    .then(function(response) {
      // console.log(response.data)
      setUserEvents({
        data: response.data,
        isLoading: false
      })
    })
    .catch(function(error) {
        console.log(error.message)
    })
  }

  const handleUploadPhoto = async (event) => {
    try {
        let formData = new FormData()
        const file = event.target.files[0]
        console.log(file)
        formData.append('avatar', file)

        // eslint-disable-next-line
        const { data } = await axios({
            method: "post",
            url: `http://localhost:8080/api/users/avatar`,
            data: formData,
            headers: {'Access-Control-Allow-Origin': '*', "Content-Type": "multipart/form-data" },
            credentials: 'include',   
            withCredentials: true
        })

    } catch (error) {
        console.warn(error)
        alert('Error occured!')
    }
  }

  const handleCompanyClick = (id) => {
    navigate(`/companies/${id}`)
  }

  const handleEventEditClick = (item) => {
      // console.log(item.tags)
      navigate('/create-event', { state: {
        id: item.id,
        title: item.title,
        description: item.description,
        seats: item.seat,
        price: item.price,
        event_datetime: item.event_datetime,
        format: item.format,
        location: item.location,
        eve_pic: item.eve_pic,
        tags: item.tags,
  
        publish_date: item.publish_date,
        ev_type: item.is_everybody,
      } });
  }

  const handleCompanyEditClick = (item => {
    navigate('/create-company', { state: {
      id: item.id,
      title: item.title,
      description: item.description,
      location: item.location,
      phone_number: item.phone_number,
    } });
  })

  const handleUnsubscribe = (id) => {
    api.post(`/events/${id}/sub`)
    .then(response => {
      setSubscriptions({
        data: [],
        isLoading: false
      })
      console.log(response.data)
    })
    .catch(error => {
      console.log(error.message)
    })
  }

  const handleEventClick = (id) => {
    navigate(`/events/${id}`)
  }

  const handleEventDeleteClick = (id) => {
    api.delete(`/events/${id}`)
      .then(response => {
        console.log(response.data)
      })
      .catch(error => {
        console.log(error.message)
      })
  }
  const handleCompanyDeleteClick = (id) => {
    api.delete(`/org/${id}`)
      .then(response => {
        console.log(response.data)
      })
      .catch(error => {
        console.log(error.message)
      })
  }

  return (
    <Container>
      {
        user.isLoading ? 
        <div className="loading">Loading...</div>
        :
        <div className='content-block'>
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
              {
                subscriptions.isLoading ? 
                <div className="loading">Loading...</div>
                :
                <div className="subscriptions">
                  {
                    subscriptions.data.map((item, index) => {
                      return (
                        <div key={index} className="subscription">
                          <h2 style={{margin: '0'}}>{item.title}</h2>
                          <button onClick={() => handleUnsubscribe(item.event_id)}>Unsubscribe</button>
                        </div>
                      )
                    })
                  }
                </div>
              }
            </div>
            :
            <div className="companies-settings">
              <div className="buttons">
                <button className='unactive' onClick={()=>setUserSettings('user')}>User</button>
                <button className='active'>Companies</button>
              </div>
              <h2>My companies</h2>
              {
                userCompanies.isLoading ? 
                <div className="loading">Loading...</div>
                :
                <div className="companies">
                {
                  userCompanies.data.map((item, index) => {
                    return (
                      <div className="company" key={index}>
                        <div className="img-block">
                          <div className="compnay-img">
                            <img src={`http://localhost:8080/organization_pics/${item.org_pic}`} alt="logo" />
                          </div>
                        </div>
                        <div className='company-content'>
                          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} className='company-header'>
                            <h2>{item.title}</h2>
                            <IconContext.Provider value={{ style: { verticalAlign: 'middle', marginRight: "20px" } }}>
                                <div>
                                  <FaPencilAlt style={{cursor: 'pointer'}} onClick={() => handleCompanyEditClick(item)}/> <FaTrashAlt style={{color: 'red', cursor: 'pointer'}} onClick={() => handleCompanyDeleteClick(item.id)}/>
                                </div>
                            </IconContext.Provider>
                          </div>
                          <div className='description'>{item.description}</div>
                          <div className='additionals'>
                            <div style={{width: "70%"}}>
                              <IconContext.Provider value={{ style: { verticalAlign: 'middle', marginRight: "5px" } }}>
                                <div>
                                  <FaCalendar/> Events number: {item.event_count}
                                </div>
                              </IconContext.Provider>
                              <IconContext.Provider value={{ style: { verticalAlign: 'middle', marginRight: "5px" } }}>
                                <div className='location'>
                                  <FaMapMarkerAlt /> {item.location}
                                </div>
                              </IconContext.Provider>
                            </div>
                            <button onClick={() => handleCompanyClick(item.id)}>See More</button>
                          </div>
                        </div>
                      </div>
                    )
                  })
                }
                </div>
              }
              <h2>All companies events</h2>
              {
                userEvents.isLoading ? 
                <div className="loading">Loading...</div>
                :
                <div className="events">
                {
                  userEvents.data.data.map((item, index) => {
                    return (
                      <div className="event" key={index}>
                        <div className='time-location'>
                          <IconContext.Provider value={{ style: { verticalAlign: 'middle', marginRight: "5px" } }}>
                            <p className='location'>
                              <FaMapMarkerAlt/>{item.location}
                            </p>
                          </IconContext.Provider>
                          <IconContext.Provider value={{ style: { verticalAlign: 'middle', marginRight: "5px" } }}>
                            <p className='time'>
                              <FaClock/>{item.event_datetime}
                            </p>
                          </IconContext.Provider>
                        </div>
                        <div className='description'>
                          <h2>{item.title}</h2>
                          <p>{item.description}</p>
                        </div>
                        <div className='price'>
                          <div className="buttons">
                            <button className='more' onClick={() => handleEventClick(item.id)}>More</button>
                            <IconContext.Provider value={{ style: { verticalAlign: 'middle', marginRight: "20px" } }}>
                                <div>
                                  <FaPencilAlt style={{cursor: 'pointer', marginLeft: '20px'}} onClick={() => handleEventEditClick(item)}/> <FaTrashAlt style={{color: 'red', cursor: 'pointer'}} onClick={() => handleEventDeleteClick(item.id)}/>
                                </div>
                            </IconContext.Provider>
                          </div>
                          <p>{item.price}$</p>
                        </div>
                      </div>
                    )
                  })
                }
                </div>
              }
              {     
                userEvents.isLoading? 
                <></> 
                : 
                <Pagination className='pagination'
                            activePage={Number(userEvents.data.pagination.currentPage)}
                            itemsCountPerPage={userEvents.data.pagination.perPage}
                            totalItemsCount={userEvents.data.pagination.total}
                            pageRangeDisplayed={5}
                            onChange={handlePageChange} 
                /> 
              }
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

    .content-block {
      display: flex;
      justify-content: center;
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
          width: 220px;
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
        .subscriptions {
          display: flex;
          justify-content: flex-start;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          .subscription {
            display: flex;
            justify-content: space-between;
            align-items: center;

            background: #333533;
            width: 100%;
            padding: 15px;
            button {
              all: unset;
              background: #FFD100;
              color: #ffffff;
              padding: 8px 50px;
              cursor: pointer;
            }
          }
        }
      }
      .companies-settings {
        flex-grow: 1;
        h2 {
          margin: 20px 0px;
        }
        button {
          width: 220px;
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

        .companies {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          grid-auto-rows: auto;
          grid-gap: 10px;

          .company {
            h2 {
              margin: 0;
            }
            display: flex;
            justify-content: space-between;
            align-items: stretch;
            background: #333533;
            gap: 20px;
            padding: 25px;
            .img-block {
              width: 20%;
              .compnay-img {
                width: 100%;
                height: 0;
                padding-bottom: 100%;
                border-radius: 65%;
                overflow: hidden;
                position: relative;
                img {
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                  object-position: center top;
                }
              }
            }
            .company-content {
              width: 80%;
              display: flex;
              flex-direction: column;
              .description {
                margin: 20px 0;
                -ms-text-overflow: ellipsis;
                -o-text-overflow: ellipsis;
                text-overflow: ellipsis;
                overflow: hidden;
                -ms-line-clamp: 3;
                -webkit-line-clamp: 3;
                line-clamp: 3;
                display: -webkit-box;
                display: box;
                word-wrap: break-word;
                -webkit-box-orient: vertical;
                box-orient: vertical;
              }
              .additionals {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: auto;

                gap: 10%;

                button {
                  width: 20%;
                  height: 40px;
                  background: #FFD100;
                  font-weight: 700;
                  border: none;
                  color: #fff;
                }

                .location {
                  margin: 0;
                  flex-basis: 1;
                  -ms-text-overflow: ellipsis;
                  -o-text-overflow: ellipsis;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  -ms-line-clamp: 1;
                  -webkit-line-clamp: 1;
                  line-clamp: 1;
                  display: -webkit-box;
                  display: box;
                  word-wrap: break-word;
                  -webkit-box-orient: vertical;
                  box-orient: vertical;
                }
              }
            }
          }
        }
        .events {
          max-width: 1480px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-gap: 10px;
          margin-bottom: 60px;

          .event {
            background-color: #ffffff;
            border: 1px solid #000000;
            background: #333533;
            box-shadow: 0px 4px 50px 4px rgba(0, 0, 0, 0.25);

            display: flex;
            justify-content: space-between;
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
            height: fit-content;
            padding: 25px 20px;

            .time-location {
              width: 100%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              p {
                width: 50%;
              }
              .time {
                text-align: end;
              }
              .location {
                margin: 0;
                -ms-text-overflow: ellipsis;
                -o-text-overflow: ellipsis;
                text-overflow: ellipsis;
                overflow: hidden;
                -ms-line-clamp: 1;
                -webkit-line-clamp: 1;
                line-clamp: 1;
                display: -webkit-box;
                display: box;
                word-wrap: break-word;
                -webkit-box-orient: vertical;
                box-orient: vertical;
              }
            } 
            .description {
              width: 100%;
              h2 {
                margin: 0;
              }
              p {
                margin: 0;
                -ms-text-overflow: ellipsis;
                -o-text-overflow: ellipsis;
                text-overflow: ellipsis;
                overflow: hidden;
                -ms-line-clamp: 2;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                display: -webkit-box;
                display: box;
                word-wrap: break-word;
                -webkit-box-orient: vertical;
                box-orient: vertical;
              }
            }
            .price {
              width: 100%;
              display: flex;
              justify-content: space-between;
              align-items: center;

              .buttons {
                width: fit-content;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 10px;
                  button {
                  width: fit-content;
                  height: fit-content;
                  text-align: center;
                  padding: 5px 20px;
                  font-weight: 700;
                  font-size: 20px;
                  border: none;
                  cursor: pointer;

                  &.more {
                    color: #fff;
                    background-color: #FFD100;
                  }
                }
              }
              p {
                font-weight: 700;
                font-size: 20px;
                color: #fff;
              }
            }
          }
        }
        .pagination {
          width: fit-content;
          margin: 0 auto;
          padding: 0 !important;
          li {
            display: inline-block;
            width: 30px;
            height: 30px;
            text-align: center;
            &.active {
              background: #FFD100;
              a {
                color: white;
              }
            }
            &.disabled {
              a {
                color: #D9D9D9;
              }
            }
            a {
              text-decoration: none;
              color: #fff;
              font-weight: 700;
              display: block;
              padding-top: 2px;
              height: 30px;
            }
          }
        }
      }
    }
`
