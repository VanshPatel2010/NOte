import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import { useContext } from "react";
const Navbar = () => {
  const { userData } = useContext(AppContent);
  const navigate = useNavigate();

  const handleNavigation = () => {
    // 1. Check if user is NOT logged in FIRST
    if (!userData) {
      navigate("/login");
    } 
    // 2. Then, check the roles of the logged-in user
    else if (userData.role === "admin") {
      navigate("/admin");
    } 
    else if (userData.role === "user") {
      navigate("/loggedIn");
    }
  };

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
      <img src={assets.logo} alt="Logo" className='w-28 sm:w-32' />
      <button 
        onClick={handleNavigation} 
        className='flex items-center gap-2 border-2 border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all bg-white'
      >
        Login <img src={assets.arrow_icon} alt="arrow icon" />
      </button>
    </div>
  );
};

export default Navbar;
