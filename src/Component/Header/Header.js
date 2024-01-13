// Header.js

import React from "react";
import "./Header.css"; // Import the CSS file
// import avatarImage from "./avatar.jpg"; // Import your avatar image
// import searchIcon from "./search-icon.png"; // Import your search icon
import Logo from '../../Assets/Logo/TVS-Motor-Company.png'

const Header = () => {
  return (
    <div className="header">
      <div className="avatar-container">
        <img src={Logo} alt="Avatar" className="Logo" />
      </div>
      <div className="search-container">
        <input type="text" placeholder="Search" className="search-input" />
        <img src={'https:/sdsds'}  alt="Search" className="search-icon" />
      </div>
    </div>
  );
};

export default Header;
