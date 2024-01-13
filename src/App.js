// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Dashboard from "./Pages/Dashboard/Dashboard";
import "./App.css";

// const Login = () => <h2>Login Page</h2>;
// const Dashboard = () => <h2>Dashboard Page</h2>;
const List = () => <h2>List Page</h2>;

function App() {
  return (
    <Router>
      <div className="App">
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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/list" element={<List />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
