import React, { useState } from 'react'
import LoginImage from '../../../assets/images/loginImagePage.jpg'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuthContext } from '../context/AuthContext'

function SignIn() {
    const [formData, setFormData] = useState({ email: "", password: "" })
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { setLogin, setRole, verifyCondition, setVerifyCondition } = useAuthContext()
    const handleChange = (e) => {

        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleLogin = async (e) => {
        e.preventDefault()
        setError(null)

        try {
            const response = await axios.post("http://localhost:9090/user/api/login", formData);
            console.log(response.data.token)

            if (response.status === 200) {
                // if (verifyCondition) {
                //     navigate('/')
                // }
                // else {
                //     navigate(`/OtpData?email=${window.btoa(formData.email)}`)
                // }
                if (response.data.verifyData) {

                    localStorage.setItem("ProfileData", (response.data.token));
                    setLogin(true)
                    navigate('/')
                }
                else {
                    navigate(`/OtpData?email=${window.btoa(formData.email)}`)
                }
                // alert("login successfull..")
                // const role = 0

                // localStorage.setItem("role", role);

                // console.log("roleData.." + role)
                // setRole(role)
                // if (role === 1) {
                //     console.log("sdsdsdd")
                //     navigate("/admin")
                // }
                // else { navigate("/") }

            }
        }
        catch (err) {
            setError(err.response?.data?.message || "Invalid credentials");
        }
    }
    return (

        <div className='container-fluid'>
            <div className='row'>
                <div className='col-12 col-sm-12 col-md-4 col-lg-4 d-none d-md-block'>
                    <img src={LoginImage} alt="Login Background" className="img-fluid w-100 h-100" style={{ objectFit: "contain" }}
                    />
                </div>
                <div className='col-12 col-sm-12 col-md-6 col-lg-6 text-center'>
                    <h3>Login</h3>
                    {error && <p className="text-danger">{error}</p>}
                    <form className='mt-5' onSubmit={handleLogin}>
                        <div className="input-group mb-4">
                            <span className="input-group-text bg-transparent border-0 border-bottom">
                                <i className="bi bi-person"></i>
                            </span>
                            <input type="email" name='email' className="form-control border-0 border-bottom" placeholder="Enter Email Address" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="input-group mb-4">
                            <span className="input-group-text bg-transparent border-0 border-bottom">
                                <i className="bi bi-lock"></i>
                            </span>
                            <input type="password" name="password" className="form-control border-0 border-bottom" placeholder="Enter Password" value={formData.password} onChange={handleChange} required />
                        </div>
                        <button className="form-control"
                            style={{
                                borderRadius: "20px", background: "linear-gradient(to left, #8dbd69, #46757a)", color: "white", fontWeight: "bold"
                            }}>
                            Sign In
                        </button>
                        <div className='mt-3'>
                            Forgot <Link to="" className='text-decoration-none'>UserName/Password?</Link>
                        </div>
                        <div className='mt-3'>
                            Don't have an Account?<Link to="/register" className='text-decoration-none'>SignUp</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignIn