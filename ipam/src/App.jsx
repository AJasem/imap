// https://6614038e9c779a0080699e4d--roaring-lollipop-143737.netlify.app/

import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MailBox from "./components/MailBox.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<LoginPage />} />
          <Route path="/sign-in" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/mailbox" element={<MailBox />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </div>
    </Router>
  );
}

function NoMatch() {
  return <h2>404 Not Found</h2>;
}

export default App;
