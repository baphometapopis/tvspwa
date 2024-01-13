// Dashboard.js

import React, { useEffect, useState } from "react";
import "./dashboard.css"; // Import the CSS file
import Header from "../../Component/Header/Header";
const Dashboard = () => {
  const [isModalOpen, setModalOpen] = useState(false);

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
  ];
  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  useEffect(() => {}, [isModalOpen]);
  return (
    <div className="dashboardcnt">
      <Header />

      <div className="info-container">
        <div className="info-box">
          <div style={{ display: "flex", padding: "20px" }}>
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
          <button className="escalatebutton" onClick={openModal} type="submit">
            Escalate
          </button>
        </div>

        <div className=" scrollable-container" style={{ height: "100%" }}>
          <div className="card-container">
            {data.map((item) => (
              <div className="card" key={item.id}>
                <h4>{item.title}</h4>
                {/* Add more content here based on your item properties */}
              </div>
            ))}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Add your modal content here */}
            <h2>Escalation Modal</h2>
            <p>Modal content goes here...</p>
            <button onClick={closeModal}>Close Modal</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
