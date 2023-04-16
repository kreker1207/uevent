import React, { useEffect } from 'react'
import { useState } from 'react';
import styled from 'styled-components';
import api from '../utils/apiSetting';
import { useNavigate } from 'react-router-dom';
import  Pagination from 'react-js-pagination'

import { IconContext } from 'react-icons';
import { FaClock, FaHashtag, FaMapMarkerAlt } from "react-icons/fa";


export default function MainPage() {
  const navigate = useNavigate()
  const [events, setEvents] = useState({loading: true})
  const [tags, setTags] = useState([]);
  const [format, setFormat] = useState('');
  const [date, setDate] = useState('');
  const [themes, setThemes] = useState({data: [], isLoading: true})
  const [isOpen, setIsOpen] = useState(false);
  const [eventsToSearch, setEventsToSearch] = useState('')
  useEffect(() => {
    api.get(`/events`)
    .then(function(response) {
      setEvents({
        loading: false,
        data: response.data.data,
        pagination: response.data.pagination
      })
    })
    .catch(function(error) {
        console.log(error.message)
    })
  }, [])

  /*-----------------------------THEMES--------------------------------------*/
  useEffect(() => {
    api.get('/tags')
      .then(response => {
        setThemes({
          data: response.data,
          isLoading: false
        })
      })
      .catch(error => {
        console.log(error.message)
      })
  }, [])
  const handleOptionChange = (event) => {
    const optionValue = event.target.getAttribute('value');
    const isSelected = tags.includes(optionValue);
    if (isSelected) {
      setTags(tags.filter((value) => value !== optionValue));
    } else {
      setTags([...tags, optionValue]);
    }
  };
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  /*--------------------------------------------------------------------------*/

  /*-----------------------------SEARCH FUNCTIONS-----------------------------*/
  const handleSearchEvents = () => {
    api.post(`/events/search/`, {query: eventsToSearch})
      .then(response => {
        console.log(response.data)
        setEvents({
          loading: false,
          data: response.data.data,
          pagination: response.data.pagination
        })
      })
      .catch(error => {
        console.log(error.message)
      })
  }

  /*--------------------------------------------------------------------------*/

  /*-----------------------------FILTERS QUERY--------------------------------*/
  useEffect(() => {
    if(tags.length !== 0 || format !== '' || date !== '') {
      console.log('hui')
      api.post(`/filter/${events.pagination.currentPage}`, {theme: tags.length === 0 ? null : tags, format: format === '' ? null : format, event_datetime: date})
        .then(response => {
          // console.log(response.data)
          setEvents({
            loading: false,
            data: response.data.data,
            pagination: response.data.pagination
          })
        })
        .catch(error => {
          console.log(error.message)
        })
    }
  }, [tags, format, date])
  /*--------------------------------------------------------------------------*/

  /*-----------------------------HANDLE PAGE CHANGE--------------------------------*/
  const handlePageChange = (page) => {
    if(tags.length !== 0 || format !== '' || date !== '') {
      api.post(`/filter/${page}`, {theme: tags, format, event_datetime: date})
      .then(response => {
        console.log(response.data)
        setEvents({
          loading: false,
          data: response.data.data,
          pagination: response.data.pagination
        })
      })
      .catch(error => {
        console.log(error.message)
      })
    } else {
      api.get(`/events/${page}`)
      .then(function(response) {
        setEvents({
          loading: false,
          data: response.data.data,
          pagination: response.data.pagination
        })
      
      })
      .catch(function(error) {
          console.log(error.message)
      })
    }
  }
  /*--------------------------------------------------------------------------------*/

  const handleCreateEvent = () => {
    navigate(`/create-event`)
  }
  
  const handleEventClick = (id) => {
    navigate(`/events/${id}`)
  }

  return (
    <Container>
      <div className="background">
        <img src = {require("../assets/main-back.png")} alt="" />
      </div>
      <div className="slogan">
        <h1>Let's Make Live Happen</h1>
        <br />
        <p>Shop millions of live events and discover can't-miss concerts, games, theater and more.</p>
        <div className="search-event">
          <input value={eventsToSearch} onChange={(e) => setEventsToSearch(e.target.value)} type="search" placeholder='Search for an event'/>
          <button onClick={handleSearchEvents}>Search</button>
        </div>
      </div>
      <div className="options">
        <div className="options-filters">
          <div>
            <select defaultValue="Formats" name="formats" id="formats" onChange={(e) => setFormat(e.target.value)}>
              <option value="concert">Concert</option>
              <option value="meet_up">Meet Up</option>
              <option value="festival">Festival</option>
              <option value="show">Show</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div className="selected-tags">
            <div className="template-block">
              <span>--Select themes--</span>
              <i onClick={toggleOpen} className={`arrow ${isOpen ? 'up' : 'down'}`} />
            </div>
            {isOpen && (
              <div className="options-tags">
                {
                  themes.isLoading ?
                  <div className='loading'>Loading...</div> 
                  :
                  <>
                    {
                      themes.data.map((item, index) => {
                        return (
                          <div key={index} value={item.name} className={`option ${tags.includes(item.name)}`} onClick={handleOptionChange}>#{item.name}</div>
                        )
                      })
                    }
                  </>
                }
              </div>
            )}
          </div>
          <div>
            <input value={date}  type="date" name="" id="" placeholder='Select date' onChange = {(e) => setDate(e.target.value)}/>
          </div>
        </div>
        <button onClick={handleCreateEvent}>+ New Event</button>
      </div>
      {
        events.loading ? 
        <div className='loading'>Loading...</div> 
        : 
        <div className="event-list">
        {
          events.data.map((item, index) => {
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
      }
      {
        events.loading ? 
        <></> 
        : 
        <Pagination className='pagination'
                    activePage={Number(events.pagination.currentPage)}
                    itemsCountPerPage={events.pagination.perPage}
                    totalItemsCount={events.pagination.total}
                    pageRangeDisplayed={5}
                    onChange={handlePageChange} 
        />
      }
    </Container>
  )
}

const Container = styled.div`
  z-index: -1;
  margin-top: -250px;
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

    .background {
      overflow: hidden;
      img {
        width: 100%;
        height: 650px;
        background-size: cover;
        object-fit: cover;
        filter: brightness(50%);
      }
    }

    .slogan {
      white-space: nowrap;
      p {
        white-space: normal;
        margin-bottom: 20px;
      }
      position: absolute;
      line-height: 0.8;
      text-align: center;
      top: 325px;
      left: 50%;
      transform: translate(-50%, -50%);
      .search-event {
        display: inline-block;
        margin-top: 20px;
        input {
          display: inline-block;
          vertical-align: middle;
          color: #fff;
          background: rgba(0,0,0,0.3);
          border: none;

          width: 380px;
          height: 60px;
          padding: 0px 25px;
          font-weight: 400;
          font-size: 16px;

          appearance: none;
          outline: none;

          &::-webkit-search-cancel-button {
            -webkit-appearance: none;
          }
          &::placeholder {
            color: rgba(255, 255, 255, 0.43);
          }
        }
        button {
          display: inline-block;
          vertical-align: middle;
          font-weight: 700;
          font-size: 24px;
          width: 140px;
          height: 60px;
          background-color: #FFD100;
          border: none;
          color: #fff;
          cursor: pointer;
        }
        @media (max-width: 850px) {
          input{
            width: 190px;
            height: 30px;
            font-size: 8px;
            padding: 0px 12px;
          }
          button {
            width: 70px;
            height: 30px;
            font-size: 12px;
          }
        }
      }
    }

    .options {
      max-width: 1480px;
      margin: 0 auto;
      padding-top: 55px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 60px;

      .options-filters {
        width: fit-content;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        div {
          border: 1px solid #fff;
          background: transparent;
          display: inline-block;
          padding: 0px 10px;
          input {
            height: 45px;
            outline: none;
            border: none;
            color: #fff;
            background: rgb(32,32,32);
          }
          select {
            width: 150px;
            height: 45px;
            outline: none;
            background: rgb(32,32,32);
            border: none;
            color: #fff;
            margin: 0;
          }
          &.selected-tags {
            position: relative;
            padding: 10.5px 10px;
            .template-block {
              display: flex;
              justify-content: space-between;
              align-items: center;
              gap: 15px;
              height: 100%;
              border: none;
              .arrow {
                width: 0;
                height: 0;
                border-style: solid;
                border-width: 8px 6px 0 6px;
                border-color: #fff transparent transparent transparent;
                cursor: pointer;
                &.up {
                  transform: rotate(180deg);
                }
              }
            }
            .options-tags {
              position: absolute;
              top: 50px;
              left: 0;
              width: 100%;
              height: 150px;
              overflow-y: scroll;
              scrollbar-width: none;
              background-color: #333533;
              z-index: 1;
              border: none;
              border-radius: 5px;

              display: flex;
              justify-content: flex-start;
              align-items: center;
              flex-wrap: wrap;
              gap: 10px;
              padding: 10px;

              &::-webkit-scrollbar {
                display: none;
              }

              .option {
                border: none;
                width: fit-content;
                color: #000000;
                background-color: #ffffff;
                border-radius: 5px;
                padding: 5px;
                cursor: pointer;
                &.true {
                  background-color: #FFD100;
                  color: #000000;
                }
              }
            }
          }
        }
      }

      button {
        width: 160px;
        height: 45px;
        background-color: #FFD100;
        border: none;
        color: #fff;
        font-weight: 700;
        font-size: 16px;
        cursor: pointer;
      }
    }

    .event-list {
      max-width: 1480px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 10px;
      justify-content: space-between;
      align-items: center;
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
        height: fit-content;
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

  /* Телефоны в портретной ориентации */
  @media only screen and (max-width: 320px) {
    font-size: 12px;
    h1 {
      font-size: 18px;
    }
    .options {
      max-width: 310px;
      flex-wrap: wrap;
      align-items: flex-start;
      row-gap: 10px;
      .options-filters {
        height: fit-content;
        width: fit-content;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        div {
          margin: 0;
        }
      }
      button {
        width: fit-content;
        padding: 5px 20px;
        margin-top: 50px;
      }
    }
    .event-list {
      grid-template-columns: repeat(1, minmax(0, 1fr));
      max-width: 310px;
      font-size: 12px;
      .event {
        div.price {
          button {
            width: 120px;
            height: 35px;
          }
        }
      }
    }
  }

  /* Телефоны в альбомной ориентации */
  @media only screen and (min-width: 321px) and (max-width: 568px) {
    .options {
      max-width: 311px;
      flex-wrap: wrap;
      align-items: flex-start;
      row-gap: 10px;
      .options-filters {
        height: fit-content;
        width: fit-content;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        div {
          margin: 0;
        }
      }
      button {
        width: fit-content;
        padding: 5px 20px;
        margin-top: 50px;
      }
    }

    .event-list {
      grid-template-columns: repeat(1, minmax(0, 1fr));
      max-width: 311px;
      font-size: 12px;
      .event {
        div.price {
          button {
            width: 120px;
            height: 35px;
          }
        }
      }
    }
  }

  /* Планшеты в портретной ориентации */
  @media only screen and (min-width: 569px) and (max-width: 768px) {
    .options {
      max-width: 559px;
      flex-wrap: wrap;
      align-items: flex-start;
      gap: 10px;

      .options-filters {
        height: fit-content;
        width: fit-content;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }
    }
    .event-list {
      grid-template-columns: repeat(1, minmax(0, 1fr));
      max-width: 559px;
    }
  }

  /* Планшеты в альбомной ориентации */
  @media only screen and (min-width: 769px) and (max-width: 1024px) {
    .options {
      max-width: 759px;
    }
    .event-list {
      max-width: 759px;
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }
  }

  @media only screen and (min-width: 1025px) and (max-width: 1440px) {
    .options {
      max-width: 1015px;
    }
    .event-list {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      max-width: 1015px;
    }
  }
`
