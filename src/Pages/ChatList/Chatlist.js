// ChatComponent.jsx

import React, { useCallback, useEffect, useState } from "react";
import "./ChatStyles.css"; // Import the CSS file
import Header from "../../Component/Header/Header";
import { useLocation } from "react-router-dom";
import { decryptData } from "../../Utils/cryptoUtils";
import { fetchChats } from "../../Api/fetchChats";
import { checkerAction } from "../../Api/checkAction";
import { makerAction } from "../../Api/MakerAction";
// import bgImage from "../../Assets/bgImage/chatBackground.jpeg";
import Tooltip from "@mui/material/Tooltip";

const ChatComponent = () => {
  const location = useLocation();

  const [escalationData] = useState(location?.state?.escdata);

  const [messages, setMessages] = useState([]);
  const [escalationStatusData, setescalationstatusData] = useState();
  const [newMessage, setNewMessage] = useState("");
  const [loginData, setloginData] = useState("");
  const [error, setError] = useState("");
  const [statusOptions, setStatusOption] = useState(["wip", "resolved"]); // Add your status options here

  const [selectedStatus, setSelectedStatus] = useState("");
  const findOppositeUserId = (targetUserId, data) => {
    if (data?.esclated_by === targetUserId) {
      return data?.esclated_to;
    } else if (data.esclated_to === targetUserId) {
      return data.esclated_by;
    }
    return null; // Return null if the ID is not found in the data
  };
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const callChatAPi = useCallback(async () => {
    const localData = localStorage.getItem("LoggedInUser");
    const decryptdata = decryptData(localData);
    setloginData(decryptdata);
    setStatusOption(
      decryptdata?.esclation_type === "maker"
        ? ["Accepted", "Reopen", "reescalate"]
        : ["wip", "resolved", "closed"]
    );

    const oppositeUserId = findOppositeUserId(decryptdata?.id, escalationData);
    console.log(typeof escalationData);
    console.log("Opposite User ID:", oppositeUserId);
    const data = {
      user_id: decryptdata?.id,
      esclation_id: escalationData?.id,
    };
    const chatdata = await fetchChats(data);
    console.log(chatdata);
    const sortedData = [...chatdata?.data].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB - dateA;
    });
    setMessages(sortedData);
    setescalationstatusData(chatdata?.esclation_data);
  }, [escalationData]);
  const handleSendMessage = async () => {
    if (!newMessage || !selectedStatus) {
      console.error("Please enter a message and select a status.");
      // You can also show an error message to the user if needed.
      setError("please type message and select status");
      return;
    }

    console.log(selectedStatus);
    const data = {
      esclated_to_comment: newMessage,
      esclation_status: selectedStatus,
      user_id: loginData?.id,
      esclation_id: escalationData?.id,
    };
    if (loginData.admin_role === "escalation_checker") {
      if (newMessage !== "") {
        console.log("you are checker");

        console.log(data);

        // Assuming checkerAction is an asynchronous function
        const senddata = await checkerAction(data);
        console.log(senddata);

        // After sending the message, fetch the updated chat data
        callChatAPi();
      }
    } else {
      console.log("you are maker", loginData.admin_role);
      const senddata = await makerAction(data);
      console.log(senddata);

      // After sending the message, fetch the updated chat data
      callChatAPi();

      // const senddata = await makerAction(data);
    }
    setNewMessage("");
    setescalationstatusData("");
  };

  function formatDate(inputDate) {
    const options = {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    const formattedDate = new Date(inputDate).toLocaleString("en-US", options);
    return formattedDate;
  }

  const handleStatusChange = async (newStatus) => {
    setSelectedStatus(newStatus);
    setIsStatusDropdownOpen(false);
  };
  useEffect(() => {
    callChatAPi();
  }, [callChatAPi, escalationData, isStatusDropdownOpen]);
  return (
    <div className="Homecnt">
      <Header />
      <div className="chat-container">
        {true && (
          <div className="chatstatusHeader">
            <p style={{ fontSize: "14px" }}>
              <span>Status :</span>
              {escalationStatusData?.esclation_status}
            </p>
            <p style={{ fontSize: "14px" }}>
              Completion Status :
              {escalationStatusData?.esclation_status_completion}
            </p>

            <p style={{ fontSize: "14px" }}>
              Creation Date :{formatDate(escalationStatusData?.created_at)}
            </p>
          </div>
        )}
        {messages && (
          <div className="chat-container2">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${
                  message.user_id !== loginData?.id
                    ? " box3 sb14"
                    : " box4 sb13"
                }`}
              >
                <p className="chatUsername">{message?.username}</p>
                <p
                  className="chatStatus"
                  style={{
                    color:
                      message.esclation_status === "Pending"
                        ? "#e54a50" // Pending color
                        : message.esclation_status === "WIP"
                        ? "#eec75b" // WIP color
                        : message.esclation_status === "Resolved"
                        ? "#5d9db9" // Resolved color
                        : message.esclation_status === "Accepted"
                        ? "#6fb293" // Accepted color
                        : message.esclation_status === "Reopen"
                        ? "#d7Oe17" // Reopen color
                        : message?.esclation_status_completion === "Accepted"
                        ? "#04cf00"
                        : "red", // Default color for other cases
                  }}
                >
                  {message?.esclation_status ||
                    message?.esclation_status_completion}
                </p>
                <p
                  style={{
                    paddingBottom: "15px",
                    zIndex: 1,
                    position: "sticky",
                    paddingLeft: "10px",
                    color: "#4F4F4F",
                    width: "95%",
                  }}
                >
                  {message?.common_comment}
                </p>
                <p
                  style={{
                    fontSize: "8px",
                    position: "absolute",
                    right: "10px",
                    bottom: "2px",
                    // fontWeight: "600",
                    color: "#4F4F4F",
                  }}
                >
                  {formatDate(message?.created_at)}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="messagecontainer">
          <input
            type="text"
            className="message-input"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              setError("");
            }}
            style={{ flex: 1 }}
          />
          <div className="custom-dropdown" onClick={() => setError("")}>
            <button
              className="status-button"
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              style={{
                backgroundColor:
                  selectedStatus === "Pending"
                    ? "#e54a50" // Pending color
                    : selectedStatus === "wip"
                    ? "#eec75b" // WIP color
                    : selectedStatus === "Resolved"
                    ? "#5d9db9" // Resolved color
                    : selectedStatus === "Accepted"
                    ? "#6fb293" // Accepted color
                    : selectedStatus === "Reopen"
                    ? "#FFA500" // Reopen color
                    : selectedStatus === "reesclate"
                    ? "red"
                    : "#007bff",
              }}
            >
              {selectedStatus || "Change Status"}
            </button>
            {isStatusDropdownOpen && (
              <div className="dropdown-content">
                {statusOptions.map((status) => (
                  <div key={status} onClick={() => handleStatusChange(status)}>
                    {status}
                  </div>
                ))}
              </div>
            )}
          </div>
          <Tooltip title={error || ""} arrow open={error}>
            <button className="send-button" onClick={handleSendMessage}>
              Send
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;

/*  {messages && (
          <div className="chat-container2">
            {messages
              .slice()
              .reverse()
              .map((message, index) => (
                <div
                  key={index}
                  className={` ${
                    message.type === "from" ? " box3 sb14" : " box4 sb13"
                  }`}
                >

                    {console.log(message.type, message.esclated_to_comment,message.esclated_by_comment)}
                  <p style={{ paddingBottom: "15px" }}>
                    {message.type === "from"
                      ? message?.esclated_by_comment
                      : message?.esclated_to_comment}
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      position: "absolute",
                      right: "10px",
                      bottom: "2px",
                    }}
                  >
                    {formatDate(message?.created_at)}
                  </p>
                </div>
              ))}
          </div>
        )}*/
