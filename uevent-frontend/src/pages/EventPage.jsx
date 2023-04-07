import React, { useState, useRef } from 'react'
import styled from 'styled-components'

import { IconContext } from 'react-icons';
import { FaClock, FaMapMarkerAlt, FaReply, FaUser } from "react-icons/fa";

export default function EventPage() {
  const inputRef = useRef(null);
  // const [selectedPlace, setSelectedPlace] = useState({lat: 0, lng: 0});
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState({
    id: 1,
    title: "Event Name",
    price: 430,
    location: "вулиця Пушкінська, 79/1, Харків, Харківська область, Украина, 61000",
    organization: "Agency",
    event_datetime: "15.03.2023 15:30",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis quis, veritatis esse dolores asperiores fugit necessitatibus doloremque. Totam voluptates a sunt architecto nostrum reprehenderit temporibus, similique, hic cupiditate maiores ratione?"
  })


  function replacePlusesWithSpaces(str) {
    return str.replace(/\+/g, ' ');
  }


  const [comments, setComments] = useState([
    {
      id: 1,
      username: "Roman Lytvynov",
      date: "20.03.2023",
      content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed soluta magnam dolorem blanditiis quam voluptatum fugit aut non nesciunt dolores rem repudiandae delectus eos consequuntur repellat quo, ad provident ab?",
      commentsInside: []
    },
    {
      id: 2,
      username: "Roman Lytvynov",
      date: "20.03.2023",
      content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed soluta magnam dolorem blanditiis quam voluptatum fugit aut non nesciunt dolores rem repudiandae delectus eos consequuntur repellat quo, ad provident ab?",
      commentsInside: [
        {
          senderName: "Polkovnik Piotkovski",
          receiverName: "Roman Lytvynov",
          date: "20.03.2023",
          content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed soluta magnam dolorem blanditiis quam voluptatum fugit aut non nesciunt dolores rem repudiandae delectus eos consequuntur repellat quo, ad provident ab?",
        },
        {
          senderName: "Roman Lytvynov",
          receiverName: "Polkovnik Piotkovski",
          date: "20.03.2023",
          content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed soluta magnam dolorem blanditiis quam voluptatum fugit aut non nesciunt dolores rem repudiandae delectus eos consequuntur repellat quo, ad provident ab?",
        }
      ]
    },
    {
      username: "Roman Lytvynov",
      date: "20.03.2023",
      content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed soluta magnam dolorem blanditiis quam voluptatum fugit aut non nesciunt dolores rem repudiandae delectus eos consequuntur repellat quo, ad provident ab?",
      commentsInside: []
    }
  ])

  const [receiverName, setReceiverName] = useState('')

  //comment to event
  
  //comment to comment

  // const handleMapCoordinates = (selectedPlace) => {
  //   setSelectedPlace(selectedPlace);
  // };

  const handleCommentFocus = (receiverName) => {
    if (inputRef.current) {
      inputRef.current.focus();
      const textarea = document.getElementById("textarea")
      textarea.placeholder = `Reply to ${receiverName}`
    }
  };

  const handleCommentSend = () => {

  }

  return (
    <Container>
      <div className="description-block">
        <div className="event-image">
          <img src = {require("../assets/ev_img.jpg")} alt="" />
        </div>
        <div className="description">
          <h2>{event.title}</h2>
          <IconContext.Provider value={{ style: { verticalAlign: 'middle', marginRight: "5px" } }}>
            <p>
              <FaMapMarkerAlt/>{event.location}
            </p>
          </IconContext.Provider>
          <IconContext.Provider value={{ style: { verticalAlign: 'middle', marginRight: "5px" } }}>
            <p>
              <FaClock/>{event.event_datetime}
            </p>
          </IconContext.Provider>
          <IconContext.Provider value={{ style: { verticalAlign: 'middle', marginRight: "5px" } }}>
            <p>
              <FaUser/>{event.organization}
            </p>
          </IconContext.Provider>
          <div className="info">
            <h3>Description</h3>
            <p>{event.description}</p>
          </div> 
          <div className="price-block">
            <button>Buy</button>
            <div className="price">430$</div>
          </div> 
        </div>
      </div>
      <div className="comments-block">
        <div className="comments">
          <h2>Comments</h2>
          <div className="comments-inner">
            {
              loading ? 
              <div className="loading">Loading...</div>
              :
              comments.map((item ,index) => {
                return (
                  <div key={index} className="comment">
                    <div className="userinfo">
                        <div className="photo">
                          <div><img src={require("../assets/company.jpg")} alt="userlogo" /></div>
                          <div className="name">
                            <h4>{item.username}</h4>
                            <p>{item.date}</p>
                          </div>
                        </div>
                        <IconContext.Provider value={{ style: { verticalAlign: 'middle', marginRight: "5px", cursor: "pointer" } }}>
                          <div className="arrow">
                            <FaReply onClick={() => handleCommentFocus(item.username)}/>
                          </div>
                        </IconContext.Provider>
                    </div>
                    <div className="comment-text">
                      {item.content}
                    </div>
                    <div className="replies">
                      {
                        item.commentsInside.map((item ,index) => {
                          return (
                            <div key={index} className="comment">
                              <div className="userinfo">
                                  <div className="photo">
                                    <div><img src={require("../assets/company.jpg")} alt="userlogo" /></div>
                                    <div className="name">
                                      <h4>{item.senderName} <i style={{color: "#868686", fontSize: "12px"}}>replied to {item.receiverName}</i></h4>
                                      <p>{item.date}</p>
                                    </div>
                                  </div>
                                  <IconContext.Provider value={{ style: { verticalAlign: 'middle', marginRight: "5px", cursor: "pointer" } }}>
                                    <div className="arrow">
                                      <FaReply onClick={() => handleCommentFocus(item.senderName)}/>
                                    </div>
                                  </IconContext.Provider>
                              </div>
                              <div className="comment-text">
                                {item.content}
                              </div>
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                )
              })
            }
            <div className="textarea">
                <textarea id="textarea" ref={inputRef} placeholder="Type comment here..."></textarea>
                <button onClick={handleCommentSend} type="submit">Send</button>
            </div>
          </div>
        </div>
        <div className="map">
          <iframe
            title='map'
            width="600"
            height="450"
            style={{border: "0"}}
            loading="lazy"
            allowFullScreen=""
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDuHV2o8j_nfA8XMUC-15fN9vlDB9htW30
            &q=${event.location}`}>
          </iframe>
          {/* <Map onChildStateChange={handleMapCoordinates}/> */}
        </div>
      </div>
    </Container>
  )
}

const Container = styled.div`
    max-width: 1480px;
    margin: 0 auto;
    padding: 0px 20px;
    .description-block {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
      margin-bottom: 75px;
      img {
        display: block;
        width: 720px;
        height: 520px;
        object-fit: cover;
      }
      .info {
        margin-bottom: 60px;
        h3 {
          margin-bottom: 0;
        }
      }
      .price-block {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 20px;
        button {
          cursor: pointer;
          width: 188px;
          height: 55px;
          background: #FFD100;
          border: none;
          color: #fff;
        }
      }
    }
    .comments-block {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
      .comments {
        h2 {
          margin-bottom: 40px;
        }
        .comments-inner {

          .textarea {
            position: relative;
            height: 200px;
            textarea {
              width: 100%;
              height: 100%;
              padding: 10px;
              border: none;
              resize: none; /* отключаем возможность изменения размеров */
              outline: none;
            }
            button {
              position: absolute;
              right: 0;
              top: 0;
              height: 100%;
              width: 100px;

              background: #FFD100;
              border: none;
              color: white;
              font-weight: 700;
              padding: 0;
              cursor: pointer;
            }
          }
        }
        .comment {
          margin-bottom: 30px;
          .replies {
            width: 90%;
            margin-left: 10%;
            margin-top: 25px;
            .comment {
              position: relative;
              padding-left: 15px;
              &::before {
                content: "";
                position: absolute;
                left: 0;
                top: 0;
                width: 2px;
                height: 100%;
                background: rgba(255, 255, 255, 0.29);
              }
            }
          }
          .userinfo {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .photo {
              display: flex;
              justify-content: flex-start;
              align-items: flex-start;
              gap: 15px;
              img {
                width: 50px;
                height: 50px;
                border-radius: 50%;
              }
              h4 {
                margin: 0;
              }
              p {
                font-weight: 400;
                font-size: 15px;
                color: #868686;
              }
            }
          }
          .comment-text {
            position: relative;
            &::after {
              content: "";
              position: absolute;
              left: 0;
              bottom: -15px;
              width: 100%;
              height: 1px;
              background: rgba(75, 75, 75, 0.4);
            }
          }
        }
      }
      .map{
        
      }
    }
`
