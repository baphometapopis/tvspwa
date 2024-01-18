// Home.js
import React, { useCallback, useEffect, useState } from "react";
import Select from "react-select";
import "./Home.css"; // Import the CSS file
import Header from "../../Component/Header/Header";
import { useNavigate } from "react-router-dom";
import { escalationListApi } from "../../Api/escalationListAPi";
import { decryptData } from "../../Utils/cryptoUtils";
import Tooltip from "@mui/material/Tooltip";
// import chat from "../../Assets/Icons/chat.png";
import viewData from "../../Assets/Icons/viewData.png";
import chassisImg from "../../Assets/Icons/chassis.png";
import EngineImg from "../../Assets/Icons/engine.png";
import phoneImg from "../../Assets/Icons/phone.png";

import filter from "../../Assets/Icons/filter.png";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { getEscalationCataegoryList } from "../../Api/getEscalationcategorylist";
import supportAgent from "../../Assets/Icons/supportAgent.png";
import { searchEscalationData } from "../../Api/searchEscalationData";
import ReactDatePicker from "react-datepicker";
const Home = () => {
  const navigate = useNavigate();
  const [escalationList, setEscalationList] = useState([]);
  const [filterType, setFilterType] = useState("Pending");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loginData, setLoginData] = useState();
  const [userName, setUserName] = useState("");
  const [error, setError] = useState(null);
  const [timeDifference, setTimeDifference] = useState("");

  const searchOptions = [
    { value: "jobid", label: "Job Id" },
    { value: "customer_mobile_no", label: "Phone Number" },
    { value: "policy_no", label: "Policy No" },
    { value: "frame_no", label: "Chassis Number" },
    { value: "registration_no", label: "Vehicle Number" },
  ];
  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleFilter = () => {
    // Handle the selected date range, you can perform actions here
    console.log("Selected Date Range:", startDate, endDate);
    const filterdata = {
      start_date: startDate,
      end_date: endDate,
      status_id: filterType,
    };
    fetchEscalationList("filter", filterdata);

    // Close the modal
    handleModalClose();
  };

  const [selectedOption, setSelectedOption] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (prop, id) => {
    console.log(prop, id);
    // Check if the selected option is null or the searchQuery is empty
    if (prop !== "ViewDocument") {
      if (!selectedOption || !searchQuery.trim()) {
        // Set an error state
        setError("Please select an option and enter a valid search term.");
        return;
      }
    }

    // Reset error state if no error
    setError(null);

    const searchdata = await searchEscalationData(
      prop === "ViewDocument" ? searchOptions[0]?.value : selectedOption?.value,
      prop === "ViewDocument" ? id : searchQuery,
      loginData?.id
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
      setSelectedOption(null);
      setSearchQuery("");
    }

    console.log(`Searching for ${selectedOption?.value}: ${searchQuery}`);
  };

  const fetchEscalationList = useCallback(
    async (param, filterdata) => {
      console.log(filterdata, "this is the filtereddata");
      const categorydata = await getEscalationCataegoryList();
      console.log(categorydata);

      if (categorydata?.status) {
      }

      const localData = localStorage.getItem("LoggedInUser");

      if (localData !== null || localData !== undefined) {
        const decryptdata = decryptData(localData);
        setLoginData(decryptdata);
        setUserName(`${decryptdata?.first_name}  ${decryptdata?.last_name} `);

        const finalfilterData = {
          ...filterdata,
          user_id: decryptdata?.id,
        };

        const data = await escalationListApi(finalfilterData);

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
    },
    [setLoginData, setUserName, setEscalationList]
  );

  const handleInputFocus = () => {
    // Clear the error state when the input is focused
    setError(null);
  };
  const calculateTimeDifference = (createDate) => {
    const now = new Date();
    const createDateObj = new Date(createDate);
    const timeDifference = now - createDateObj;

    // Calculate the difference in hours, minutes, and seconds
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    // Build the formatted string
    const formattedTime = `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    return formattedTime;
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
  }, [checkLoginStatus, fetchEscalationList]);
  useEffect(() => {
    // Update time difference for each item initially
    const initialTimeDifferences = escalationList.map((item) =>
      calculateTimeDifference(item.created_at)
    );
    setTimeDifference(initialTimeDifferences);

    // Set up interval to update time difference every second
    const intervalId = setInterval(() => {
      const updatedTimeDifferences = escalationList.map((item) =>
        calculateTimeDifference(item.job_create_date)
      );
      setTimeDifference(updatedTimeDifferences);
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [escalationList]);

  return (
    <div className="Homecnt">
      <Header username={userName} />
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
        {loginData?.esclation_type === "maker" && (
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
                onChange={(e) => {
                  const sanitizedValue = e.target.value?.replace(
                    /[^a-zA-Z0-9]/g,
                    ""
                  );
                  setSearchQuery(sanitizedValue);
                  // setSearchQuery(e.target.value);
                }}
                onFocus={handleInputFocus} // Clear error when input is focused
              />
            </Tooltip>
            <button className="search-button" onClick={handleSearch}>
              Search {selectedOption?.label || "All"}
            </button>
          </div>
        )}
        {isModalOpen && (
          <div className="modal">
            <div className="filtermodal-content">
              <h2>Filter Options</h2>
              <label className="date-picker-label">Filter Status</label>

              <select
                className="selectfilter"
                value={filterType}
                onChange={handleFilterChange}
              >
                {/* <option value="">All</option> */}

                <option value="Pending">Pending</option>
                <option value="WIP">WIP</option>
                <option value="Resolved">Resolved</option>
                <option value="Accepted">Accepted</option>
                <option value="Reopen">Reopen</option>
              </select>

              <div className="date-logo-container">
                {/* <img src={dateLogo} alt="Date Logo" className="date-logo" /> */}
              </div>

              <div className="date-picker-container">
                <div>
                  <label className="date-picker-label">Start Date</label>
                  <ReactDatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    placeholderText="Start Date"
                  />
                </div>
                <div>
                  <label className="date-picker-label">End Date</label>
                  <ReactDatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    placeholderText="End Date"
                  />
                </div>
              </div>

              <div className="button-container">
                <button className="apply-button" onClick={handleFilter}>
                  Apply
                </button>
                {/* <button onClick={handleModalClose}>Cancel</button> */}
              </div>
            </div>
          </div>
        )}
        <div className="filterHeader">
          <img
            src={filter}
            onClick={handleModalOpen}
            alt="Logo"
            className="viewData"
          />

          {/* <button onClick={handleModalOpen}>Open Modal</button> */}
        </div>
        <div className="scrollable-container " style={{ marginTop: "10px" }}>
          {escalationList.length === 0 ? (
            <div className="no-cases-message">
              {loginData?.admin_role === "escalation_maker"
                ? "No pending cases"
                : "No cases have been assigned to you"}
            </div>
          ) : (
            <div className="card-container">
              {escalationList.map((item, index) => (
                <div
                  className="homecard"
                  key={item.id}
                  style={{
                    backgroundColor:
                      item?.esclation_sub_type !== "icpl_sales"
                        ? "#ffe6e6"
                        : "",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <p className="jobid">#{item.job_id}</p>
                      <p className="escalatedby">by {item.from_name}</p>
                    </div>
                    <div style={{ flexDirection: "row", display: "flex" }}>
                      <img
                        src={viewData}
                        onClick={() => {
                          handleSearch("ViewDocument", item?.job_id);
                        }}
                        alt="Logo"
                        className="viewData"
                      />
                      <p
                        className="statustag"
                        style={{
                          backgroundColor:
                            item.esclation_status === "Pending"
                              ? "#e54a50" // Pending color
                              : item.esclation_status === "WIP"
                              ? "#eec75b" // WIP color
                              : item.esclation_status === "Resolved"
                              ? "#5d9db9" // Resolved color
                              : item.esclation_status === "Accepted"
                              ? "#6fb293" // Accepted color
                              : item.esclation_status === "Reopen"
                              ? "#d7Oe17" // Reopen color
                              : "white", // Default color for other cases
                        }}
                      >
                        {item.esclation_status}
                      </p>
                      <p
                        style={{
                          position: "absolute",
                          fontSize: "12px",
                          top: "32px",
                          right:'15px'
                        }}
                      >
                        {timeDifference[index]}
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      paddingTop: "5px",
                      paddingBottom: "5px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <img src={chassisImg} alt="Logo" className="chassisImg" />
                      <img src={phoneImg} alt="Logo" className="phoneImg" />
                      <img src={EngineImg} alt="Logo" className="engineImg" />
                      <p>{item.customer_name}</p>
                      <p className="card_mobile_no">{item.mobile_number}</p>
                      <p className="card_engine_no">{item.engine_number}</p>
                      <p className="card_chassis_no">{item.chassis_number}</p>
                    </div>
                    {/* <img
                      src={chat}
                      alt="Logo"
                      onClick={() => {
                        navigate("/chat", {
                          state: { escdata: item },
                        });
                      }}
                      className="chatICon"
                    /> */}
                  </div>
                  {/* <p>{item.esclated_by_comment}</p> */}
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
                        marginTop: "38px",
                      }}
                    >
                      <img
                        src={supportAgent}
                        alt="Logo"
                        className="supporticon"
                      />
                      <p className="tobabel"> {item.to_name}</p>
                    </span>

                    <p className="cardic_name">IC Name:{item.rsa_ic_name}</p>

                    <p className="creationdate">
                      JOB crt:{" "}
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
