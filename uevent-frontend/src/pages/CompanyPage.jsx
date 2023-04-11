import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom';
import api from '../utils/apiSetting';
import { IconContext } from 'react-icons';
import { FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

export default function CompanyPage() {
    const { id } = useParams();
    const [organization, setOrganization] = useState({data: {}, isLoading: true})

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
                        <p>{organization.data.description}</p>
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
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit illo sint pariatur, ad ratione unde autem architecto, quidem, nihil accusantium aliquam? At sequi perferendis fugiat tempore natus incidunt repudiandae vitae.
                        Nostrum voluptas deleniti possimus obcaecati labore omnis, consequatur a alias totam! Doloribus fuga rem, ipsum accusamus laborum, ipsa natus eaque nemo quidem et totam tempora, porro ducimus! Distinctio, aliquid consequatur!
                        Illum provident, molestiae alias repellendus esse vitae omnis deleniti quas nostrum sunt delectus ducimus, aliquid illo quaerat assumenda numquam sed similique eum dignissimos facilis deserunt nihil natus? Illum, ipsum deserunt.
                        Explicabo vel eveniet ratione enim, necessitatibus natus nemo et reprehenderit distinctio quidem dolores soluta earum eligendi praesentium ipsa. Porro aut ut obcaecati assumenda quibusdam dolorem numquam sint, beatae dolorum incidunt.
                        Id, laborum iusto placeat quidem cum qui quasi et minima nesciunt architecto numquam libero dignissimos saepe error optio rem. Tenetur obcaecati minima velit, magnam accusantium corporis voluptatibus in fugiat illum.
                        Quis magnam ea aliquid voluptates sit voluptatem placeat minima porro sequi praesentium! Quos eius ad autem cumque? Debitis eaque magnam quidem quam, iste, nemo earum, repellat dicta amet esse asperiores!
                        Exercitationem labore amet voluptate, tenetur dolore tempore consequatur eos asperiores aspernatur ipsa at animi? Voluptatem voluptatum, ab facilis et praesentium cupiditate, ipsum non nobis suscipit saepe perspiciatis quidem, nisi neque?
                        Sequi et harum, at accusantium nobis porro obcaecati magni sapiente fuga earum autem dolores dolor facilis, error totam assumenda. Totam, natus reiciendis commodi suscipit atque dolore placeat et quod sunt!
                        Iure iusto ab atque soluta suscipit omnis. Rem aut debitis omnis totam, ab corrupti consequuntur dignissimos voluptates rerum laudantium hic consectetur sequi laborum sed placeat deleniti? Animi consequuntur ullam voluptas!
                        Quia, molestiae assumenda. Nesciunt incidunt autem aperiam ex sapiente id harum officia impedit repellat consectetur. At, placeat? Saepe culpa vitae vero, enim libero amet voluptates odit tempora mollitia iure quasi?
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
            grid-column: 1 / span 1;
            grid-row: 1 / span 1;
            position: relative;
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
        .organization-info {
            grid-column: 2 / span 1;
            grid-row: 1 / span 1;
            position: relative;
            .organization-contacts {
                h3 {
                    margin-top: 0;
                }
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: fit-content;
                padding: 35px;
                background: #333533;
            }
        }
        .organization-events {
            grid-column: 1 / span 2;
            grid-row: 2 / span 1;
        }
    }
`