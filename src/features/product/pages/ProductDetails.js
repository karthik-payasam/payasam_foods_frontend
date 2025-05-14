import React, { useCallback, useEffect, useState } from 'react'

import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useCartContext } from '../../cart/context/CartContext';
import apiList, { ApiEndPoint } from '../../../Api/Api_Calls'
function ProductDetails() {
    const paramData = useParams();
    const location = useLocation();
    console.log("location", location.search);
    const url = new URLSearchParams(location.search)
    const weightFromUrl = url.get('w')
    console.log("wid", weightFromUrl)
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [productData, setProductData] = useState([]);
    const [AddData, setAddData] = useState({} || 1)
    const [selectedProduct, setSelectedProduct] = useState([]);
    const [selectedWeightIndex, setSelectedWeightIndex] = useState(0);
    const [selectWeights, setSelectedWeight] = useState({})
    const { state: { cart }, dispatch } = useCartContext();
    const navigate = useNavigate();
    useEffect(() => {
        const ProductDetails = async () => {
            try {
                const response = await axios.get(apiList.ProductData, {
                    params: {
                        product_id: paramData.id
                    }
                })
                console.log("productDetails", response.data.ProductData);
                const fetchValue = response.data.ProductData
                setProductData(response.data.ProductData);
                if (fetchValue.length > 0 && fetchValue[0].weights.length > 0) {
                    setSelectedPrice(fetchValue[0].weights[0].price);
                }
                let defaultWeight = fetchValue[0].weights[0];
                let foundIndex = 0;

                if (weightFromUrl) {
                    const matchedIndex = fetchValue[0].weights.findIndex(w => w.weight_id == weightFromUrl);
                    if (matchedIndex !== -1) {
                        defaultWeight = fetchValue[0].weights[matchedIndex];
                        foundIndex = matchedIndex
                    }
                }
                setSelectedPrice(defaultWeight.price);
                setSelectedWeightIndex(foundIndex);

                setSelectedWeight({ [fetchValue[0].product_id]: defaultWeight });
            }
            catch (err) {
                throw err;
            }
        }
        ProductDetails();

    }, [paramData.id])


    useEffect(() => {
        let cartQtyObj = {}
        cart.forEach(c => {
            const key = `${c.product_id}-${c.selectedWeight.weight_id}`
            cartQtyObj[key] = c.qty
        })

        console.log({ cartQtyObj })
        setAddData(cartQtyObj)
    }, [cart, productData])

    // const handleQuantity = (id, qty, flag) => {
    //     if (flag === "add") {
    //         qty = qty + 1

    //     }
    //     else {
    //         qty = qty - 1
    //         if (qty <= 0) {
    //             qty = 1;
    //         }
    //     }
    //     dispatch({ type: 'update_qty', Qty: { qty, id } })
    // }
    const handleDecrement = (product_id, weight_id) => {
        const key = `${product_id}-${weight_id}`
        setAddData((prev) => {
            const currentQty = prev[key] || 1;
            const newQty = currentQty - 1;
            return {
                ...prev,
                [key]: newQty < 1 ? 1 : newQty
            };
        });
    };

    const handleIncrement = (product_id, weight_id) => {
        const key = `${product_id}-${weight_id}`
        setAddData((prev) => ({ ...prev, [key]: (prev[key] || 1) + 1 }))

    }
    const handleAddCart = useCallback((itemToAdd) => {
        console.log("handleData", itemToAdd);
        const key = `${itemToAdd.product_id}-${itemToAdd.selectedWeight.weight_id}`
        console.log("data handler", key)

        const indexInCart = cart.findIndex(c => c.cart_id === key);
        let updatedCart;
        if (indexInCart !== -1) {
            updatedCart = [...cart];
            updatedCart[indexInCart] = {
                ...updatedCart[indexInCart], qty: itemToAdd.qty
            }
        }
        else {
            itemToAdd['cart_id'] = key
            updatedCart = [...cart, itemToAdd]
        }

        // const updatedCart = [...cart, itemToAdd];
        console.log("updatedCart", updatedCart)
        dispatch({ type: 'ADD_CART', products: updatedCart })

    }, [cart, dispatch]);
    const handleSelectWeight = (product_id, weight_id) => {
        const product = productData.find(c => c.product_id === product_id);
        const selected = product.weights.find(w => w.weight_id === weight_id)

        setSelectedWeight((prev) => ({ ...prev, [product_id]: selected }))
    }
    return (
        <div className='container-fluid mt-4'>
            {productData && (
                <div>
                    {productData.map((product, index) => {
                        const selectedWeight = selectWeights[product.product_id] || product.weights[0];
                        console.log("key", selectedWeight);
                        const key = `${product.product_id}-${selectedWeight.weight_id}`
                        return (<div className='row'>
                            <div className='col-12 col-sm-12 col-md-5 col-lg-5'>
                                <img src={`${ApiEndPoint}/${product.product_image}`} style={{ width: "100%", height: "auto" }} />

                            </div>
                            <div className='col-12 col-sm-12 col-md-5 col-lg-5 mt-3 ms-5'>
                                <h4>{product.product_name}</h4>
                                <strong>Price: ₹{selectedPrice !== null ? selectedPrice : "N/A"}</strong>
                                <hr></hr>
                                <div>
                                    <p>size</p>
                                    {product.weights.map((w, index) => (
                                        <>
                                            <button className={`btn ${selectedWeightIndex == index ? 'btn-primary' : 'btn border-dark'}  ms-3`} onClick={() => {
                                                setSelectedPrice(w.price);
                                                setSelectedWeightIndex(index);
                                                handleSelectWeight(product.product_id, w.weight_id)

                                            }}>{w.weight_value}{w.weight_unit}</button>

                                        </>
                                    ))}

                                </div>
                                <div>
                                    <p>Quantity</p>
                                    {/* <button className='btn border-dark' onClick={handleDecrement(data.product_id, data.qty, "minus")}>-</button>
                                    <span className='m-2'>{quantityData}</span>
                                    <button className='btn border-dark' onClick={handleIncrement}>+</button> */}
                                    <div>
                                        <button className='btn border border-dark' onClick={() => { handleDecrement(product.product_id, selectedWeight.weight_id) }}>-</button>
                                        <span className='m-2'>{AddData[key] || 1}</span>
                                        <button className='btn border border-dark' onClick={() => { handleIncrement(product.product_id, selectedWeight.weight_id) }}>+</button>
                                    </div>

                                </div>
                                <div>
                                    <h6 className='mt-3 mb-3'>Check Delivery</h6>
                                    <input type='text' placeholder='Enter Your ZipCode' className='btn border-dark' />
                                    <button className='btn btn-danger ms-3'>CHECK</button><br></br>
                                    <button className='form-control btn btn-danger mt-3'
                                        data-bs-toggle="modal"
                                        data-bs-target="#exampleModal"
                                        onClick={() => {
                                            const itemToAdd = { ...product, qty: AddData[key] || 1, selectedWeight };

                                            setSelectedProduct([itemToAdd]);
                                            handleAddCart(itemToAdd);

                                        }}>ADD TO CART</button>
                                    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div class="modal-dialog modal-xl">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <b class="modal-title w-100" id="exampleModalLabel">
                                                        <div className='row text-center'>
                                                            <div className='col-2 col-sm-2 col-md-2 col-lg-2'>
                                                                Just added
                                                            </div>
                                                            <div className='col-2 col-sm-2 col-md-2 col-lg-2'>
                                                                Item
                                                            </div>
                                                            <div className='col-2 col-sm-2 col-md-2 col-lg-2'>
                                                                Qty
                                                            </div>
                                                            <div className='col-2 col-sm-2 col-md-2 col-lg-2'>
                                                                Item Price(Size)
                                                            </div>
                                                            <div className='col-2 col-sm-2 col-md-2 col-lg-2'>
                                                                Total Price
                                                            </div>
                                                            <div className='col-2 col-sm-2 col-md-2 col-lg-2'>
                                                                Sub Total
                                                            </div>
                                                        </div>
                                                    </b>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div class="modal-body">
                                                    {console.log("modelbody", selectedProduct)}
                                                    {selectedProduct.length > 0 ? (
                                                        selectedProduct.map((product, idx) => {
                                                            const price = product.selectedWeight?.price || 0;
                                                            const qty = product.qty || 1;
                                                            return (
                                                                <div className='row text-center'>
                                                                    <div className='col-2 col-sm-2 col-md-2 col-lg-2'>
                                                                        <img src={`${ApiEndPoint}/${product.product_image}`} style={{ width: "100%", height: "auto" }} />
                                                                    </div>
                                                                    <div className='col-2 col-sm-2 col-md-2 col-lg-2'>
                                                                        <p>{product.product_name}</p>
                                                                    </div>
                                                                    <div className='col-2 col-sm-2 col-md-2 col-lg-2'>
                                                                        {qty}
                                                                    </div>
                                                                    <div className='col-2 col-sm-2 col-md-2 col-lg-2'>
                                                                        Rs. {price} ({product.selectedWeight.weight_value}{product.selectedWeight.weight_unit})
                                                                    </div>
                                                                    <div className='col-2 col-sm-2 col-md-2 col-lg-2'>
                                                                        {price * qty}
                                                                    </div>
                                                                    <div className='col-2 col-sm-2 col-md-2 col-lg-2'>
                                                                        Sub Total
                                                                    </div>
                                                                </div>

                                                            );
                                                        })
                                                    ) : (<div></div>)}
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" >KEEP SHOPPING</button>
                                                    <button data-bs-dismiss="modal" className='btn btn-primary' onClick={() => { navigate("/Cart") }}>Go To Cart</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div>
                                    <p>{product.description}</p>
                                </div>
                            </div>
                        </div>
                        )
                    })}
                </div>
            )
            }
            <div><h3 className='text-center mt-3'>Customer Reviews</h3></div>
        </div >
    )
}

export default ProductDetails