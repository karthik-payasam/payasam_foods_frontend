import React, { useEffect, useState } from 'react'
import '../../../components1/Header/Header.css'


import homeBanner1 from '../../../assets/images/homeBanner1.jpg'
import homeBanner2 from '../../../assets/images/homeBanner2.jpg'
import homebanner3 from '../../../assets/images/homebanner3.jpg'
import nibble from '../../../assets/images/nibbles.jpg'
import footerhomeimage from '../../../assets/images/footer-home-image.png'
import blog1 from '../../../assets/images/blog1.webp'
import blog2 from '../../../assets/images/blog2.webp'
import blog3 from '../../../assets/images/blog3.webp'
import amazonlogo from '../../../assets/images/amazonlogo.jpg'
import swiggylogo from '../../../assets/images/swiggylogo.jpg'
import zommatologo from '../../../assets/images/zommatologo.jpg'

import swiggyinstamartlogo from '../../../assets/images/swiggyinstamartlogo.jpg'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
function Home() {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate()
    const handleclick = (path) => {
        navigate(path)
    }
    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                const response = await axios.get("http://localhost:9090/user/api/getCategoryDetails");
                setCategories(response.data.categoryDataDetails);
            } catch (error) {
                console.error("Error fetching category details:", error);
            }
        };
        fetchCategoryData();
    }, []);

    const chunkedCategories = [];
    for (let i = 0; i < categories.length; i += 3) {
        chunkedCategories.push(categories.slice(i, i + 3));
    }

    return (
        <>
            <div id="carouselExampleInterval" className="carousel slide" data-bs-ride="carousel" >
                <div className="carousel-inner" >
                    <div className="carousel-item active" data-bs-interval={1000} >
                        <img src={homeBanner1} style={{ width: "100%", height: "auto" }} />
                    </div>
                    <div className="carousel-item" data-bs-interval={2000}>
                        <img src={homeBanner2} style={{ width: "100%", height: "auto" }} />
                    </div>
                    <div className="carousel-item" data-bs-interval={3000}>
                        <img src={homebanner3} style={{ width: "100%", height: "auto" }} />
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true" style={{ backgroundColor: "blue" }} />
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true" style={{ backgroundColor: "blue" }} />
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
            <div className='container text-center'>
                <p > PAYASAM PRODUCTS</p>
                <h2>Our Stories</h2>
                <p className='text-center'>In 1989, we realised that times were changing. With mothers beginning to work outside the home, it was increasingly difficult to invest the time and effort needed to prepare pickles and powders for the family. Home-made pickles were disappearing from the typical Telugu home.</p>
                <button className='btn btn-warning mb-3'>READMORE</button>
            </div>
            <div className='container mb-3'>
                {chunkedCategories.map((chunk, index) => (
                    <div className='row' key={index}>
                        {chunk.map((category, i) => (
                            <div key={i} className='col-12 col-sm-12 col-md-4 col-lg-4 item-types-div' onClick={() => { handleclick(`/category/${category.category_id}/${category.name}`) }}>
                                <img src={`http://localhost:9090/${category.image_url}`} alt={category.name} style={{ width: "100%", height: "auto" }} />
                                <button className='btn btn-dark item-types'>{category.name}</button>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className='container mb-3'>
                <div className='row'>
                    <div className='col-12 col-sm-12 col-md-6 col-lg-6 mb-2'>
                        <img src={nibble} style={{ width: "100%", height: "500px" }} />
                    </div>
                    <div className='col-12 col-sm-12 col-md-6 col-lg-6 mb-2 text-center'>
                        <h2>4pm Nibbles</h2>
                        <p>4pm? Time for evening chai and a delicious namkeen to go with it! Try our traditional South Indian snacks. Whether you’re relaxing in solitude on your balcony, enjoying the rain, or hosting a large and boisterous evening get-together, make sure you’re stocked up on your favourite snacks, like our traditional Telugu-style namkeen, such as vampoosa, muruku, chegodi and Telangana chekkalu. These light snacks are protein rich and utterly delicious, especially with a cup of strong tea or coffee!</p>
                        <p>If youre looking for a more filling snack, try our old-style railway onion samosa. This is one of our specialities and a universal crowd pleaser! We offer a wide variety of exclusive retro snacks that come from a simpler time. These old-school snacks include tepala chekkalu, moong dal muruku and of course, the railway onion samosa.</p>
                    </div>
                </div>
            </div>
            <div>
                <img src={footerhomeimage} style={{ width: "100%", height: "auto" }} />
            </div>
            <div className='container'>
                <div className='row'>
                    <h1 className='text-center mb-5 pt-5'>BLOG POSTS</h1>
                    <div className='col-12 col-sm-12 col-md-4 col-lg-4' style={{ borderRight: "1px solid #e2e2e2" }}>
                        <img src={blog1} style={{ width: "100%", height: "auto" }} />
                        <h3>Winter is coming</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce quis efficitur ligula, quis vehicula justo. Ut lacinia tortor nisl, et tempus lacus varius non. Phasellus a quam augue. Nulla interdum lorem semper sem pretium, eget mattis eros commodo. Sed consectetur metus tincidunt varius hendrerit. Nullam eu risus felis. Nunc aliquam.</p>
                    </div>
                    <div className='col-12 col-sm-12 col-md-4 col-lg-4' style={{ borderRight: "1px solid #e2e2e2" }}>
                        <img src={blog2} style={{ width: "100%", height: "auto" }} />
                        <h3>The Diwali Collection</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce quis efficitur ligula, quis vehicula justo. Ut lacinia tortor nisl, et tempus lacus varius non. Phasellus a quam augue. Nulla interdum lorem semper sem pretium, eget mattis eros commodo. Sed consectetur metus tincidunt varius hendrerit. Nullam eu risus felis. Nunc aliquam.</p>
                    </div>
                    <div className='col-12 col-sm-12 col-md-4 col-lg-4' >
                        <img src={blog3} style={{ width: "100%", height: "auto" }} />
                        <h3>Sweet Gifts</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce quis efficitur ligula, quis vehicula justo. Ut lacinia tortor nisl, et tempus lacus varius non. Phasellus a quam augue. Nulla interdum lorem semper sem pretium, eget mattis eros commodo. Sed consectetur metus tincidunt varius hendrerit. Nullam eu risus felis. Nunc aliquam.</p>
                    </div>
                </div>
            </div>
            <div style={{ backgroundColor: "#f0eeed" }}>
                <div className='container'>
                    <h2 className='text-center mb-5 pt-5'>Also available on</h2>
                    <div className='row mb-3'>
                        <div className='col-6 col-sm-6 col-md-3 col-lg-3 mb-5'>
                            <img src={amazonlogo} style={{ width: "70%", height: "auto" }} />
                        </div>
                        <div className='col-6 col-sm-6 col-md-3 col-lg-3 mb-5'>
                            <img src={swiggylogo} style={{ width: "70%", height: "auto" }} />
                        </div>
                        <div className='col-6 col-sm-6 col-md-3 col-lg-3 mb-5'>
                            <img src={zommatologo} style={{ width: "70%", height: "auto" }} />
                        </div>
                        <div className='col-6 col-sm-6 col-md-3 col-lg-3 mb-5'>
                            <img src={swiggyinstamartlogo} style={{ width: "70%", height: "auto" }} />
                        </div>
                    </div>
                </div>
            </div>


        </>

    )
}

export default Home