// ChatComponent.jsx

import React, { useCallback, useEffect, useState } from "react";
import "./ChatStyles.css"; // Import the CSS file
import Header from "../../Component/Header/Header";
import { useLocation } from "react-router-dom";
import { decryptData } from "../../Utils/cryptoUtils";
import { fetchChats } from "../../Api/fetchChats";
import { checkerAction } from "../../Api/checkAction";
// import bgImage from "../../Assets/bgImage/chatBackground.jpeg";

const ChatComponent = () => {
  const location = useLocation();

  const [escalationData] = useState(location?.state?.escdata);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loginData, setloginData] = useState("");
  const [statusOptions] = useState(["wip", "resolved", "closed"]); // Add your status options here
  const [selectedStatus, setSelectedStatus] = useState("wip");
  const findOppositeUserId = (targetUserId, data) => {
    if (data.esclated_by === targetUserId) {
      return data.esclated_to;
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
    const oppositeUserId = findOppositeUserId(decryptdata?.id, escalationData);
    console.log(typeof escalationData);
    console.log("Opposite User ID:", oppositeUserId);
    const data = {
      esclation_user_id: oppositeUserId,
      esclation_to_user_id: decryptdata?.id,
      esclation_id: escalationData?.id,
    };
    const chatdata = await fetchChats(data);
    console.log(chatdata);
    setMessages(chatdata?.data);
  }, [escalationData]);
  const handleSendMessage = async () => {
    console.log(selectedStatus);

    if (loginData.admin_role === "escalation_checker") {
      if (newMessage !== "") {
        console.log("you are checker");
        const data = {
          esclated_to_comment: newMessage,
          esclation_status: "wip",
          user_id: loginData?.id,
          esclation_id: escalationData?.id,
        };
        console.log(data);

        // Assuming checkerAction is an asynchronous function
        const senddata = await checkerAction(data);
        console.log(senddata);

        // After sending the message, fetch the updated chat data
        callChatAPi();
      }
    } else {
      console.log("you are maker", loginData.admin_role);
    }
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
      <div
        className="chat-container"

        // style={{
        //   backgroundImage: `url(${bgImage})`,
        //   backgroundSize: "cover",
        //   backgroundRepeat: "no-repeat",
        // //   backgroundPosition: "",
        // }}
      >
        {messages && true ? (
          <div className="chat-container2">
            {messages
              .slice()
              .reverse()
              .map((message, index) => (
                <div
                  key={index}
                  className={` ${
                    message.type !== "from" ? " box3 sb14" : " box4 sb13"
                  }`}
                >
                  {console.log(
                    message.type,
                    message.esclated_to_comment,
                    message.esclated_by_comment
                  )}
                  <p style={{ paddingBottom: "15px" }}>
                    {message?.esclated_by_comment ||
                      message?.esclated_to_comment}
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
        ) : (
          <div className="chat-container2">
            {messages
              .slice()
              .reverse()
              .map((message, index) => (
                <div
                  key={index}
                  className={` ${
                    message.type !== "to" ? " box3 sb14" : " box4 sb13"
                  }`}
                >
                  {console.log(
                    message.type,
                    message.esclated_to_comment,
                    message.esclated_by_comment
                  )}
                  <p style={{ paddingBottom: "15px" }}>
                    {message.type !== "from"
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
        )}
        <div className="messagecontainer">
          <input
            type="text"
            className="message-input"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            style={{ flex: 1 }}
          />{" "}
          <div className="custom-dropdown">
            <button
              className="status-button"
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            >
              Change Status
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
          <button className="send-button" onClick={handleSendMessage}>
            Send
          </button>
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
