import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/apiSetting';
import { IconContext } from 'react-icons';
import { FaClock, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

export default function CompanyPage() {
    const { id } = useParams();
    const [organization, setOrganization] = useState({data: {}, isLoading: true})
    const [events, setEvents] = useState({data: {}, isLoading: true})
    const navigate = useNavigate()

    useEffect(() => {
        api.get(`/org/${id}`)
            .then(function (response) {
                console.log(response.data)
                setOrganization({
                    data: response.data,
                    isLoading: false
                })
            })
            .catch(function(error) {
                console.log(error.message)
            })
    }, [id])

    useEffect(() => {
        api.get(`/event/org/${id}`)
            .then(function (response) {
                console.log(response.data)
                setEvents({
                    data: response.data,
                    isLoading: false
                })
            })
            .catch(function(error) {
                console.log(error.message)
            })
    }, [id])

    const handleEventClick = (id) => {
        navigate(`/events/${id}`)
      }

    return (
        <Container>
            {
                organization.isLoading ? 
                <div className="loading">Loading...</div>
                :
                <div className="company">
                    <div className="organization-image">
                        <img src={`http://localhost:8080/organization_pics/${organization.data.org_pic}`} alt="" />
                    </div>
                    <div className="organization-info">
                        <h2 style={{marginBottom: "10px"}}>{organization.data.title}</h2>
                        <div style={{marginBottom: '30px'}}>{organization.data.description}</div>
                        <div className="organization-contacts">
                            <h3>Contacts</h3>
                            <IconContext.Provider value={{ style: { verticalAlign: 'middle', marginRight: "5px" } }}>
                                <p>
                                    <FaPhone/>{organization.data.phone_number}
                                </p>
                            </IconContext.Provider>
                            <IconContext.Provider value={{ style: { verticalAlign: 'middle', marginRight: "5px" } }}>
                                <p>
                                    <FaMapMarkerAlt/>{organization.data.location}
                                </p>
                            </IconContext.Provider>
                        </div>
                    </div>
                    <div className="organization-events">
                        {
                            events.isLoading ? 
                            <div className="loading">Loading...</div>
                            :
                            events.data.data.map((item, index) => {
                                return (
                                    <div className="event" key={index}>
                                      <img src={`http://localhost:8080/event_pics/${item.eve_pic}`} alt="" />
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
                                        <button onClick={() => handleEventClick(item.id)}>More</button>
                                        <p>{item.price}$</p>
                                      </div>
                                    </div>
                                  )
                            })
                        }
                    </div>
                </div>
            }
        </Container>
    )
}

const Container = styled.div`
    max-width: 1480px;
    margin: 0 auto;
    padding: 0px 20px;
    .company {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(2, auto);
        gap: 20px;
        .organization-image {
            position: relative;
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
        .organization-info {
            .organization-contacts {
                h3 {
                    margin: 0;
                }
                width: 100%;
                height: fit-content;
                padding: 35px;
                background: #333533;
            }
        }
        .organization-events {
            grid-column: 1 / span 2;
            grid-row: 2 / span 1;
            .event {
                grid-column: span 1; /* элементы занимают 1 колонку */
                grid-row: span 1; /* элементы занимают 1 строку */
                background-color: #ffffff;
                border: 1px solid #000000;
                background: #333533;
                box-shadow: 0px 4px 50px 4px rgba(0, 0, 0, 0.25);

                display: flex;
                justify-content: space-between;
                flex-direction: column;
                align-items: flex-start;
                img {
                    display: block;
                    width: 100%;
                    margin-bottom: 25px;
                }

                div {
                    width: 100%;
                    &.time-location {
                        max-width: 100%;
                        padding: 0px 25px;
                        margin-bottom: 10px;
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
                    &.description {
                        padding: 0px 25px;
                        margin-bottom: 10px;
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
                    &.price {
                        padding: 0px 25px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 25px;
                        button {
                        width: 330px;
                        height: 40px;
                        font-weight: 700;
                        font-size: 20px;

                        border: none;
                        color: #fff;
                        background-color: #FFD100;
                        cursor: pointer;
                        }
                        p {
                        font-weight: 700;
                        font-size: 20px;
                        color: #fff;
                        }
                    }
                }
            }
        }
    }
`