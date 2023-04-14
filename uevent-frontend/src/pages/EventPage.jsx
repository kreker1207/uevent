import React, { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import styled from 'styled-components'

import { IconContext } from 'react-icons';
import { FaClock, FaMapMarkerAlt, FaReply, FaUser } from "react-icons/fa";
import api from '../utils/apiSetting';

export default function EventPage() {
  const inputRef = useRef(null);
  const { id } = useParams();

  const [event, setEvent] = useState({data: [], isLoading: true})
  const [comments, setComments] = useState({data: [], isLoading: true})
  const [commentsChanged, setCommentsChanged] = useState(0)



  const [receiverName, setReceiverName] = useState('')
  const [receiverMaintId, setMainCommentId] = useState(-1)
  const [receiverCommentId, setReceiverCommentId] = useState(-1)
  const [description, setDescription] = useState('')
  const [buyData, setBuyData] = useState({data: '', signature: '', isLoading: true});

  


  useEffect(() => {
    api.get(`/event/${id}`)
      .then(function (response) {
        // getOrganizationByID !!!!
        console.log(response.data)
        setEvent({
          data: response.data,
          isLoading: false
        })
      })
      .catch(function(error) {
        console.log(error.message)
      })
  }, [id])

  useEffect(() => {
    // Make API request to get the comments
    api.get(`/comments/event/${id}`)
      .then(response => {
        const commentsData = response.data;

        // Create an array of promises to get the additional fields for each comment object and its nestedArray
        const commentPromises = commentsData.map(comment => {
          const authorPromise = api.get(`/users/${comment.author_id}`);
          const nestedArrayPromises = comment.replies.map(nested => api.get(`/users/${nested.author_id}`));

          return Promise.all([authorPromise, ...nestedArrayPromises]).then(responses => {
            const [authorResponse, ...nestedResponses] = responses;
            const authorData = authorResponse.data;
            const nestedData = nestedResponses.map(response => response.data);

            // Return the updated comment object with the additional fields
            return {
              ...comment,
              login: authorData.login,
              profile_pic: authorData.profile_pic,
              replies: comment.replies.map((nested, index) => ({
                ...nested,
                login: nestedData[index].login,
                profile_pic: nestedData[index].profile_pic,
              })),
            };
          });
        });

        // Wait for all the commentPromises to resolve and update the state with the updated comments
        Promise.all(commentPromises)
          .then(updatedComments => {
            setComments({
              data: updatedComments,
              isLoading: false
            });
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        console.error(error);
      });
  }, [id]);

  useEffect(() => {
    // Make API request to get the comments
    api.get(`/comments/event/${id}`)
      .then(response => {
        const commentsData = response.data;

        // Create an array of promises to get the additional fields for each comment object and its nestedArray
        const commentPromises = commentsData.map(comment => {
          const authorPromise = api.get(`/users/${comment.author_id}`);
          const nestedArrayPromises = comment.replies.map(nested => api.get(`/users/${nested.author_id}`));

          return Promise.all([authorPromise, ...nestedArrayPromises]).then(responses => {
            const [authorResponse, ...nestedResponses] = responses;
            const authorData = authorResponse.data;
            const nestedData = nestedResponses.map(response => response.data);

            // Return the updated comment object with the additional fields
            return {
              ...comment,
              login: authorData.login,
              profile_pic: authorData.profile_pic,
              replies: comment.replies.map((nested, index) => ({
                ...nested,
                login: nestedData[index].login,
                profile_pic: nestedData[index].profile_pic,
              })),
            };
          });
        });

        // Wait for all the commentPromises to resolve and update the state with the updated comments
        Promise.all(commentPromises)
          .then(updatedComments => {
            setComments({
              data: updatedComments,
              isLoading: false
            });
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        console.error(error);
      });
  }, [commentsChanged]);


  const handleCommentFocus = (receiverName, receiverMaintId, receiverCommentId) => {
    if (inputRef.current) {
      inputRef.current.focus();
      const textarea = document.getElementById("textarea")
      textarea.placeholder = `Reply to ${receiverName}`

      setReceiverName(receiverName)
      setMainCommentId(receiverMaintId)
      setReceiverCommentId(receiverCommentId)
    }
  };



  const handleCommentSend = () => {
    if(receiverName!=='' && receiverCommentId !== -1) {
      console.log(receiverCommentId)
      api.post(`/comments/event/${event.data.id}/reply/${receiverMaintId}`, {content: description, comment_id: receiverCommentId, receiver_name: receiverName})
        .then(function(response) {
            console.log(response.data)
            setCommentsChanged(commentsChanged + 1)
          })
          .catch(function(error) {
            console.log(error.message)
          })
    } else {
      api.post(`/comments/event/${event.data.id}`, {content: description, receiver_name: receiverName})
        .then(function(response) {
          console.log(response.data)
          console.log(event)
          setCommentsChanged(commentsChanged + 1)
        })
        .catch(function(error) {
          console.log(error.message)
        })
    }

  }

  useEffect(() => {
    if (!buyData.isLoading) {
      const form = document.getElementById('liqPayId')
      form.submit();
    }
  }, [buyData]);

  const buyClick = (e)=> {
    try {
      e.preventDefault()
      api.post('/buy', {event_id: event.data.id})
        .then(response => {
          console.log(response.data)
          setBuyData({
            data: response.data.data,
            signature: response.data.signature,
            isLoading: false
          })
        })
        .catch ((error) => {
          console.warn(error.response.data.message)
        })
    } catch (error) {
      console.log(error)
    }
    
  }

  return (
    <Container>
      {
        event.isLoading ? 
        <div className="loading">Loading...</div>
        :
        <div className="event-image">
          <img src = {`http://localhost:8080/event_pics/${event.data.eve_pic}`} alt="" />
        </div>
      }
      {
        event.isLoading ? 
        <div className="loading">Loading...</div>
        :
        <div className="description-block">
          <div className="description">
            <h2>{event.data.title}</h2>
            <IconContext.Provider value={{ style: { verticalAlign: 'middle', marginRight: "5px" } }}>
              <p>
                <FaMapMarkerAlt/>{event.data.location}
              </p>
            </IconContext.Provider>
            <IconContext.Provider value={{ style: { verticalAlign: 'middle', marginRight: "5px" } }}>
              <p>
                <FaClock/>{event.data.event_datetime}
              </p>
            </IconContext.Provider>
            <IconContext.Provider value={{ style: { verticalAlign: 'middle', marginRight: "5px" } }}>
              <p>
                <FaUser/>{event.data.org_name}
              </p>
            </IconContext.Provider>
            <div className="info">
              <h3>Description</h3>
              <p>{event.data.description}</p>
            </div> 
            <div className="price-block">
              <form id="liqPayId" method="POST" action="https://www.liqpay.ua/api/3/checkout" acceptCharset="utf-8">
                <input type="hidden" name="data" value={buyData.data}/>
                <input type="hidden" name="signature" value={buyData.signature}/>
                <button onClick={buyClick}>Buy</button>
              </form>
              <div className="price">430$</div>
            </div> 
          </div>
        </div>
      }
      {
        event.isLoading && comments.isLoading ? 
        <div className="loading">Loading...</div>
        :
        <div className="comments-block">
          <h2>Comments</h2>
          <div className="comments-inner">
            {
              comments.data.map((item, index) => {
                return (
                  <div key={index} className="comment">
                    <div className="userinfo">
                        <div className="photo">
                          <div><img src={`http://localhost:8080/profile_pics/${item.profile_pic}`} alt="userlogo" /></div>
                          <div className="name">
                            <h4>{item.login}</h4>
                            <p>{item.created_at}</p>
                          </div>
                        </div>
                        <IconContext.Provider value={{ style: { verticalAlign: 'middle', marginRight: "5px", cursor: "pointer" } }}>
                          <div className="arrow">
                            <FaReply onClick={() => handleCommentFocus(item.login, item.id, item.id)}/>
                          </div>
                        </IconContext.Provider>
                    </div>
                    <div className="comment-text">
                      {item.content}
                    </div>
                    <div className="replies">
                      {
                        item.replies.map((itemInner, index) => {
                          return (
                            <div style={{marginBottom: "25px"}} key={index} className="comment">
                              <div className="userinfo">
                                  <div className="photo">
                                    <div><img src = {`http://localhost:8080/profile_pics/${itemInner.profile_pic}`} alt="" /></div>
                                    <div className="name">
                                      <h4>{itemInner.login} <i style={{color: "#868686", fontSize: "12px"}}>replied to {itemInner.receiver_name}</i></h4>
                                      <p>{itemInner.created_at}</p>
                                    </div>
                                  </div>
                                  <IconContext.Provider value={{ style: { verticalAlign: 'middle', marginRight: "5px", cursor: "pointer" } }}>
                                    <div className="arrow">
                                      <FaReply onClick={() => handleCommentFocus(itemInner.login, item.id, itemInner.id)}/>
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
          </div>
          <div className="textarea">
             <textarea value={description} id="textarea" ref={inputRef} placeholder="Type comment here..." onChange={(e)=>setDescription(e.target.value)}></textarea>
            <button onClick={handleCommentSend} type="submit">Send</button>
          </div>
        </div>
      }
      {
        event.isLoading ? 
        <div className="loading">Loading...</div>
        :
        <div className="map">
          <iframe
            title='map'
            loading="lazy"
            allowFullScreen=""
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDuHV2o8j_nfA8XMUC-15fN9vlDB9htW30
            &q=${event.data.location}`}>
          </iframe>
        </div>
      }

    </Container>
  )
}

const Container = styled.div`
    max-width: 1480px;
    margin: 0 auto;
    padding: 0px 20px;

    display: grid;
    gap: 50px;
    grid-template-columns: 1fr 1fr;

    .event-image {
      position: relative;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }



    
    .description-block {
      position: relative;
      .description {
        width: 100%;
        height: 100%;
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
    }


    .comments-block {
      position: relative;
      width: 100%;
      height: 100%;

      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;

      h2 {
        margin-bottom: 20px;
      }

      .comments-inner {
        width: 100%;
        height: 100%;
        margin-bottom: 40px;

        .comment {
          width: 100%;
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

      .textarea {
        position: relative;
        width: 100%;
        height: 100%;
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

    .map{
      position: relative;
      width: 100%;
      height: 75%;
      iframe {
        position: absolute;
        border: none;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
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