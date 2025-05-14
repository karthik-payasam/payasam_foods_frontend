import React, { useEffect, useState } from 'react'
import queryString from 'query-string';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import apiList from '../../../Api/Api_Calls'
function OtpUi(props) {
    const { setLogin } = useAuthContext();
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    // console.log(window.location.search);
    // console.log(queryString.parse(window.location.search));
    const parsed = queryString.parse(window.location.search);
    const encreyEmail = parsed.email
    // console.log("email", encreyEmail)
    // console.log("decode", window.atob(encreyEmail))
    const email = window.atob(encreyEmail)
    const [otpData, setOtpData] = useState("")
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg("");

        if (!otpData.trim()) {
            setError("Please enter the OTP before submitting.");
            return;
        }
        try {
            const response = await axios.post(apiList.otp, {
                email,
                otp: otpData
            });

            if (response.data.userDetails.length > 0) {
                alert("OTP Verified Successfully!");
                localStorage.setItem("ProfileData", (response.data.token));

                navigate("/");

            }

        } catch (err) {
            setError("invalid OTP")
        }
    }
    const handleResendOtp = async (email) => {
        try {
            const response = await axios.put(apiList.resendOtp, {
                email,
            });
            console.log("updated data Details...", response.data);
            setSuccessMsg("OTP has been resent to your email.");

        } catch (err) {
            setError("Failed to resend OTP. Please check your email.");
        }
    }

    return (
        <div className='container d-flex justify-content-center align-items-center min-vh-100'>
            <div className='border p-4 rounded shadow-md'>
                <h4 className="mb-2 text-center">Verify Your Details</h4>
                <p className='text-center mb-1'>An OTP has been sent to your registered mobile number and email
                </p>
                <p className='text-center fw-bold mb-3'>{email}</p>
                <form onSubmit={handleSubmit}>
                    <div className='input-group mb-3'>
                        <input type='text' name="otp" value={otpData} className='form-control border-dark' placeholder='Enter OTP' onChange={(e) => setOtpData(e.target.value)} />
                        <button className='btn border-dark text-primary' onClick={() => { handleResendOtp(email) }}>Resend OTP</button>
                    </div>
                    {error && <div className="alert alert-danger py-2">{error}</div>}
                    {successMsg && <div className="alert alert-success py-2">{successMsg}</div>}

                    <div className='d-grid'>
                        <button className='btn btn-dark text-center '>Submit</button>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default OtpUi