// https://661545a02812521d6f7d97e0--lovely-otter-b1036e.netlify.app/sign-up
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
