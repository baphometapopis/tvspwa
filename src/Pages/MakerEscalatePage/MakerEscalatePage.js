// Dashboard.js

import React, { useEffect, useState } from "react";
import "./MakerEscalatePage.css"; // Import the CSS file
import Header from "../../Component/Header/Header";
import { useLocation } from "react-router-dom";
import { getEscalationCataegoryList } from "../../Api/getEscalationcategorylist";
import { decryptData } from "../../Utils/cryptoUtils";
import { escalationListApi } from "../../Api/escalationListAPi";
import { toast } from "react-toastify";
import supportAgent from "../../Assets/Icons/supportAgent.png";
import Select from "react-select";
import { Tooltip } from "@mui/material";
import { makerAction } from "../../Api/MakerAction";

const MakerEscalatePage = () => {
  const location = useLocation();
  const [searchData] = useState(location?.state?.searchData?.data);
  const [jobID] = useState(location?.state?.searchData?.data?.jobid);
  const [selectedOption, setSelectedOption] = useState(null);
  const [issueDescription, setIssueDescription] = useState("");

  const [isModalOpen, setModalOpen] = useState(false);
  const [escalationList, setEscalationList] = useState([]);
  const [categoryList, setcategoryList] = useState([]);
  const [loginData, setLoginData] = useState();
  const [error, setError] = useState(null);
  const handleSend = async () => {
    // Check if an option is selected
    if (!issueDescription.trim() && !selectedOption) {
      setError("Please describe the issue and select an option");
      return;
    } else {
      setError(null);
    }

    // Clear the error state

    // Call your function with selectedOption and issueDescription
    // YourFunction(selectedOption, issueDescription);

    // For demonstration purposes, log the values

    // Close the modal

    const data = {
      esclated_by_comment: issueDescription,
      esclated_by_category_id: selectedOption.value,
      job_id: jobID,

      user_id: loginData?.id,
    };
    console.log(data);

    const escalateissue = await makerAction(data);
    if (escalateissue.status) {
      toast.success("Escalation raised Successfully", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      fetchEscalationList();
    } else {
      toast.error(escalateissue?.message, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
    console.log(escalateissue);

    console.log("Selected Option:", selectedOption.value, jobID);
    console.log("Issue Description:", issueDescription);

    // Clear the form fields if needed
    setSelectedOption(null);
    setIssueDescription("");

    handleInputFocus();
    closeModal();
  };
  const openModal = () => {
    console.log("hiting");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  const findCategoryname = (category_id) => {
    const answers = categoryList
      .filter((item) => item.id === category_id)
      .map((item) => item.answer);

    return answers;
  };
  const fetchEscalationList = async () => {
    const categorydata = await getEscalationCataegoryList();
    if (categorydata.status) {
      setcategoryList(categorydata.data);
    }
    const localData = localStorage.getItem("LoggedInUser");
    if (localData !== null || localData !== undefined) {
      const decryptdata = decryptData(localData);
      setLoginData(decryptdata);

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

  useEffect(() => {
    fetchEscalationList();
  }, []);
  useEffect(() => {}, [isModalOpen, selectedOption, issueDescription]);
  return (
    <div className="dashboardcnt">
      <Header />
      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <p className="modal-header-label">Escalate an Issue</p>
            </div>
            <div style={{ padding: "10px" }}>
              <div className="modal-dropdown">
                <Select
                  className="search-dropdown"
                  options={categoryList.map((item) => ({
                    label: item.answer,
                    value: item.id,
                  }))}
                  isClearable
                  placeholder="Select an option"
                  value={selectedOption}
                  onChange={(selected) => {
                    setSelectedOption(selected);
                    handleInputFocus();
                  }}
                />
              </div>
              <Tooltip title={error || ""} arrow open={Boolean(error)}>
                <div className="modal-description">
                  <textarea
                    id="issueDescription"
                    name="issueDescription"
                    rows="15"
                    placeholder="Describe the issue"
                    onChange={(text) => {
                      setIssueDescription(text.target.value);
                      handleInputFocus();
                    }}
                  />
                </div>
              </Tooltip>
            </div>
            {/* Send button */}

            <div style={{ display: "flex", flexDirection: "row-reverse" }}>
              <button className="modal-send" onClick={handleSend}>
                Send
              </button>
            </div>

            {/* <button onClick={closeModal}>Close Modal</button> */}
          </div>
        </div>
      )}

      <div className="info-container">
        <div className="info-box">
          <div style={{ display: "flex", padding: "20px" }}>
            <div className="infolabels-container">
              <div className="infolabel">Name:</div>
              <div className="infolabel">Phone No:</div>
              <div className="infolabel">Policy No:</div>

              <div className="infolabel">Job ID:</div>
              <div className="infolabel">Chassis No:</div>
              <div className="infolabel">Vehicle No:</div>
              <div className="infolabel">Registration Date:</div>
              <div className="infolabel">Model</div>
              {/* <div className="infolabel">Nature of Complaint :</div> */}
            </div>
            <div className="values-container">
              <div className="value">{searchData?.customer_name}</div>
              <div className="value">{searchData?.customer_mobile_no}</div>
              <div className="value">{searchData?.policy_no}</div>

              <div className="value">{searchData?.jobid}</div>
              <div className="value">{searchData?.frame_no}</div>
              <div className="value">{searchData?.registration_no}</div>
              <div className="value">January 1, 2022</div>
              <div className="value">{searchData?.model}</div>
            </div>
          </div>
          <button className="escalatebutton" onClick={openModal} type="submit">
            Escalate
          </button>
        </div>

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

export default MakerEscalatePage;
