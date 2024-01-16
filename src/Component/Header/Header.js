import React, { useState } from "react";
import "./Header.css"; // Import the CSS file
import Logo from "../../Assets/Logo/TVS-Motor-Company.png";
import avatarImage from "../../Assets/Image-60.png"; // Import your avatar image
import { useNavigate } from "react-router-dom";

const Header = ({ username }) => {
  console.log(username, "ihkugjfhgxdghgjukhilj");
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleAvatarClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    // Clear local storage and perform logout actions
    localStorage.clear();
    navigate("/");

    // You may want to redirect the user to the login page or perform other logout actions here
  };

  return (
    <div className="header">
      <div className="avatar-container" >
        <img
          src={Logo}
          alt="Logo"
          className="Logo"
          onClick={handleAvatarClick}
        />
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <div
              className="menu-item"
              onClick={() => console.log("Username clicked")}
            >
              {username}
            </div>
            <div className="menu-item" onClick={handleLogout}>
              Logout
            </div>
          </div>
        )}
      </div>
      <div className="search-container">
        <img
          src={avatarImage}
          alt="Avatar"
          className="avatar"
          onClick={handleAvatarClick}
        />
      </div>
    </div>
  );
};

export default Header;
