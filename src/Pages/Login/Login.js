// Login.js

import React, { useState } from "react";
import "./login.css"; // Import the CSS file
// import { useNavigate } from "react-router-dom";

const Login = () => {

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    let validationErrors = {};

    if (!formData.username.trim()) {
      validationErrors.username = "Username is required";
    }

    if (!formData.password.trim()) {
      validationErrors.password = "Password is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Add your authentication logic here (e.g., API call, etc.)
    handleLoginAPi();
    console.log("Form submitted:", formData);
  };

  const handleLoginAPi = async () => {
    // const loginResponse = await login(formData.username, formData.password);
    // console.log(loginResponse);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic " + btoa("indicosmic:indicosmic"));
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("email_id", "sush.rokade@gmail.com");
    urlencoded.append("password", "sush.rokade@gmail.com");

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    fetch("https://www.tvsservice.com/Escalation_api/login", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));

    // Navigation("/MakerEscalatePage");
  };

  return (
    <div className="logincontainer">
      <div
        style={{
          backgroundColor: "red",
          display: "flex",
          justifyContent: "center",
          padding: "10px",
        }}
      >
        <h2 style={{ fontSize: "12px", color: "white" }}>
          TVS Escalation Login
        </h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div style={{ padding: "20px" }}>
          <div className="inputContainer">
            <input
              className="input"
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
            />
            {errors.username && (
              <span className="error">{errors.username}</span>
            )}
          </div>
          <div className="inputContainer">
            <input
              className="input"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
            />
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button className="button" type="submit">
              Login
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
