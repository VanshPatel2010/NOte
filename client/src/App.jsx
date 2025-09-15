import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
// import LogHome from "./pages/loggedIn";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import EmailVerify from "./pages/EmailVerify";
import Dashboard from "./pages/loggedIn";
import Admin from "./pages/admin";
import { ToastContainer } from 'react-toastify';const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/loggedIn" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
};

export default App;
