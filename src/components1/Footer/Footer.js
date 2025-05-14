import React from 'react'

function Footer() {
  return (
    <div>
      <div style={{ backgroundColor: "#c52f24" }}>
        <div className='container'>
          <div className='row footer-icon'>
            <div className='col-6 col-sm-6 col-md-3 col-lg-3 text-center'>
              <i class="bi bi-truck"></i>
              <h6>IN / US</h6>
            </div>
            <div className='col-6 col-sm-6 col-md-3 col-lg-3 text-center'>
              <i class="bi bi-star"></i>
              <h6>Freshly Made</h6>
            </div>
            <div className='col-6 col-sm-6 col-md-3 col-lg-3 text-center'>
              <i class="bi bi-gift"></i>
              <h6>Gifting</h6>
            </div>
            <div className='col-6 col-sm-6 col-md-3 col-lg-3 text-center'>
              <i class="bi bi-geo-alt"></i>
              <h6>Find a Store</h6>
            </div>
          </div>
        </div>
      </div>
      <div style={{ backgroundColor: "#333333" }}>
        <div className='container-fluid row footer p-3 '>
          <div className='col-12 col-sm-12 col-md-4 col-lg-4 text-light me-2'>
            <p>Ah, the flavours of home… the taste of tradition! Our grandmothers used to spend hours on feeding us, preparing special pickles, sweets, snacks and savouries for our summer vacations.</p>

          </div>
          <div className='col-12 col-sm-12 col-md-2 col-lg-2 text-light me-2'>
            <h6>Shop</h6>
            <ul>
              <li>Sweets</li>
              <li>Namkeen</li>
              <li>Pickle</li>
              <li>Daily Essential</li>
              <li>Chilli Powder</li>
              <li>Gift Packs</li>
            </ul>
          </div>
          <div className='col-12 col-sm-12 col-md-2 col-lg-2 text-light me-4'>
            <h6>Important Links</h6>
            <ul>
              <li>Privacy Policy</li>
              <li>Shipping Policy</li>
              <li>Cancellation Policy</li>
              <li>Delivery Policy</li>
              <li>About Us</li>
              <li>Contact Us</li>
              <li>FAQs</li>
            </ul>

          </div>
          <div className='col-12 col-sm-12 col-md-3 col-lg-3 text-light'>
            <h6>Newsletter</h6>
            <p>Sign up for exclusive offers, original stories, activism awareness, events and more.</p>
            <input type='text' placeholder='Enter Text' /><br></br><br></br>
            <button className='bg-danger text-light p-2'>SignUp</button>
          </div>
        </div>
        <hr style={{ backgroundColor: "white", height: "1px", border: "none" }} />
        <p className='text-light text-center'>© 2025 payasamfoods. Powered by Payasam Flavours</p>
      </div>

    </div>
  )
}

export default Footer