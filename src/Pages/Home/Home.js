// Home.js
import React, { useState } from "react";
import Select from "react-select";
import "./Home.css"; // Import the CSS file
import Header from "../../Component/Header/Header";

const Home = () => {
  const data = [
    { id: 1, title: "Item 1" },
    { id: 2, title: "Item 2" },
    { id: 3, title: "Item 3" },
    { id: 4, title: "Item 4" },
    { id: 4, title: "Item 4" },
    { id: 4, title: "Item 4" },

  ];

  const searchOptions = [
    { value: "Name", label: "Name" },
    { value: "Phone Number", label: "Phone Number" },
    { value: "Email", label: "Email" },
    { value: "Chassis Number", label: "Chassis Number" },
    { value: "Vehicle Number", label: "Vehicle Number" },
  ];

  const [selectedOption, setSelectedOption] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    // Handle the search logic based on selectedOption and searchQuery
    console.log(`Searching for ${selectedOption?.value}: ${searchQuery}`);
  };

  return (
    <div className="Homecnt">
      <Header />

      <div className="homecnt2">
          <div className="homesearch-container">
            <Select
              className="search-dropdown"
              options={searchOptions}
              isClearable
              placeholder="Select an option"
              value={selectedOption}
              onChange={(selected) => setSelectedOption(selected)}
            />
            <input
              type="text"
              className="search-input"
              placeholder={`Enter ${selectedOption?.label || "search term"}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-button" onClick={handleSearch}>
              Search {selectedOption?.label || ""}
            </button>
          </div>

          <div className="scrollable-container" style={{ height: "100%" }}>
                <div className="card-container">
                    {data.map((item) => (
                        <div className="homecard" key={item.id}>
                            <h4>{item.title}</h4>
                        </div>
                    ))}
                </div>
             </div>
      </div>
    </div>
  );
};

export default Home;
