import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useCartContext } from '../../cart/context/CartContext';
import apiList, { ApiEndPoint } from '../../../Api/Api_Calls'

function Category(props) {

    const { state: { cart }, dispatch } = useCartContext();
    const navigate = useNavigate()
    console.log("statedispatch", cart, props);


    const params = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    console.log("searchParams", searchParams.get('sort'))
    const [products, setProducts] = useState([]);
    const [AddData, setAddData] = useState({})
    const [selectedProduct, setSelectedProduct] = useState([]);
    const [selectedWeights, setSelectedWeights] = useState({});
    params['sort'] = searchParams.get('sort')
    console.log(params);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [params.id, params.sub_id])


    // const { setLogin, setRole } = useAuthContext();
    useEffect(() => {

        const sweetsData = async () => {


            try {
                const response = await axios.get(apiList.AllproductDetailsbyCategory, { params: { category_id: params?.id, sub_category_id: params?.sub_id, sort: params?.sort } });

                console.log("productData", response.data.categoryDataDetails); // Do something with the response
                setProducts(response.data.categoryDataDetails)
            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        }
        sweetsData();
    }, [params])

    useEffect(() => {
        let cartQtyObj = {}
        console.log("useEfeectCartDetails", cart)

        cart.forEach(c => {
            const key = `${c.product_id}-${c.selectedWeight.weight_id}`
            cartQtyObj[key] = c.qty
        })

        console.log({ cartQtyObj })
        setAddData(cartQtyObj)
    }, [cart])

    const handleAdd = (product_id, weight_id) => {
        const key = `${product_id}-${weight_id}`;
        setAddData((prev) => ({ ...prev, [key]: 1 }))
    }
    const handleIncrement = (product_id, weight_id) => {
        const key = `${product_id}-${weight_id}`;
        setAddData(prev => ({ ...prev, [key]: (prev[key] || 0) + 1 }));


    }
    const handleDecrement = (product_id, weight_id) => {
        const key = `${product_id}-${weight_id}`;
        setAddData((prev) => {
            const newVal = prev[key] - 1
            if (newVal <= 0) {
                const update = { ...prev }
                delete update[key];
                return update;
            }
            return { ...prev, [key]: newVal }
        })
    }

    console.log({ cart })

    const handleAddCart = useCallback((itemToAdd) => {
        const key = `${itemToAdd.product_id}-${itemToAdd.selectedWeight.weight_id}`
        console.log({ itemToAdd })
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
    const handleSelect = (product_id, e) => {
        console.log("target", e.target.value);

        const product = products.find(p => p.product_id === product_id);
        console.log("productData", product);
        const selected = product.weights.find(w => w.weight_id === Number(e.target.value))
        setSelectedWeights((prev) => ({ ...prev, [product_id]: selected }))
    }
    console.log("selectredweights", selectedWeights);

    return (


        <div className='container-fluid'>
            <div className='row mt-2'>
                <h3 className='text-center mt-3 mb-3'>{params.name}</h3>
                <div>  <b>Sort By</b>

                    <select onChange={(e) => {
                        console.log("e", e.target.value)
                        setSearchParams(`?${new URLSearchParams({ sort: e.target.value })}`)

                    }}
                        value={params.sort || `asc`}
                        className='mt-3 mb-3'
                    >
                        <option value="asc">Price,Low to High</option>
                        <option value="desc">Price,High to Low</option>

                    </select>

                </div>
                {products.map((product, index) => {
                    const selectedWeight = selectedWeights[product.product_id] || product.weights[0];
                    const key = `${product.product_id}-${selectedWeight.weight_id}`;

                    return (<div className='col-12 col-sm-12 col-md-3 col-lg-3 mb-3'>

                        <Link to={`/productDetails/${product.product_id}`}>
                            <img src={`${ApiEndPoint}/${product.product_image}`} style={{ width: "100%", height: "auto" }} />
                        </Link>
                        <h5 className='text-center'>{product.product_name}</h5>
                        <div className='text-center mb-2'>
                            <span>From</span>
                            <span>Rs. {product.weights?.[0]?.price}</span>
                        </div>

                        <select className='form-control' onChange={(e) => { handleSelect(product.product_id, e) }}
                        >   {product.weights.map((w, i) => (
                            <option key={i} value={w.weight_id}>
                                {w.weight_value}{w.weight_unit} - Rs.{w.price}
                            </option>
                        ))}

                        </select>
                        <div className="row mt-3">
                            <div className="col-4">
                                {AddData[key] ? (
                                    <div>
                                        <button className="btn btn-sm border border-dark" onClick={() => { handleDecrement(product.product_id, selectedWeight.weight_id) }}>-</button>
                                        <span className='m-1'>{AddData[key]}</span>
                                        <button className="btn btn-sm border border-dark" onClick={() => { handleIncrement(product.product_id, selectedWeight.weight_id) }}>+</button>
                                    </div>
                                ) : (<div>
                                    <button className="btn btn-success w-100" onClick={() => { handleAdd(product.product_id, selectedWeight.weight_id) }}>Add</button>
                                </div>)}
                            </div>
                            <div className="col-8">
                                {/* cart popupbox */}
                                <button
                                    type="button"
                                    className="btn w-100"
                                    style={{ backgroundColor: "#c52f24", color: "white" }}
                                    data-bs-toggle="modal"
                                    data-bs-target="#exampleModal"
                                    onClick={() => {

                                        const itemToAdd = { ...product, qty: AddData[key] || 1, selectedWeight };

                                        setSelectedProduct([itemToAdd]);
                                        handleAddCart(itemToAdd);
                                    }}
                                >
                                    Add To Cart
                                </button>
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

                        </div>
                    </div>
                    )
                })}

            </div>

        </div >

    )
}

export default Category