// Dashboard.js

import React from "react";
import "./dashboard.css"; // Import the CSS file
import Header from "../../Component/Header/Header";
import Logo from "../../Assets/Logo/TVS-Motor-Company.png";
const Dashboard = () => {
  const data = [
    { id: 1, title: "Item 1" },
    { id: 2, title: "Item 2" },
    { id: 3, title: "Item 3" },
    { id: 3, title: "Item 3" },
    { id: 3, title: "Item 3" },
    { id: 3, title: "Item 3" },
    { id: 3, title: "Item 3" },
    { id: 3, title: "Item 3" },
    { id: 3, title: "Item 3" },
    { id: 3, title: "Item 3" },
    { id: 3, title: "Item 3" },
    { id: 3, title: "Item 3" },
    { id: 3, title: "Item 3" },

    // Add more items as needed
  ];
  return (
    <div className="dashboardcnt">
      <Header />

      <div className="info-container">
        <div className="info-box" style={{ display: "flex", padding: "20px" }}>
          <div className="infolabels-container">
            <div className="infolabel">Name:</div>
            <div className="infolabel">Phone No:</div>
            <div className="infolabel">Email:</div>
            <div className="infolabel">Chassis No:</div>
            <div className="infolabel">Vehicle No:</div>
            <div className="infolabel">Registration Date:</div>
            <div className="infolabel">Engine Name:</div>
          </div>
          <div className="values-container">
            <div className="value">John Doe</div>
            <div className="value">+1234567890</div>
            <div className="value">john@example.com</div>
            <div className="value">ABC123456DEF789</div>
            <div className="value">TN1234</div>
            <div className="value">January 1, 2022</div>
            <div className="value">XYZ Engine</div>
          </div>
        </div>

        <div
          className="info-box scrollable-container"
          style={{ height: "100%" }}
        >
          <h3>Info Box 2</h3>
          <p>Placeholder content for the second info box.</p>
          <ul>
            {data.map((item) => (
              <li key={item.id}>{item.title}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
