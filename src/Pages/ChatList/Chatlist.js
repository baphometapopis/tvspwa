// ChatComponent.jsx

import React, { useCallback, useEffect, useState } from "react";
import "./ChatStyles.css"; // Import the CSS file
import Header from "../../Component/Header/Header";
import { useLocation } from "react-router-dom";
import { decryptData } from "../../Utils/cryptoUtils";
import { fetchChats } from "../../Api/fetchChats";
// import bgImage from "../../Assets/bgImage/chatBackground.jpeg";

const ChatComponent = () => {
  const location = useLocation();

  const [escalationData] = useState(location?.state?.escdata);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const findOppositeUserId = (targetUserId, data) => {
    if (data.esclated_by === targetUserId) {
      return data.esclated_to;
    } else if (data.esclated_to === targetUserId) {
      return data.esclated_by;
    }
    return null; // Return null if the ID is not found in the data
  };

  const callChatAPi = useCallback(async () => {
    const localData = localStorage.getItem("LoggedInUser");
    const decryptdata = decryptData(localData);

    const targetUserId = "161"; // Replace with the desired user ID
    const oppositeUserId = findOppositeUserId(targetUserId, escalationData);
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
  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([...messages, { text: newMessage, type: "to" }]);
      setNewMessage("");
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
  useEffect(() => {
    callChatAPi();
  }, [callChatAPi, escalationData]);
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
        <div className="chat-container2">
          {console.log(messages, ";kljikhugjyhfgdfgfgyjhukijl")}
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
                <p style={{ paddingBottom: "15px" }}>
                  {message.type !== "to"
                    ? message.esclated_to_comment
                    : message.esclated_by_comment}
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    position: "absolute",
                    right: "10px",
                    bottom: "2px",
                  }}
                >
                  {" "}
                  {formatDate(message?.created_at)}
                </p>
              </div>
            ))}
        </div>
        <div className="messagecontainer">
          <input
            type="text"
            className="message-input"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            style={{ flex: 1 }}
          />
          <button className="send-button" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
      {/* <div className="chat-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`box3  ${message.type === "to" ? "sb14" : "sb13"}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          className="message-input"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button className="send-button" onClick={handleSendMessage}>
          Send
        </button>
      </div> */}
    </div>
  );
};

export default ChatComponent;
