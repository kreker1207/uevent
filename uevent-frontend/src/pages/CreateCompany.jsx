import React, { useEffect, useState } from 'react'
import { IconContext } from 'react-icons';
import { FaEnvelope, FaPhone } from 'react-icons/fa';
import styled from 'styled-components'
import DragAndDropImage from '../components/DragImage'
import Map from '../components/Map'
import api from '../utils/apiSetting';
import { useSelector } from 'react-redux';

export default function CreateCompany() {
    const [placeName, setPlaceName] = useState("Location");
    const { userInfo } = useSelector((state) => state.auth)
    const [phoneNumber, setPhoneNumber] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [userEmail, setUserEmail] = useState('')
    const handleMapCoordinates = (placeName) => {
        setPlaceName(placeName);
    };

    const handlePublish = () => {
        const data = {
            title ,
            description,
            location: placeName,
            phoneNumber,
            admin_id: 1
        }
        console.log(data)
    }

    useEffect(() => {
        if(userInfo && userInfo.id) {
            api.get(`/users/${userInfo.id}`)
                .then(response => {
                    console.log(response.data)
                    setUserEmail(response.data.email)
                })
                .catch(error => {
                    console.log(error.message)
                })
        }
    }, [userInfo])

    return (
        <Component>
            <h2>Create company</h2>
            <div className="content">
                <div className='photo-outer'>
                    <div className="photo-inner">
                        <DragAndDropImage/>
                    </div>
                </div>
                <div className="description">
                    <input value={title} type="text" name="logo" id="logo-input" placeholder='Company name' onChange={(e)=>setTitle(e.target.value)} />
                    <div className='description-info'>
                        <textarea value={description} placeholder="Type description here..." onChange={(e)=>setDescription(e.target.value)}></textarea>
                        <div className="map">
                            <Map onChildStateChange={handleMapCoordinates}/>
                            <div className="email-phone">
                                <IconContext.Provider value={{ style: { verticalAlign: 'middle', width: '5%'} }}>
                                    <div className="email-inside">
                                        <FaEnvelope/> <input value={userEmail} type="text" name="email" id="email" readOnly/>
                                    </div>
                                </IconContext.Provider>
                                <IconContext.Provider value={{ style: { verticalAlign: 'middle', width: '5%' } }}>
                                    <div className="email-inside">
                                        <FaPhone/> <input value={phoneNumber} type="text" name="phone" id="phone" placeholder='Phone number'  onChange={(e)=>setPhoneNumber(e.target.value)}/>
                                    </div>
                                </IconContext.Provider>
                                <button onClick={handlePublish}>Publish</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Component>
    )
}

const Component = styled.div`
    max-width: 1480px;
    margin: 0 auto;
    padding: 0px 20px;

    h2 {
        margin-bottom: 60px;
    }

    .content {
        display: flex;
        justify-content: space-between;
        align-items: stretch;

        .photo-outer {
            width: 20%;
            .photo-inner {
                width: 100%;
                height: 300px;
                border-radius: 50%;
                overflow: hidden;
            }
        }
        .description {
            width: 70%;
            &>* {
                margin-bottom: 30px;
            }
            #logo-input {
                width: 100%;
                font-size: 36px;
                border: none;
                border-bottom: 2px solid #FFFFFF;
                background: transparent;
                margin-bottom: 25px;
                outline: none;
                color: #FFFFFF;
            }
            textarea {
                width: 100%;
                padding: 10px;
                border: 1px solid #fff;
                color: #fff;
                background: transparent;
                resize: none; /* отключаем возможность изменения размеров */
                outline: none;
            }
            .description-info {
                display: flex;
                justify-content: space-between;
                align-items: stretch;
                &>*{
                    width: 49%;
                }
                .email-inside {
                    width: 100%;
                    border: 1px solid #fff;
                    background: transparent;
                    padding: 5px 10px;
                    margin-top: 10px;
                    display: flex;
                    align-items: center;
                    input {
                        padding: 5px 20px;
                        color: #fff;
                        outline: none;
                        border: none;
                        background: transparent;
                        width: 95%;
                        box-sizing: border-box;
                    }
                }
                button {
                    width: 100%;
                    height: 40px;
                    background-color: #FFD100;
                    border: none;
                    color: #fff;
                    margin-top: 10px;
                }
            }
        }
    }

`
