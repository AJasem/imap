import React from "react";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SignUp from "../components/SignUP.jsx";
import MainNav from "../components/MainNav.jsx";

function SignUpPage() {
  return (
    <div>
          <MainNav />
          <SignUp />
      
    </div>
  );
}
export default SignUpPage;
