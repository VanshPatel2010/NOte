import React from "react";
import { assets } from "../assets/assets";
// import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import { useContext } from "react";
// i want user data usin appcontext
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LogNavbar = () => {
  const { userData, setUserData, setIsLoggedIn, backendURL } =
    useContext(AppContent);
  const navigate = useNavigate();

  const handleLogout = async () => {
    // optional: inform backend to clear server-side session/cookie
    try {
      await axios.post(
        backendURL + "api/auth/logout",
        {},
        { withCredentials: true }
      );
    } catch (err) {
      // ignore network/errors for logout attempt
    }

    // clear client state & storage, then navigate to home
    setUserData(null);
    setIsLoggedIn(false);
    localStorage.removeItem("adminUsers");
    localStorage.removeItem("users");
    navigate("/");
  };

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={assets.logo} alt="" className="w-28 sm:w-32" />
      <div className="flex items-center gap-3 sm:gap-5">
        <p className="text-black text-lg sm:text-xl font-medium">
          {userData?.name}
        </p>
        <img
          src={assets.person_icon}
          alt=""
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-black"
        />
        <button
          onClick={handleLogout}
          className="ml-3 px-3 py-1 bg-red-500 text-white rounded-full text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default LogNavbar;
