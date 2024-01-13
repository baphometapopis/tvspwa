// Header.js

import React from "react";
import "./Header.css"; // Import the CSS file
// import avatarImage from "./avatar.jpg"; // Import your avatar image
// import searchIcon from "./search-icon.png"; // Import your search icon
import Logo from "../../Assets/Logo/TVS-Motor-Company.png";
import avatarImage from "../../Assets/Image-60.png"; // Import your avatar image


const Header = () => {
  return (
    <div className="header">
      <div className="avatar-container">
        <img src={Logo} alt="Logo" className="Logo" />
      </div>
      <div className="search-container">
        <img src={avatarImage} alt="Avatar" className="avatar" />
      </div>
    </div>
  );
};

export default Header;
