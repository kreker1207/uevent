import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

export default function UserPage() {
  const { userInfo } = useSelector((state) => state.auth)
  console.log(userInfo)
  return (
    <Container>
      <div>
        <img src = {`http://localhost:8080/profile_pics/${userInfo.profile_pic}`} alt="" />
      </div>
      Welcome <strong>{userInfo?.login}</strong> !
    </Container>
  )
}

const Container = styled.div`
    max-width: 1480px;
    margin: 0 auto;
    padding: 0px 20px;
`
