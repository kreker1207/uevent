import React from "react";

import { useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";

export default function ProtectedRoute () {
    const {userInfo} = useSelector((state) => state.auth)

    if(Object.keys(userInfo).length === 0) {
        return (
            <div className='unauthorized'>
                <h1>Unauthorized :&#40;</h1>
                <span>
                    <NavLink to='/login'>Login</NavLink> to gain access
                </span>
            </div>
        )
    }

    return <Outlet />
}
