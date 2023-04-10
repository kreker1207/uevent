import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom';
import api from '../utils/apiSetting';

export default function CompanyPage() {
    const { id } = useParams();
    const [organization, setOrganization] = useState({data: {}, isLoading: true})
    useEffect(() => {
        api.get(`/org/${id}`)
            .then(function (response) {
                // getOrganizationByID !!!!
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
                <img src={`http://localhost:8080/organization_pics/${organization.data.org_pic}`} alt="" />
            }
        </Container>
    )
}

const Container = styled.div`
    max-width: 1480px;
    margin: 0 auto;
    padding: 0px 20px;
`