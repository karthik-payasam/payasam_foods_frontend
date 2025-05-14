import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../auth/context/AuthContext'

function AccountData() {
    const { login, setLogin, setRole } = useAuthContext()
    const navigate = useNavigate()
    console.log({ login })

    useEffect(() => {
        if (!localStorage.getItem('ProfileData')) {//if data is there then go to the if condition inside.
            navigate('/login')
        }
    }, [])

    return (
        <div>AccountData
            <Outlet />
        </div>
    )
}

export default AccountData