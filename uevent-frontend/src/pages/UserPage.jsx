import React from 'react'
import { useSelector } from 'react-redux'

export default function UserPage() {
  const { userInfo } = useSelector((state) => state.auth)
  return (
    <div>
      Welcome <strong>{userInfo?.firstName}</strong> !
    </div>
  )
}
