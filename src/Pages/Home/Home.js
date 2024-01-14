// Home.js
import React, { useCallback, useEffect, useState } from "react";
import Select from "react-select";
import "./Home.css"; // Import the CSS file
import Header from "../../Component/Header/Header";
import { useNavigate } from "react-router-dom";
import { escalationListApi } from "../../Api/escalationListAPi";
import { decryptData } from "../../Utils/cryptoUtils";
import Tooltip from "@mui/material/Tooltip";

import { toast } from "react-toastify";
import { getEscalationCataegoryList } from "../../Api/getEscalationcategorylist";
import supportAgent from "../../Assets/Icons/supportAgent.png";
import { searchEscalationData } from "../../Api/searchEscalationData";
const Home = () => {
  const navigate = useNavigate();
  const [escalationList, setEscalationList] = useState([]);
  const [categoryList, setcategoryList] = useState([]);

  const [loginData, setLoginData] = useState();
  const [userName, setUserName] = useState("");
  const [error, setError] = useState(null);

  const searchOptions = [
    { value: "jobid", label: "Job Id" },
    { value: "customer_mobile_no", label: "Phone Number" },
    { value: "policy_no", label: "Policy No" },
    { value: "frame_no", label: "Chassis Number" },
    { value: "registration_no", label: "Vehicle Number" },
  ];

  const [selectedOption, setSelectedOption] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const findCategoryname = (category_id) => {
    const answers = categoryList
      .filter((item) => item.id === category_id)
      .map((item) => item.answer);

    return answers;
  };

  const handleSearch = async () => {
    // Check if the selected option is null or the searchQuery is empty
    if (!selectedOption || !searchQuery.trim()) {
      // Set an error state
      setError("Please select an option and enter a valid search term.");
      return;
    }

    // Reset error state if no error
    setError(null);

    // Continue with your search logic
    const searchdata = await searchEscalationData(
      selectedOption?.value,
      searchQuery
    );
    if (searchdata?.status) {
      navigate("MakerEscalatePage", { state: { searchData: searchdata } });

      toast.success(searchdata?.message, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    } else {
      toast.error(searchdata?.message, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }

    console.log(`Searching for ${selectedOption?.value}: ${searchQuery}`);
  };

  const fetchEscalationList = async () => {
    const categorydata = await getEscalationCataegoryList();
    console.log(categorydata);
    if (categorydata.status) {
      setcategoryList(categorydata.data);
    }
    const localData = localStorage.getItem("LoggedInUser");
    if (localData !== null || localData !== undefined) {
      const decryptdata = decryptData(localData);
      setLoginData(decryptdata);
      setUserName(`${decryptdata?.first_name}${decryptdata?.last_name} `);

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
  const handleInputFocus = () => {
    // Clear the error state when the input is focused
    setError(null);
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
          <p
            style={{
              fontWeight: "600",
              fontSize: "22px",
              color: "white",
              fontFamily: "sans-serif",
            }}
          >
            WelcomeBack,
          </p>
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
              onChange={(selected) => {
                setSelectedOption(selected);
                handleInputFocus();
              }}
            />
            <Tooltip title={error || ""} arrow open={Boolean(error)}>
              <input
                type="text"
                className="search-input"
                placeholder={`Enter ${selectedOption?.label || "search term"}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleInputFocus} // Clear error when input is focused
              />
            </Tooltip>
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
                <div
                  className="homecard"
                  key={item.id}
                  onClick={() => {
                    navigate("/chat", {
                      state: { escdata: item },
                    });
                  }}
                >
                  <div
                    style={{
                      // backgroundColor: "red",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <p className="jobid">#{item.id}</p>
                    <p className="statustag">{item.esclation_status}</p>
                  </div>
                  <p>{findCategoryname(item.esclated_by_category_id)}</p>
                  <p className="escalatedby">by {item.from_name}</p>
                  <p>{item.esclated_by_comment}</p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <img
                        src={supportAgent}
                        alt="Logo"
                        className="supporticon"
                      />
                      <p className="tobabel"> {item.to_name}</p>
                    </span>

                    <p className="creationdate">
                      {new Date(item.created_at).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                    </p>
                  </div>
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
