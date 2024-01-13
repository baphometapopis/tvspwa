// Dashboard.js

import React from "react";
import "./dashboard.css"; // Import the CSS file
import Header from "../../Component/Header/Header";
const Dashboard = () => {
  return (
    <div className="dashboardcnt">
      
      <Header />


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
