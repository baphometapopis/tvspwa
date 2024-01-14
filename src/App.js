// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login/Login";
import MakerEscalatePage from "./Pages/MakerEscalatePage/MakerEscalatePage";
import "./App.css";
import Home from "./Pages/Home/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const List = () => <h2>List Page</h2>;

function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer />

        {/* <nav>
          <ul>
            <li>
              <Link to="/">Login</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/list">List</Link>
            </li>
          </ul>
        </nav> */}

        <Routes>
          <Route path="/MakerEscalatePage" element={<MakerEscalatePage />} />
          <Route path="/Home" element={<Home />} />

          <Route path="/list" element={<List />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
