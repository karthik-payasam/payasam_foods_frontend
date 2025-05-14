import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';



import { useAuthContext } from '../../features/auth/context/AuthContext';
import axios from 'axios';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import ScroolingHead from '../Header/ScroolingHead';


function Layout() {
  const { login, setLogin, setUserData } = useAuthContext();
  useEffect(() => {
    console.log("inside layout")
    if (!!localStorage.getItem('ProfileData')) {//if data is there then go to the if condition inside.
      setLogin(true)
      const fetchUserData = async () => {
        try {
          const token = localStorage.getItem("ProfileData");
          const response = await axios.get("http://localhost:9090/user/api/ProfileData", {
            headers: { Authorization: `Bearer ${token}` }
          })
          console.log("AccountDetailsDara", response.data.ProfileDetails);

          setUserData(response.data.ProfileDetails);
        }
        catch (err) {
          // setError("Failed to fetch account details. Please try again.");
        }
      };
      fetchUserData();
    }
  }, [login])
  return (
    <div>
      <ScroolingHead />
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default Layout;
