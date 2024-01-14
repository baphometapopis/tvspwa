// src/App.js
import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login/Login";
import MakerEscalatePage from "./Pages/MakerEscalatePage/MakerEscalatePage";
import "./App.css";
import Home from "./Pages/Home/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const loggedinuser = localStorage.getItem("LoggedInUser");
  console.log(loggedinuser);
  console.log(loggedinuser ? "component" : "login");
  useEffect(() => {
    const loggedinuser = localStorage.getItem("LoggedInUser");
    console.log(loggedinuser);
    console.log(loggedinuser ? "component" : "login");
  }, [loggedinuser]);

  return (
    <Router>
      <div className="App">
        <ToastContainer />

        <Routes>
          <Route path="/MakerEscalatePage" element={<MakerEscalatePage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
