import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import apiList, { ApiEndPoint } from '../../../Api/Api_Calls'
function Search() {
    const [itemName, setItemName] = useState("");
    const [product, setProduct] = useState("");
    const [data, setData] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("e", e)
        try {
            const response = await axios.get(apiList.searchItems, { params: { product_name: itemName } })
            console.log("responseserach", response.data.productData);
            setProduct(response.data.productData);
            setData(true);
        }
        catch (error) {
            console.error("Search Error:", error);
        }
    }
    const handleChange = (e) => {
        console.log("target", e.target.value)
        setItemName(e.target.value)

    }
    return (
        <div className='container mt-5 mb-5'>
            <form onSubmit={handleSubmit}>

                <div className="input-group border border-dark" style={{ backgroundColor: "#f2f2f2" }}>
                    <input type="text" className='form-control' name="productNameData" value={itemName} onChange={handleChange} placeholder='Seach Items...' />
                    <span className="input-group-text bg-transparent ">
                        <button type='submit'>  <i className="bi bi-search "></i></button>
                    </span>
                </div>

            </form>
            <div>
                <div className='row'>
                    {product && product.length > 0 ? (product.map((productData, index) => (


                        <div className='col-3 col-sm-3 col-md-3 col-lg-3 mt-3 mb-3'>
                            <Link to={`/productDetails/${productData.product_id}`}>   <img src={`${ApiEndPoint}/${productData.product_image}`} style={{ width: "100%", height: "auto" }} /></Link>
                            <b className='text-center d-block'>{productData.product_name}</b>
                            <b className='text-center d-block'>Rs:{productData.weights[0].price}</b>
                        </div>
                    ))) : (data ? (<div className='text-center mt-3'><b>No Data Found......</b></div>) : null)
                    }
                </div>
            </div>
        </div>
    )
}

export default Search