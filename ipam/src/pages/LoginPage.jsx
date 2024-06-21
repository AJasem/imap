import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "../components/Login.jsx";
import MainNav from "../components/MainNav.jsx";
import Footer from "../components/Footer.jsx";
function LoginPage() {
  return (
    <div>
        <MainNav />
          <Login />
          <Footer />
        
    </div>
  );
}
export default LoginPage;
