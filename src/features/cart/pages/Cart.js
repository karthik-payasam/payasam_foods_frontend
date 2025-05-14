import React, { useEffect, useState } from 'react';

import Empty_Cart_State from '../../../assets/images/Empty_Cart_State.png'
import deliveryIcon from '../../../assets/images/deliveryicon.png'
import { Link, useNavigate } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';
import { useAuthContext } from '../../auth/context/AuthContext';
import { ApiEndPoint } from '../../../Api/Api_Calls'
function Cart() {
  const { state: { cart }, dispatch, qtyData, setQtyData } = useCartContext();
  const { login, setLogin } = useAuthContext();
  const [cartItems, setCartItems] = useState([]);
  const [qty, setQty] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {

    setCartItems(cart);

  }, [cart]);
  const handleRemove = (product_id, weight_id) => {

    const key = `${product_id}-${weight_id}`
    const updatedCart = cartItems.filter((w) => w.cart_id !== key)
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    dispatch({ type: 'ADD_CART', products: updatedCart })

  }
  const calculateTotalPrice = () => {
    return cartItems.reduce((total, product) => {
      const price = product.selectedWeight.price;
      const qty = product.qty;
      return total + qty * price;
    }, 0);
  }

  const calculateTotalWeight = () => {
    return cartItems.reduce((total, product) => {
      const weight = product.selectedWeight?.weight_value;
      const qty = product.qty;
      return total + qty * weight;
    }, 0);
  }
  const totalPrice = calculateTotalPrice();
  const totalWeight = calculateTotalWeight();
  const handleQuantity = (id, w_id, qty, flag) => {
    if (flag === "add") {
      qty = qty + 1

    }
    else {
      qty = qty - 1
      if (qty <= 0) {
        qty = 1;
      }
    }
    dispatch({ type: 'update_qty', Qty: { qty, id, w_id } })
  }
  const checkOutPage = () => {
    if (login) {
      navigate("/checkout")

    }
    else {
      navigate("/login")
    }
  }
  const handleCheckOut = () => {
    const isChecked = document.getElementById("termsCheckbox").checked;
    if (!isChecked) {
      alert("Please accept the privacy policy and T&C before proceeding.");
    }
    else {
      checkOutPage();
    }
  }
  return (
    <div className='container'>
      {cartItems.length === 0 ? (<div className='text-center'>
        <img src={Empty_Cart_State} style={{ width: "150px", height: "100%", objectFit: "cover" }} />
        <h3>Your cart is getting lonely</h3>
        <p>Fill it up with all things good!</p>
        <button className='btn mb-3' style={{ backgroundColor: "#ffeee5", color: "#ff5211", fontFamily: "bold", fontSize: "25px" }} onClick={() => { navigate("/") }}>Start Shopping</button>
      </div>) : (<div>
        <div className='row text-center mt-5'>
          <div className='col-2 col-sm-2 col-md-2 col-lg-2'>
            Product Name
          </div>
          <div className='col-2 col-sm-2 col-md-2 col-lg-2'>
            Quantity
          </div>
          <div className='col-3 col-sm-3 col-md-3 col-lg-3'>
            Item Price(Each)
          </div>
          <div className='col-3 col-sm-3 col-md-3 col-lg-3'>
            Total Item Price
          </div>
          <div className='col-2 col-sm-2 col-md-2 col-lg-2'>
            Sub Total
          </div>
          <hr></hr>
        </div>

        {cartItems.map((product, index) => {


          console.log("cartProduct", product)
          return (<div className='row text-center mb-3'>
            <div className='col-2 col-sm-2 col-md-2 col-lg-2'>
              <Link to={`/productDetails/${product.product_id}?w=${product.selectedWeight.weight_id}`}>   <img src={`${ApiEndPoint}/${product.product_image}`} alt={product.product_name} style={{ width: "100%" }} /></Link>
              <b>{product.product_name}</b>
            </div>
            <div className='col-2 col-sm-2 col-md-2 col-lg-2'>
              <p>  {/* Quantity */}
                <button className='btn border border-dark' onClick={() => { handleQuantity(product.product_id, product.selectedWeight.weight_id, product.qty, "minus") }}>-</button>
                <span className='m-2'>{product.qty}</span>

                <button className='btn border border-dark' onClick={() => { handleQuantity(product.product_id, product.selectedWeight.weight_id, product.qty, "add") }}>+</button>
              </p>
            </div>
            <div className='col-3  col-sm-3 col-md-3 col-lg-3'>
              {/* Price */}
              <p>
                {(product.selectedWeight.price)} ({product.selectedWeight.weight_value}
                {product.selectedWeight.weight_unit})
              </p>

            </div>
            <div className='col-3 col-sm-3 col-md-3 col-lg-3'>
              <p>


                <b>Rs:</b> {product.qty * (product.selectedWeight.price)}/-

              </p>
            </div>
            <div className='col-2 col-sm-2 col-md-2 col-lg-2'>
              <p className='text-danger btn border border-danger' onClick={() => { handleRemove(product.product_id, product.selectedWeight?.weight_id) }}> Remove Item X</p>
            </div>
          </div>
          )

        })}
        <div className='row'>
          <div className='col-12 col-sm-8 col-md-8 col-lg-8'>
            <p>Add a Note to Your Order</p>
            <textarea cols={25} rows={3}></textarea>
          </div>
          <div className='col-12 col-sm-4 col-md-4 col-lg-4 text-end'>
            <h3 className='d-inline'>Subtotal:</h3><h5 className='d-inline'>Rs.{totalPrice}/-</h5>
            <p>Total Cart Weight: -- {totalWeight}gms</p>
            <p>Tax included and shipping calculated at checkout</p>
            <input type='checkbox' id="termsCheckbox" />
            <p className='d-inline ms-3'>By Proceeding, I accept the <a style={{ textDecoration: "underline" }}>privacy policy</a>
              and <a style={{ textDecoration: "underline" }}>T&C</a></p><br></br>
            <button className='btn btn-warning border border-dark mt-3 mb-2' onClick={handleCheckOut}>CheckOut</button><br></br>
            <a>Continue shopping</a><br></br>
            <img src={deliveryIcon} style={{ width: "40px" }} /><p className='d-inline'>Check Delivery</p><br></br>
            <div className='mb-3 mt-2'>
              <input type='text' placeholder='ENTER YOUR ZIP CODE' className='btn border border-dark' />
              <button className='btn border border-dark ms-2' style={{ backgroundColor: "#89216b", color: "white" }}>Check</button>
            </div>
          </div>
        </div>
      </div>)}

    </div>
  );
}

export default Cart;