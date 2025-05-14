import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCcVisa } from '@fortawesome/free-brands-svg-icons';
import { faCcMastercard } from '@fortawesome/free-brands-svg-icons';
import credicard_image from '../../../assets/images/creditcard_image.png';
import { useNavigate } from 'react-router-dom';
import { order_user_validation } from '../../auth/validation/validation';
import axios from 'axios';
import apiList, { ApiEndPoint } from '../../../Api/Api_Calls'
function Checkout() {
    const [formDetails, setFormDetails] = useState({ country: "", firstname: "", lastname: "", address: "", appartment: "", city: "", state: "", pincode: "", phonenumber: "" })
    const [shippingDetails, setShippingDetails] = useState({ country: "", firstname: "", lastname: "", address: "", appartment: "", city: "", state: "", pincode: "", phonenumber: "" })
    const [cartItems, setCartItems] = useState([]);
    const [orderValidation, setOrderValidation] = useState({})
    const [error, setError] = useState(null);
    const [billingAddress, setBillingAdress] = useState(false)
    const navigate = useNavigate()
    const shippingPrice = 100

    let razorpayPaymentId = '';
    useEffect(() => {
        const cartDetails = localStorage.getItem("cart");
        if (cartDetails) {
            const parsed = JSON.parse(cartDetails);
            setCartItems(parsed);
        }


    }, []);

    const calculateTotalPrice = () => {
        return cartItems.reduce((total, product) => { return total + product.qty * product.selectedWeight.price }, 0);

    }
    const totalPrice = calculateTotalPrice();
    const netprice = totalPrice + shippingPrice
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (billingAddress) {
            setShippingDetails(prev => ({ ...prev, [name]: value }));
        } else {
            setFormDetails(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = billingAddress
            ? order_user_validation(shippingDetails)
            : order_user_validation(formDetails);

        setOrderValidation(validationErrors);
        const selected = document.querySelector('input[name="radio"]:checked');
        if (!selected) {

            setOrderValidation(prev => ({ ...prev, billing: "Please select the billing address." }));

            return;
        }
        if (Object.keys(validationErrors).length > 0) {
            return;
        }
        await createRazorpayOrder(netprice);
    }
    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");

            script.src = src;

            script.onload = () => {
                resolve(true)
            }
            script.onerror = () => {
                resolve(false)
            }

            document.body.appendChild(script);
        })
    }

    const createRazorpayOrder = async (amount) => {

        const data = {
            amount: amount * 100,//iam giving the 100 here because when we are giving the any amount razor pay takes the paise way 100paisa=1upess so iam multiple the 100.
            currency: "INR"
        };
        const response = await axios.post(apiList.ordersData, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        console.log("order created", response.data);
        handleRazorpayScreen(response.data.amount)


    }
    const handleRazorpayScreen = async (amount) => {
        const res = await loadScript("https:/checkout.razorpay.com/v1/checkout.js")

        if (!res) {
            console.log("raz not loaded");
            alert("Some error at razorpay screen loading")
            return;
        }
        const options = {
            key: 'rzp_test_wkbsiGSGRQ4eDs',
            amount: amount,
            currency: 'INR',
            name: "payasam products",
            description: "payment to payasam products",
            image: "https://papayacoders.com/demo.png",
            handler: async function (response) {
                console.log("paymentId", response.razorpay_payment_id);
                const params = {
                    user: formDetails,
                    shipping: billingAddress ? shippingDetails : formDetails,
                    cart: cartItems,
                    totalAmount: totalPrice,
                    netAmount: totalPrice + shippingPrice,
                    shippingPrice: shippingPrice,
                    discount: 0,
                }
                const paymentId = response.razorpay_payment_id
                try {
                    const token = localStorage.getItem("ProfileData")
                    const response = await axios.post(apiList.createOrder, params, { headers: { Authorization: `Bearer ${token}` } })
                    console.log("Order Created Successfully", response.data);
                    console.log("paymentId2", paymentId)
                    navigate(`/orderStatus/${paymentId}/${response.data.order_id}`);
                }
                catch (err) {
                    console.error("Order creation failed after payment:", err);
                    alert("Order creation failed. Please contact support.");

                }


            },
            prefill: {
                name: "payasam-products",
                email: "payasamproducts@gmail.com"
            },
            theme: {
                color: "#F4C430"
            }
        }
        const paymentObject = new window.Razorpay(options)
        paymentObject.open()

    }


    return (
        <div className='container-fluid'>
            <div className="d-flex justify-content-between align-items-center m-5 ">
                <h3 className="mb-0" style={{ cursor: "pointer" }} onClick={() => { navigate("/") }}>
                    PAYASAMPRODUCTS
                </h3>
                <i className="bi bi-bag" style={{ fontSize: '24px', cursor: "pointer" }} onClick={() => { navigate("/Cart") }}></i>

            </div>
            <hr></hr>
            <div className='row m-4'>
                <div className='col-12 col-sm-12 col-md-6 col-lg-6'>
                    {error && <p className="text-danger">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <h3 >Contact</h3>
                        <input type='email' className='form-control border border-dark mt-3 mb-3' placeholder='Enter Your Email Id' />
                        <input type='checkbox' className='me-2' style={{ accentColor: 'brown' }} />Email me with news and offers
                        <select className='form-control mt-3 border border-dark' placeholder="country/Region" name="country" value={formDetails.country} onChange={handleChange}>
                            <option value="" disabled selected>Select your Country/Region</option>
                            <option value="CA">Canada</option>
                            <option value="IN">India</option>
                            <option value="GB">United Kingdom</option>
                            <option value="US">United States</option>
                        </select>
                        <small className="text-danger">{orderValidation.country}</small>
                        <div className='d-flex gap-2 mt-3 row'>
                            <div className='col'>  <input type='text' className='form-control border border-dark d-inline' placeholder='FirstName(optional)' name="firstname" value={formDetails.firstname} onChange={handleChange} /></div>

                            <div className='col'>
                                <input type='text' className='form-control border border-dark d-inline' placeholder='LastName' name="lastname" value={formDetails.lastname} onChange={handleChange} />
                                <small className="text-danger">{orderValidation.lastname}</small>
                            </div>
                        </div>
                        <input type='text' placeholder='Address' className='form-control border border-dark mt-3' name="address" value={formDetails.address} onChange={handleChange} />
                        <p className="text-danger">{orderValidation.address}</p>
                        <input type='text' placeholder='Appartment,suite,etc.(optional)' className='form-control border border-dark mt-3' name="appartment" value={formDetails.appartment} onChange={handleChange} />
                        <div className='d-flex gap-2 mt-3 row'>
                            <div className='col'>
                                <input type='text' className='form-control border border-dark d-inline' placeholder='City' name="city" value={formDetails.city} onChange={handleChange} />
                                <p className="text-danger">{orderValidation.city}</p>
                            </div>
                            <div className='col'>
                                <input type='text' className='form-control border border-dark d-inline' placeholder='State' name="state" value={formDetails.state} onChange={handleChange} />
                                <p className="text-danger">{orderValidation.state}</p>
                            </div>
                            <div className='col'>
                                <input type='text' className='form-control border border-dark d-inline' placeholder='Pincode' name="pincode" value={formDetails.pincode} onChange={handleChange} />
                                <p className="text-danger">{orderValidation.pincode}</p>
                            </div>
                        </div>
                        <input type='tel' placeholder='Phone Number' className='form-control border border-dark mt-3' name="phonenumber" value={formDetails.phonenumber} onChange={handleChange} />
                        <p className="text-danger">{orderValidation.phonenumber}</p>
                        <input type='checkbox' className='me-2 mt-2' style={{ accentColor: 'brown' }} />Save this information for next time<br></br>


                        <input type='checkbox' className='me-2 mt-2 mb-3' style={{ accentColor: 'brown' }} />Text me with news and offers

                        <h5>Shipping method</h5>
                        {/* <input type='text' value="Local Shipping" disabled className="form-control border border-dark" style={{ color: "black", backgroundColor: "#fff4f4" }} /> */}
                        <div className='d-flex justify-content-between align-items-center border border-dark form-control' style={{ backgroundColor: "#fff4f4" }}>
                            <p> Local Shipping</p>
                            <b>₹100.00</b>
                        </div>
                        <h5 className='mt-4'>Payment</h5>
                        <span>All transactions are secure and encrypted.</span>
                        <div className='d-flex justify-content-between align-items-center border border-dark form-control' style={{ backgroundColor: "#fff4f4" }}>
                            <p> Razorpay Secure (UPI, Cards, Wallets, NetBanking)</p>


                            <div><FontAwesomeIcon icon={faCcVisa} style={{ marginRight: "10px", fontSize: "20px", color: "blue" }} />
                                <FontAwesomeIcon icon={faCcMastercard} style={{ marginRight: "10px", fontSize: "20px", color: "red" }} />
                                <i class="bi bi-currency-rupee" style={{ marginRight: "10px", fontSize: "20px", color: "red" }} ></i></div>
                        </div>
                        <div className='d-flex flex-column align-items-center' style={{ backgroundColor: "#f4f4f4" }}>
                            <img src={credicard_image} className='w-25 mt-3' />
                            <p className='text-center'>After clicking “Pay now”, you will be redirected to Razorpay Secure (UPI, Cards, Wallets, NetBanking) to complete your purchase securely.</p>
                        </div>
                        <h5 className='mt-3'>Billing address</h5>
                        <input type='radio' id="id1" name="radio" onClick={() => setBillingAdress(false)} /> <label htmlFor="id1" style={{ cursor: 'pointer' }}> Same as shipping address</label><br></br>
                        <input type='radio' name="radio" id="id2" onClick={() => setBillingAdress(true)} /> <label htmlFor="id2" style={{ cursor: 'pointer' }}> Use a different billing address</label>
                        <p className="text-danger">{orderValidation.billing}</p>
                        {billingAddress &&
                            <div style={{ backgroundColor: "#f4f4f4" }}>
                                <select className='form-control mt-3 border border-dark' placeholder="country/Region" name="country" value={shippingDetails.country} onChange={handleChange}>
                                    <option value="" disabled selected>Select your Country/Region</option>
                                    <option value="CA">Canada</option>
                                    <option value="IN">India</option>
                                    <option value="GB">United Kingdom</option>
                                    <option value="US">United States</option>
                                </select>
                                <small className="text-danger">{orderValidation.country}</small>
                                <div className='d-flex gap-2 mt-3 row'>
                                    <div className='col'>  <input type='text' className='form-control border border-dark d-inline' placeholder='FirstName(optional)' name="firstname" value={shippingDetails.firstname} onChange={handleChange} /></div>

                                    <div className='col'>
                                        <input type='text' className='form-control border border-dark d-inline' placeholder='LastName' name="lastname" value={shippingDetails.lastname} onChange={handleChange} />
                                        <small className="text-danger">{orderValidation.lastname}</small>
                                    </div>
                                </div>
                                <input type='text' placeholder='Address' className='form-control border border-dark mt-3' name="address" value={shippingDetails.address} onChange={handleChange} />
                                <p className="text-danger">{orderValidation.address}</p>
                                <input type='text' placeholder='Appartment,suite,etc.(optional)' className='form-control border border-dark mt-3' name="appartment" value={shippingDetails.appartment} onChange={handleChange} />
                                <div className='d-flex gap-2 mt-3 row'>
                                    <div className='col'>
                                        <input type='text' className='form-control border border-dark d-inline' placeholder='City' name="city" value={shippingDetails.city} onChange={handleChange} />
                                        <p className="text-danger">{orderValidation.city}</p>
                                    </div>
                                    <div className='col'>
                                        <input type='text' className='form-control border border-dark d-inline' placeholder='State' name="state" value={shippingDetails.state} onChange={handleChange} />
                                        <p className="text-danger">{orderValidation.state}</p>
                                    </div>
                                    <div className='col'>
                                        <input type='text' className='form-control border border-dark d-inline' placeholder='Pincode' name="pincode" value={shippingDetails.pincode} onChange={handleChange} />
                                        <p className="text-danger">{orderValidation.pincode}</p>
                                    </div>
                                </div>
                                <input type='tel' placeholder='Phone Number' className='form-control border border-dark mt-3' name="phonenumber" value={shippingDetails.phonenumber} onChange={handleChange} />
                                <p className="text-danger">{orderValidation.phonenumber}</p>
                            </div>
                        }
                        <button type='submit' className='btn form-control border border-dark mt-4 bg-warning mb-3' ><b>Pay Now</b></button>
                        <hr></hr>
                        <a className='me-3' style={{ textDecoration: "underline", color: "brown" }}>Privacy Policy</a>
                        <a className='' style={{ textDecoration: "underline", color: "brown" }}>Term Of Services</a>
                    </form>
                </div>

                <div className='col-12 col-sm-12 col-md-6 col-lg-6' style={{ backgroundColor: "#faf3e7" }}>
                    {cartItems.map((product, index) => (
                        <>
                            {console.log("cartProduct", product)}
                            <div className='row text-center m-4'>
                                <div className='col-3 col-sm-3 col-md-3 col-lg-3' style={{ position: "relative" }}>
                                    <img src={`${ApiEndPoint}/${product.product_image}`} alt={product.product_name} style={{ width: "100%" }} />
                                    <p style={{ border: "2px solid", borderRadius: "50%", width: "20px", position: "absolute", top: "-20px", backgroundColor: "black", color: "white", right: "10px" }}>{product.qty}</p>
                                </div>

                                <div className='col-3  col-sm-3 col-md-3 col-lg-3'>
                                    <p> <b>{product.product_name}</b></p>


                                </div>
                                <div className='col-3 col-sm-3 col-md-3 col-lg-3'>
                                    <p>
                                        {product.selectedWeight.weight_value}
                                        {product.selectedWeight.weight_unit}


                                    </p>
                                </div>
                                <div className='col-3 col-sm-3 col-md-3 col-lg-3'>
                                    <p>
                                        <b>Rs:</b> {product.qty * product.selectedWeight.price}/-

                                    </p>
                                </div>

                            </div>

                        </>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <p>Subtotal :</p>
                        <p>₹{totalPrice}</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <p>Shipping :</p>
                        <p>₹100</p>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h4>Total</h4>

                        <h5>₹{netprice}</h5>
                    </div>
                    Including ₹74.76 in taxes


                </div>
            </div>
        </div>
    )
}

export default Checkout