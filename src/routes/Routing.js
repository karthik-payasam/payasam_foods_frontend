import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'



import Layout from '../components1/Layout/Layout'
import Home from '../features/home/pages/Home'
import Category from '../features/product/pages/Category'
import ProductDetails from '../features/product/pages/ProductDetails'
import SignIn from '../features/auth/pages/Signin'
import SignUp from '../features/auth/pages/Signup'
import AccountData from '../features/account/pages/AccountData'
import AccountDetails from '../features/account/pages/AccountDetails'
import Search from '../features/product/pages/Search'
import Cart from '../features/cart/pages/Cart'
import OtpUi from '../features/auth/pages/OtpUI'
import OrderConfirmPage from '../features/product/pages/OrderConfirmPage'
import NotFound from './NotFound'
import Checkout from '../features/cart/pages/Checkout'






function Routing() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='/category/:id/:name' element={<Category />} />
            <Route path='/category/:id/subcategory/:sub_id/:name' element={<Category />} />
            <Route path='/productDetails/:id' element={<ProductDetails />} />
            <Route path='/login' element={<SignIn />} />
            <Route path='/register' element={<SignUp />} />
            <Route path='/account' element={<AccountData />}>
              <Route path='/account/AccountDetails' element={<AccountDetails />} />
            </Route>
            {/* <Route path='/admin' element={<AdminLayout />}>
              <Route path='/admin/addproduct' element={<Products />} />
            </Route> */}
            <Route path='/Search' element={<Search />} />
            <Route path='/Cart' element={<Cart />} />

          </Route>
          <Route path='*' element={<NotFound />} />
          <Route path='/OtpData' element={<OtpUi />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/orderStatus/:paymentId/:order_id' element={<OrderConfirmPage />} />

        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default Routing