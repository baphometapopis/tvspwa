// src/utils/authUtils.js
export const isLoggedIn = () => {
    return !!localStorage.getItem("loggedInUser");
  };
  