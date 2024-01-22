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
import close from "../../Assets/Icons/close1.png";

import filter from "../../Assets/Icons/filter.png";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import supportAgent from "../../Assets/Icons/supportAgent.png";
import { searchEscalationData } from "../../Api/searchEscalationData";
import ReactDatePicker from "react-datepicker";
import moment from "moment";
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
  const [validationerror, setvalidationerror] = useState(null);

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
    // Assuming startDate and endDate are variables representing the start and end dates

    let originalstartDate, originalendDate;

    if (startDate) {
      originalstartDate = new Date(startDate);
    } else {
      originalstartDate = new Date(); // Use today's date if startDate is null
    }

    if (endDate) {
      originalendDate = new Date(endDate);
    } else {
      originalendDate = new Date(); // Use today's date if endDate is null
    }

    const formattedendDate = `${originalendDate.getFullYear()}-${String(
      originalendDate.getMonth() + 1
    ).padStart(2, "0")}-${String(originalendDate.getDate()).padStart(2, "0")}`;

    const formattedstartDate = `${originalstartDate.getFullYear()}-${String(
      originalstartDate.getMonth() + 1
    ).padStart(2, "0")}-${String(originalstartDate.getDate()).padStart(
      2,
      "0"
    )}`;

    // Now, formattedstartDate and formattedendDate contain the formatted dates.

    const filterdata = {
      start_date: formattedstartDate,
      end_date: formattedendDate,
      status_id: filterType,
    };
    fetchEscalationList("filter", filterdata);

    // Close the modal
    handleModalClose();
  };

  const [selectedOption, setSelectedOption] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (prop, id) => {
    // Check if the selected option is null or the searchQuery is empty
    if (prop !== "ViewDocument") {
      if (!selectedOption || !searchQuery.trim()) {
        // Set an error state
        setError("Please select an option and enter a valid search term.");
        return;
      }

      if (validationerror) {
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
  };

  const fetchEscalationList = useCallback(
    async (param, filterdata) => {
      const localData = localStorage.getItem("LoggedInUser");

      if (localData !== null || localData !== undefined) {
        const decryptdata = decryptData(localData);
        setLoginData(decryptdata);
        setUserName(
          `${decryptdata?.first_name ?? ""} ${decryptdata?.last_name ?? ""}`
        );

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
    const currentDate = moment(); // Use the current date and time
    const createDateObj = moment(createDate);

    // Check for invalid dates

    const duration = moment.duration(currentDate.diff(createDateObj));
    console.log(duration);

    // Get the difference in days, hours, minutes, and seconds
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    // Build the formatted string
    const formattedTime =
      // days > 0
      false
        ? `${days} day${days > 1 ? "s" : ""}`
        : `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
            2,
            "0"
          )}:${String(seconds).padStart(2, "0")}`;

    console.log(formattedTime);
    return formattedTime;
  };
  function calculateresolvedTimeDifference(startDateTimeStr, endDateTimeStr) {
    // Convert string representations to Date objects
    var startTime = moment(startDateTimeStr);
    var endTime = moment(endDateTimeStr);

    // Calculate the time difference in milliseconds
    const duration = moment.duration(endTime.diff(startTime));

    // Get the difference in days, hours, minutes, and seconds
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    // Build the formatted string
    const formattedTime =
      days > 0
        ? `${days} day${days > 1 ? "s" : ""}`
        : `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
            2,
            "0"
          )}:${String(seconds).padStart(2, "0")}`;

    return formattedTime;
  }

  const handleInputChange = (e) => {
    const sanitizedValue = e.target.value?.replace(/[^a-zA-Z0-9]/g, "");
    setSearchQuery(sanitizedValue);
    // setSearchQuery(e.target.value);

    if (selectedOption?.value === "customer_mobile_no") {
      const regex = /^[6-9]\d{9}$/; // Indian phone number regex
      console.log("mobile phone number error ");
      setvalidationerror(
        sanitizedValue && !regex.test(sanitizedValue)
          ? "Invalid  phone number"
          : ""
      );
    } else if (selectedOption?.value === "jobid") {
      const regex = /^\d+$/; // Only accept numbers
      setvalidationerror(
        sanitizedValue && !regex.test(sanitizedValue)
          ? "Invalid job ID (Only numbers are allowed)"
          : ""
      );
    } else {
      setvalidationerror("");
      console.log("no error error ");
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
  }, [checkLoginStatus, fetchEscalationList]);
  useEffect(() => {
    // Update time difference for each item initially
    const initialTimeDifferences = escalationList.map((item) =>
      calculateTimeDifference(item.created_at)
    );
    setTimeDifference(initialTimeDifferences);

    // Set up interval to update time difference every second
    const intervalId = setInterval(() => {
      const updatedTimeDifferences = escalationList.map((item) => {
        // Check if esclation_query_resolved_at exists and is not NaN
        if (
          item?.esclation_query_resolved_at &&
          !isNaN(Date.parse(item.esclation_query_resolved_at))
        ) {
          // Use calculateresolvedTimeDifference
          return calculateresolvedTimeDifference(
            item.job_create_date,
            item.esclation_query_resolved_at
          );
        } else {
          // Use calculateTimeDifference
          return calculateTimeDifference(item.job_create_date);
        }
      });

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
              onChange={(e) => setSelectedOption(e)}
            />

            <Tooltip title={validationerror || ""} arrow open={validationerror}>
              <input
                type="text"
                className="search-input"
                placeholder={`Enter ${selectedOption?.label || "search term"}`}
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={handleInputFocus} // Clear error when input is focused
              />
            </Tooltip>

            <Tooltip
              title={error || ""}
              arrow
              open={Boolean(error)}
              style={{ position: "relative" }}
            >
              <button className="search-button" onClick={handleSearch}>
                Search {selectedOption?.label || "All"}
              </button>
            </Tooltip>
          </div>
        )}
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content" style={{ paddingBottom: "5px" }}>
              <div className="modal-header" style={{ position: "relative" }}>
                <p className="modal-header-label">Filter Options</p>
                <img
                  src={close}
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    height: "20px",
                    width: "20px",
                    position: "absolute",
                    top: "12px",
                    right: "10px",
                  }}
                  alt="close"
                />
              </div>{" "}
              <div style={{ padding: "10px" }}>
                <div className="modal-dropdown">
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
                    {/* <option value="Accepted">Accepted</option> */}
                    {/* <option value="Reopen">Reopen</option> */}
                  </select>
                </div>
                <div className="date-logo-container">
                  {/* <img src={dateLogo} alt="Date Logo" className="date-logo" /> */}
                </div>
                <div
                  className="date-picker-container"
                  style={{ position: "relative" }}
                >
                  <div style={{ display: "flex" }}>
                    <label style={{ position: "absolute", top: "-21px" }}>
                      Start Date
                    </label>
                    <ReactDatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      placeholderText="Start Date"
                    />
                    <label
                      style={{
                        position: "absolute",
                        top: "-21px",
                        right: "127px",
                      }}
                    >
                      End Date
                    </label>

                    <ReactDatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      placeholderText="End Date"
                    />
                  </div>
                  <div></div>
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
                          right: "15px",
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
                      {new Date(item.job_create_date).toLocaleString("en-US", {
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
