import React, { useCallback, useEffect, useState } from 'react'
import navbar from '../../assets/images/navbar-logo.gif'
import './Header.css'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../features/auth/context/AuthContext'
import axios from 'axios';
import { useCartContext } from '../../features/cart/context/CartContext';
function Header() {
  const { state: { cart } } = useCartContext();
  const qtyData = cart.reduce((acc, product) => acc + product.qty, 0);
  const navigate = useNavigate();
  const { login, userData, setLogin } = useAuthContext()

  const [Category, setCategory] = useState([]);
  // const { setLogin, setRole } = useAuthContext();
  useEffect(() => {
    const CategoryData = async () => {
      const response = await axios.get("http://localhost:9090/user/api/fetch/getCategoryAndSubCategories")
      console.log("category", response.data.CategoryData);

      setCategory(response.data.CategoryData);


    }
    CategoryData();

  }, [])
  const handleProfileClick = useCallback(() => {
    console.log("Token:", login);
    if (login) {
      console.log("Navigating to Account Page...");
      navigate("/account/AccountDetails");
    } else {
      console.log("Navigating to Sign Up Page...");
      navigate("/login");
    }
  }, [login])
  const removeTokenData = () => {
    localStorage.removeItem("ProfileData");
    setLogin(false);
    navigate("/")
  }
  return (
    <div className='nav-sticky'>
      <nav className='navbar navbar-expand-lg bg-warning'>
        <button className='navbar-toggler' data-bs-toggle="offcanvas" data-bs-target="#navId">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div className='nav-logo'><Link to="/"><img src={navbar} alt='no-nav-image' /></Link></div>
        <div className='offcanvas offcanvas-start' id="navId">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasNavbarLabel">PAYASAM-PRODUCTS</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">
            <ul className='navbar-nav mx-auto'>
              {Category.map((categoryData, index) => (
                <li key={index} className='navbar-item dropdown'>
                  <Link

                    className={`nav-link ${categoryData.subCategory?.length > 0 ? 'dropdown-toggle' : ''}`}
                    to={`/category/${categoryData.category_id}/${categoryData.name}`}
                  >
                    {categoryData.name}
                  </Link>
                  {categoryData.subCategory?.length > 0 &&
                    <ul class="dropdown-menu">
                      {categoryData.subCategory.map((subCategoryData, subindex) => (
                        <li key={subindex}>
                          <Link
                            to={`/category/${categoryData.category_id}/subcategory/${subCategoryData.subcategory_id}/${subCategoryData.name}`}
                            className="dropdown-item"
                          >
                            {subCategoryData.name}
                          </Link>
                        </li>
                      ))}

                    </ul>
                  }
                </li>
              ))}

            </ul>
          </div>
        </div>
        <div className='nav-icons'>
          {!login ? (
            <i className="bi bi-person" onClick={handleProfileClick}></i>
          ) : (
            /* If user is logged in, show dropdown */
            <div className="btn-group">
              <button type="button" className="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                {userData?.first_name}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><button className="dropdown-item" onClick={handleProfileClick}>Profile</button></li>
                <li><button className="dropdown-item" onClick={removeTokenData}>Sign Out</button></li>
              </ul>
            </div>
          )}

          <Link to="/Search" className="text-decoration-none text-dark"><i class="bi bi-search"></i></Link>

          <Link to="/Cart" className="text-decoration-none text-dark position-relative d-inline-block"><i class="bi bi-cart"></i>
            {qtyData > 0 && < b className="position-absolute start-50 translate-middle-x badge rounded-pill bg-danger"
            >{qtyData}</b>
            }
          </Link>
        </div>
      </nav >

    </div >

  )
}

export default Header