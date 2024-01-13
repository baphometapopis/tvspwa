// Dashboard.js

import React from "react";
import "./dashboard.css"; // Import the CSS file
import Header from "../../Component/Header/Header";
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

      <div className="info-container" style={{flexDirection:'row'}}>
        <div className="info-box">
          <h3>Info Box 1</h3>
          
          <p>Placeholder content for the first info box.</p>
          <p>Placeholder content for the first info box.</p>
          <p>Placeholder content for the first info box.</p>
          <p>Placeholder content for the first info box.</p>
          <p>Placeholder content for the first info box.</p>
          <p>Placeholder content for the first info box.</p>
          <p>Placeholder content for the first info box.</p>
          <p>Placeholder content for the first info box.</p>
          <p>Placeholder content for the first info box.</p>
          <p>Placeholder content for the first info box.</p>
          <p>Placeholder content for the first info box.</p>
          <p>Placeholder content for the first info box.</p>
          <p>Placeholder content for the first info box.</p>
          <p>Placeholder content for the first info box.</p>
          <p>Placeholder content for the first info box.</p>
          <p>Placeholder content for the first info box.</p>
          <p>Placeholder content for the first info box.</p>
          <p>Placeholder content for the first info box.</p>
          <p>Placeholder content for the first info box.</p>
          <p>Placeholder content for the first info box.</p>
          <p>Placeholder content for the first info box.</p>
          <p>Placeholder content for the first info box.</p>
          <p>Placeholder content for the first info box.</p>
          <p>Placeholder content for the first info box.</p>
          <p>Placeholder content for the first info box.</p>
          <p>Placeholder content for the first info box.</p>
          <p>Placeholder content for the first info box.</p>


       
      
          
          
          

        </div>

        <div className="info-box scrollable-container" style={{height:'100%'}}>
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
