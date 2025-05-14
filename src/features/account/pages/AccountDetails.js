import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../auth/context/AuthContext';

function AccountDetails() {

    const [error, setError] = useState(null);
    const navigate = useNavigate()
    const { setLogin, userData, } = useAuthContext();

    const removeTokenData = () => {
        localStorage.removeItem("ProfileData");
        setLogin(false);
        navigate("/")
    }
    return (
        <>
            <div className='ms-5'>
                <h2 className='text-center'>MY ACCOUNT</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}



                <div>
                    <p><strong>Name:</strong> {userData?.first_name} {userData?.last_name}</p>
                    <p><strong>Email:</strong> {userData?.email}</p>
                    <p><strong>Phone:</strong> {userData?.phone_number}</p>


                </div>

                <button onClick={removeTokenData}>LogOut</button>
                <button onClick={() => { navigate("/") }} className='m-3'>Return to Store</button>
            </div>
        </>
    )
}

export default AccountDetails