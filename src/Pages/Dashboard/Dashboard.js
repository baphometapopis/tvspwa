// Dashboard.js

import React from "react";
import "./dashboard.css"; // Import the CSS file

const Dashboard = () => {
  return (
    <div className="j">
      <div className="header">
        <div>
          <img
            className="search-icon"
            src="search-icon.png"
            alt="Search Icon"
          />
          Dashboard
        </div>
        <img
          className="avatar"
          src={
            "https://in.images.search.yahoo.com/search/images?p=sample+image&fr=mcafee&type=E210IN826G0&imgurl=http%3A%2F%2Fwww.ricoh-imaging.co.jp%2Fenglish%2Fproducts%2Fxg-1%2Fex%2Fimg%2Fex-pic07.jpg#id=1&iurl=http%3A%2F%2Fwww.ricoh-imaging.co.jp%2Fenglish%2Fproducts%2Fxg-1%2Fex%2Fimg%2Fex-pic07.jpg&action=click"
          }
          alt="Avatar"
        />
      </div>

      <div className="info-container">
        <div className="info-box">
          <h3>Info Box 1</h3>
          <p>Placeholder content for the first info box.</p>
        </div>

        <div className="info-box">
          <h3>Info Box 2</h3>
          <p>Placeholder content for the second info box.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
