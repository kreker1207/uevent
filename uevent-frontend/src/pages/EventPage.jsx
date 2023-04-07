import React, { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import styled from 'styled-components'

import { IconContext } from 'react-icons';
import { FaClock, FaMapMarkerAlt, FaReply, FaUser } from "react-icons/fa";
import api from '../utils/apiSetting';

export default function EventPage() {
  const inputRef = useRef(null);
  const { id } = useParams();

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

  // function replacePlusesWithSpaces(str) {
  //   return str.replace(/\+/g, ' ');
  // }

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

  const [users, setUsers] = useState([])

  const [receiverName, setReceiverName] = useState('')
  const [receiverCommentId, setReceiverCommentId] = useState(-1)
  const [description, setDescription] = useState('')

  useEffect(() => {
    api.get(`/event/${id}`)
      .then(function (response) {
        console.log(response.data)
        setEvent(response.data)
      })
      .catch(function(error) {
        console.log(error.message)
      })
  }, [id])

  useEffect(() => {
    api.get(`/comments/event/${id}`)
      .then(function (response) {
        console.log(response.data)
        setComments(response.data)
        setLoading(false)
      })
      .catch(function(error) {
        console.log(error.message)
      })
  }, [id])



  useEffect(() => {
    const newCommentsPromisses = comments.map((item) => {
      return api.get(`/users/${item.author_id}`)
    })

    Promise.all(newCommentsPromisses)
      .then(responses => {
        const updatedComments = responses.map((response, index) => {
          // обновляем объект, используя данные из ответа
          const data = response.data;
          return {
            ...comments[index],
            login: data.login,
            profile_pic: data.profile_pic,
          };
        });
        setComments(updatedComments);
      })
      .catch(error => {
        console.error(error);
      });
  }, [comments])



  useEffect(() => {
    const newCommentsPromisses = comments.map((item) => {
      const subItems = item.commentsInside.map(itemInside => {
        return api.get(`/users/${itemInside.author_id}`)
      })
      return subItems
    })

    Promise.all(newCommentsPromisses)
      .then(responses => {
        const updatedComments = responses.map((response, index) => {

          const data = response.data;

          const updatedSubComments = comments[index].commentsInside.map(item => {
            return {
              ...item,
              username: data.login,
              profile_pic: data.profile_pic,
            }
          })
          return {
            ...comments,
            commentsInside: updatedSubComments
          }
        });
        setComments(updatedComments);
      })
      .catch(error => {
        console.error(error);
      });
  }, [comments])

  const handleCommentFocus = (receiverName, receiverCommentId) => {
    if (inputRef.current) {
      inputRef.current.focus();
      const textarea = document.getElementById("textarea")
      textarea.placeholder = `Reply to ${receiverName}`

      setReceiverName(receiverName)
      setReceiverCommentId(receiverCommentId)
    }
  };

  const handleCommentSend = () => {
    if(receiverName!=='' && receiverCommentId !== -1) {
      api.post(`api/comments/event/${event.id}/reply/${receiverCommentId}`, {content: description})
        .then(function(response) {
            console.log(response.data)
          })
          .catch(function(error) {
            console.log(error.message)
          })
    } else {
      api.post(`api/comments/event/${event.id}`)
        .then(function(response) {
          console.log(response.data)
        })
        .catch(function(error) {
          console.log(error.message)
        })
    }
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
              comments.map((item, index) => {
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
                            <FaReply onClick={() => handleCommentFocus(item.username, item.id)}/>
                          </div>
                        </IconContext.Provider>
                    </div>
                    <div className="comment-text">
                      {item.content}
                    </div>
                    <div className="replies">
                      {
                        item.commentsInside.map((itemInner, index) => {
                          return (
                            <div key={index} className="comment">
                              <div className="userinfo">
                                  <div className="photo">
                                    <div><img src={require("../assets/company.jpg")} alt="userlogo" /></div>
                                    <div className="name">
                                      <h4>{itemInner.login} <i style={{color: "#868686", fontSize: "12px"}}>replied to {itemInner.receiverName}</i></h4>
                                      <p>{itemInner.date}</p>
                                    </div>
                                  </div>
                                  <IconContext.Provider value={{ style: { verticalAlign: 'middle', marginRight: "5px", cursor: "pointer" } }}>
                                    <div className="arrow">
                                      <FaReply onClick={() => handleCommentFocus(itemInner.login, item.id)}/>
                                    </div>
                                  </IconContext.Provider>
                              </div>
                              <div className="comment-text">
                                {itemInner.content}
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
                <textarea value={description} id="textarea" ref={inputRef} placeholder="Type comment here..." onChange={(e)=>setDescription(e.target.value)}></textarea>
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



    // comments.map((item) => {
    //     api.get(`/users/${item.author_id}`)
    //     .then(function (response) {

    //       console.log(response.data)
    //       const newItem = {
    //         type: 'outside',
    //         login: response.data.login,
    //         profile_pic: response.data.prifole_pic
    //       }
    //       item.username = response.data.login
    //       item.

    //       item.commentsInside.map((itemInside) => {
    //         api.get(`/comments/${itemInside.comment_id}`)
    //           .then(function (response) {
    //             api.get(`/users/${response.data.author_id}`)
    //               .then(function (response) {
    //                 console.log(response.data)
    //                 const newItem = {
    //                   type: 'inside',
    //                   login: response.data.login,
    //                   profile_pic: response.data.prifole_pic
    //                 }
    //               })
    //               .catch(function(error) {
    //                 console.log(error.message)
    //               })
    //           })
    //           .catch(function(error) {
    //             console.log(error.message)
    //           })
    //       })
    //     })
    //     .catch(function(error) {
    //       console.log(error.message)
    //     })
    // })