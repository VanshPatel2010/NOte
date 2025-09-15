import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import axios from 'axios'
import { AppContent } from '../context/AppContext'
import { toast } from 'react-toastify'

const ResetPassword = () => {
  const Navigate = useNavigate();
  const [state, setState] = useState("otp");
  const { backendURL, setIsLoggedIn, setUserData } = useContext(AppContent);
  const [email, setEmail] = useState("");
  const [newPassword, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const onSubmitHandler = async (e) => {
  e.preventDefault();
  axios.defaults.withCredentials = true;
  try {
    if (state === "otp") {
      const res = await axios.post(backendURL + "/api/auth/send-reset-otp", {
        email
      });

      if (res.data.success) {
        setState("set_password")
      } else {
        toast.error(res.data.message);
      }
    } else {
      const res = await axios.post(backendURL + "/api/auth/reset-password", {
        email,
        newPassword,
        otp,
      });

      if (res.data.success) {
        setIsLoggedIn(true);
        setUserData(res.data.data);
        Navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
          <img
            onClick={() => Navigate("/")}
            src={assets.logo}
            alt=""
            className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
          />
          <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
            <h2 className="text-3xl font-semibold text-white text-center mb-3">
              Reset Password
            </h2>
            
            <form onSubmit={onSubmitHandler}>
              {state === "otp" && (
               <> <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                  <img src={assets.lock_icon} alt="" />
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className="bg-transparent outline-none"
                    type="text"
                    placeholder="email"
                    required
                  />
                  
                </div>
                <button onClick={onSubmitHandler}>Sent Otp</button></>
              )}
            {state === "set_password" && (
              <>
                <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                  <img src={assets.mail_icon} alt="" />
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className="bg-transparent outline-none"
                    type="email"
                    placeholder="email"
                    required
                  />
                </div>
                <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                  <img src={assets.lock_icon} alt="" />
                  <input
                    onChange={(e) => setOtp(e.target.value)}
                    value={otp}
                    className="bg-transparent outline-none"
                    type="number"
                    placeholder="set otp"
                    required
                  />
                </div>
                <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                  <img src={assets.lock_icon} alt="" />
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={newPassword}
                    className="bg-transparent outline-none"
                    type="password"
                    placeholder="Password"
                    required
                  />
                </div>
                <button onClick={onSubmitHandler}>Reset Password</button>
              </>
            )}
              
              
            </form>
            
          </div>
        </div>
  )
}

export default ResetPassword