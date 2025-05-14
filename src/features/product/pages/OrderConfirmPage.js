import React, { useEffect, useState } from 'react'
import sucessImage from '../../../assets/images/sucess-image.png'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useCartContext } from '../../cart/context/CartContext'
import apiList, { ApiEndPoint } from '../../../Api/Api_Calls'
function OrderConfirmPage() {
    const navigate = useNavigate();
    const params = useParams()
    const [payamentDetails, setPaymentDetails] = useState(null)
    const [orderData, setOrderData] = useState(null);
    const { state: { cart }, dispatch } = useCartContext();
    useEffect(() => {

        const FetchPaymentDetails = async () => {
            const response = await axios.get(`${apiList.paymentDetails}/${params.paymentId}`)
            if (response.status == 200) {
                console.log("payamentResponse", response.data);
                dispatch({ type: 'ADD_CART', products: [] })
                setPaymentDetails(response.data);
                const responseData = await axios.get(`${apiList.order_Details}/${params.order_id}`)
                if (responseData.status == 200) {

                    console.log("total order detailss are", responseData.data.OrderData)
                    setOrderData(responseData.data.OrderData);
                }
            }
        }
        FetchPaymentDetails();
    }, [params.paymentId, params.order_id])
    return (
        <div className='container'>

            <div className='row pt-5'>
                <div className='col-6 col-sm-6 col-md-6 col-lg-6'>
                    <div className='text-center'>
                        <img src={sucessImage} width={70} />
                        <h2 className='pt-3 pb-3'>Thank You For Your Order</h2>
                        <h6>Order Confirmed</h6>
                        {console.log("details", payamentDetails)}
                        {payamentDetails && <>
                            <div className='row pt3'>
                                <div className='col-6 col-sm-6 col-md-6 col-lg-6'>
                                    <b className='text-center'>PaymentMode</b>
                                    <p> {payamentDetails.method}</p>
                                </div>
                                <div className='col-6 col-sm-6 col-md-6 col-lg-6'>
                                    <b className='text-center'>OrderDate & Time</b>
                                    <p> {new Date(payamentDetails.created_at * 1000).toLocaleString()}</p>
                                </div>

                            </div>
                        </>
                        }
                        {orderData && <>
                            <div className='row pt3'>
                                <div className='col-6 col-sm-6 col-md-6 col-lg-6'>
                                    <b className='text-center'>BillingAddress</b>
                                    <p> {orderData.billing.map((billingData, index) => (
                                        <div>
                                            {billingData.firstname}{billingData.lastname}, {billingData.address} ,{billingData.pincode},{billingData.city},{billingData.state},{billingData.country}
                                        </div>
                                    ))}</p>
                                </div>
                                <div className='col-6 col-sm-6 col-md-6 col-lg-6'>
                                    <b className='text-center'>Delivery Address</b>
                                    <p> {orderData.user.map((userData, index) => (
                                        <div>
                                            {userData.firstname}{userData.lastname}, {userData.address} ,{userData.pincode},{userData.city},{userData.state},{userData.country}
                                        </div>
                                    ))}</p>
                                </div>
                                <button className='form-control mt-5 bg-dark text-light' onClick={() => { navigate("/") }}>Continue Shopping</button>
                            </div>
                        </>
                        }

                    </div>
                </div>
                <div className='col-6 col-sm-6 col-md-6 col-lg-6' style={{ backgroundColor: "#f2f1f3", borderRadius: "25px" }}>
                    {orderData && <div>
                        {orderData.cart.map((details, index) => (

                            <div className='row'>
                                <div className='col-3 col-sm-3 col-md-3 col-lg-3 pt-3 pb-1'>

                                    <Link to={`/productDetails/${details.product_id}`}>    <img src={`${ApiEndPoint}/${details.product_image}`} style={{ width: "100%", height: "auto" }} /></Link>

                                </div>
                                <div className='col-3 col-sm-3 col-md-3 col-lg-3 pt-3 pb-1'>
                                    <b>{details.product_name}</b><br></br>
                                    Qty:{details.qty}

                                </div>
                                <div className='col-4 col-sm-4 col-md-4 col-lg-4 pt-4 pb-1'>
                                    <b>weight:</b>  {details.weight_of_product}{details.weight_unit}

                                </div>
                                <div className='col-2 col-sm-2 col-md-2 col-lg-2 pt-4 pb-1'>
                                    <b>Price:</b>   {details.price * details.qty}
                                </div>
                            </div>
                        ))}
                        {orderData.order.map((data, index) => (
                            <div>
                                <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <p>SubTotal:</p>
                                    </div>
                                    <div>
                                        <b>{data.totalAmount}</b>
                                    </div>
                                </div>
                                <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <p>Shipping Price:</p>
                                    </div>
                                    <div>
                                        <b>{data.shippingPrice}</b>
                                    </div>
                                </div>
                                <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <p>Discount:</p>
                                    </div>
                                    <div>
                                        <b>{data.discount}</b>
                                    </div>
                                </div>
                                <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <p>NetAmount:</p>
                                    </div>
                                    <div>
                                        <b>{data.netAmount}</b>
                                    </div>
                                </div>

                            </div>))}
                    </div>}

                </div>
            </div>

        </div>
    )
}

export default OrderConfirmPage