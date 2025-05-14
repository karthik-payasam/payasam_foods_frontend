import React, { useState } from 'react'
import registrationImage from '../../../assets/images/reg.jpeg'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useAuthContext } from '../context/AuthContext';
import { validation } from '../validation/validation';
import apiList from '../../../Api/Api_Calls'
function SignUp() {
    const [formData, setFormData] = useState({ first_name: "", last_name: "", phone_number: "", email: "", password: "", confirmPassword: "" })
    const [error, setError] = useState(null);
    const [validationError, setValidationError] = useState({});
    const { setLogin } = useAuthContext();
    const navigate = useNavigate()
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validation(formData)
        if (Object.keys(validationErrors).length > 0) {
            setValidationError(validationErrors);
            return;
        }
        try {
            const response = await axios.post(apiList.registration, formData)
            console.log(response.data.token)
            if (response.status === 200) {

                alert("Registration Done")



                navigate(`/OtpData?email=${window.btoa(formData.email)}`)
                // setLogin(true)
            }
        }
        catch (err) {
            setError(err.response?.data?.message || "Registration Failed");
        }
    }
    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-12 col-sm-12 col-md-4 col-lg-4 d-none d-md-block '>
                    <img src={registrationImage} alt="Login Background" className="img-fluid w-100 h-100" style={{ objectFit: "contain" }}
                    />
                </div>
                <div className='col-12 col-sm-12 col-md-6 col-lg-6'>
                    <h3 className='text-center'>Create Account</h3>
                    {error && <p className="text-danger">{error}</p>}
                    <form className='mt-5' onSubmit={handleSubmit}>
                        <div className='mb-4'>
                            <div className="input-group">
                                <span className="input-group-text bg-transparent border-0 border-bottom">
                                    <i className="bi bi-house  "></i>
                                </span>
                                <input type="text" name="first_name" className="form-control border-0 border-bottom" placeholder="Enter First Name" value={formData.first_name} onChange={handleChange} />
                            </div>
                            <p className="text-danger">{validationError.first_name}</p>
                        </div>
                        <div className='mb-4'>
                            <div className="input-group">
                                <span className="input-group-text bg-transparent border-0 border-bottom">
                                    <i className="bi bi-person"></i>
                                </span>
                                <input type="text" name="last_name" className="form-control border-0 border-bottom" placeholder="Enter Last Name" value={formData.last_name} onChange={handleChange} />
                            </div>
                            <p className="text-danger">{validationError.last_name}</p>
                        </div>
                        <div className='mb-4'>
                            <div className="input-group">
                                <span className="input-group-text bg-transparent border-0 border-bottom">
                                    <i className="bi bi-telephone"></i>
                                </span>
                                <input type="tel" name="phone_number" className="form-control border-0 border-bottom" placeholder="Enter Phone Number" value={formData.phone_number} onChange={handleChange} />
                            </div>
                            <p className="text-danger">{validationError.phone_number}</p>
                        </div>
                        <div className='mb-4'>
                            <div className="input-group">
                                <span className="input-group-text bg-transparent border-0 border-bottom">
                                    <i className="bi bi-envelope"></i>
                                </span>
                                <input type="email" name="email" className="form-control border-0 border-bottom" placeholder="Enter Email Address" value={formData.email} onChange={handleChange} />
                            </div>
                            <p className="text-danger">{validationError.email}</p>
                        </div>
                        <div className='mb-4'>
                            <div className="input-group mb-4">
                                <span className="input-group-text bg-transparent border-0 border-bottom">
                                    <i className="bi bi-lock"></i>
                                </span>
                                <input type="password" name="password" className="form-control border-0 border-bottom" placeholder="Enter Password" value={formData.password} onChange={handleChange} />
                            </div>
                            <p className="text-danger">{validationError.password}</p>
                        </div>
                        <div className='mb-4'>
                            <div className="input-group">
                                <span className="input-group-text bg-transparent border-0 border-bottom">
                                    <i className="bi bi-lock"></i>
                                </span>
                                <input type="password" name="confirmPassword" className="form-control border-0 border-bottom" placeholder="Enter Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
                            </div>
                            <p className="text-danger">{validationError.confirmPassword}</p>
                        </div>
                        <button className="form-control"
                            style={{
                                borderRadius: "20px", background: "linear-gradient(to left, #8dbd69, #46757a)", color: "white", fontWeight: "bold"
                            }}>
                            Sign Up
                        </button>
                        <div className='m-3'>
                            <Link to="/login" className='text-decoration-none'>Log in with an existing account</Link>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignUp