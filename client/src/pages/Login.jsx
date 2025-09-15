import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "../api/axiosConfig.js";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("Sign up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const Navigate = useNavigate();

  const { backendURL, setIsLoggedIn, setUserData } = useContext(AppContent);

  // ✅ fetchUsers function
const fetchUsers = async (tenants) => {
  try {
    const groupQuery = `?group=${encodeURIComponent(tenants)}`;
    const res = await axios.get(`${backendURL}api/admin/allUsers${groupQuery}`, {
      withCredentials: true,
    });

    console.log("Admin API response:", res.data); // 🔍 debug line

    if (res.data?.success) {
      // adjust based on response shape
      const users = res.data.data || res.data.users || [];
      localStorage.setItem("adminUsers", JSON.stringify(users));
    } else {
      toast.error(res.data?.message || "Failed to load users");
    }
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Failed to load users");
  }
};


  const onSubmitHandler = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    try {
      if (state === "Sign up") {
        const res = await axios.post(backendURL + "api/auth/register", {
          name,
          email,
          password,
        });

        if (res.data.success) {
          setIsLoggedIn(true);
          setUserData(res.data.data);
          Navigate("/loggedIn");
        } else {
          toast.error(res.data.message);
        }
      } else {
        const res = await axios.post(backendURL + "api/auth/login", {
          email,
          password,
        });

        if (res.data.success) {
          setIsLoggedIn(true);
          setUserData(res.data.data);

          // ✅ if role is admin, fetch users before navigating
          if (res.data.data.role === "admin") {
            console.log("Admin API response:", res.data);
            await fetchUsers(res.data.data.tenant);
            Navigate("/admin");
          } else {
            Navigate("/loggedIn");
          }
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
          {state === "Sign up" ? "Create Account" : "Login"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "Sign up"
            ? "Create Your Account"
            : "Login to your account"}
        </p>
        <form onSubmit={onSubmitHandler}>
          {state === "Sign up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="bg-transparent outline-none"
                type="text"
                placeholder="Full Name"
                required
              />
            </div>
          )}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-transparent outline-none"
              type="email"
              placeholder="Email"
              required
            />
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="bg-transparent outline-none"
              type="password"
              placeholder="Password"
              required
            />
          </div>
          <p
            onClick={() => Navigate("/reset-password")}
            className="mb-4 text-indigo-500 cursor-pointer"
          >
            Forgot Password?
          </p>
          {state === "Sign up" ? (
            <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to bg-indigo-900 text-white font-medium">
              Sign Up
            </button>
          ) : (
            <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to bg-indigo-900 text-white font-medium">
              Login
            </button>
          )}
        </form>
        {state === "Sign up" ? (
          <p className="text-gray-400 text-center text-xs mt-4">
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-blue-400 cursor-pointer underline"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-4">
            Don't have an account?{" "}
            <span
              onClick={() => setState("Sign up")}
              className="text-blue-400 cursor-pointer underline"
            >
              SignUp here
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
