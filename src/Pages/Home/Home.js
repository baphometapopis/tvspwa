// Home.js
import React, { useCallback, useEffect, useState } from "react";
import Select from "react-select";
import "./Home.css"; // Import the CSS file
import Header from "../../Component/Header/Header";
import { useNavigate } from "react-router-dom";
import { escalationListApi } from "../../Api/escalationListAPi";
import { decryptData } from "../../Utils/cryptoUtils";
import { toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const [escalationList, setEscalationList] = useState([]);
  const [loginData, setLoginData] = useState();
  const [userName, setUserName] = useState("");

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

  const fetchEscalationList = async () => {
    const localData = localStorage.getItem("LoggedInUser");
    if (localData !== null || localData !== undefined) {
      const decryptdata = decryptData(localData);
      setLoginData(decryptdata);
      setUserName(`${decryptdata?.first_name}${decryptdata?.last_name} `);

      console.log(decryptdata.id);
      const data = await escalationListApi(decryptdata?.id);
      if (data?.status) {
        setEscalationList(data.data);
      } else {
        toast.error(data?.message, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }
    }
  };
  const checkLoginStatus = useCallback(async () => {
    const data = await localStorage.getItem("LoggedInUser");
    if (data === null || data === undefined) {
      navigate("/");
    } else {
      navigate("/Home");
    }
  }, [navigate]);
  useEffect(() => {
    const handleBack = () => {
      // Replace the current entry in the navigation stack with the home screen
      navigate("/Home", { replace: true });
    };

    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, [navigate]);
  useEffect(() => {
    checkLoginStatus();
    fetchEscalationList();
  }, [checkLoginStatus]);

  return (
    <div className="Homecnt">
      <Header />
      <div
        className="user-info"
        style={{ backgroundColor: "red", width: "100%", padding: 20 }}
      >
        <span style={{ display: "inline-block" }}>
          <p style={{ fontWeight: "600", fontSize: "22px",color:'white',fontFamily:'sans-serif' }}>WelcomeBack,</p>
        </span>
        {userName}
      </div>
      <div className="homecnt2">
        {loginData?.admin_role === "escalation_maker" && (
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
        )}

        <div className="scrollable-container">
          {escalationList.length === 0 ? (
            <div className="no-cases-message">
              {loginData?.admin_role === "escalation_maker"
                ? "No pending cases"
                : "No cases have been assigned to you"}
            </div>
          ) : (
            <div className="card-container">
              {escalationList.map((item) => (
                <div className="homecard" key={item.id}>
                  <h4>Job ID: {item.job_id}</h4>
                  <p>Comment: {item.esclated_by_comment}</p>
                  <p>Status: {item.esclation_status}</p>
                  {/* Add more fields as needed */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
