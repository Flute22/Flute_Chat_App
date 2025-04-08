import React, { useEffect, useRef } from "react";
import moment from "moment";
import { userAppStore } from "../../../../../../store";
import { GET_MESSAGES } from "../../../../../../utils/constants";
import { apiClient } from "../../../../../../lib/api-client";

function MessageContainer() {
  const scrollRef = useRef();
  const { selectedChatType, selectedChatData, userInfo, selectedChatMessages, setSelectedChatMessages } =
    userAppStore();

    useEffect( () => {
      const getMessages = async () => {
        try {
          const response = await apiClient.post( GET_MESSAGES, { _id: selectedChatData._id }, { withCredentials: true } );
          if ( response.status === 200 && response.data.data) {
            setSelectedChatMessages(response.data.data);
          }

        } catch (error) {
          console.log("Error while fetching messages", error);
        }
      };
      if (selectedChatData._id) {
        if( selectedChatType === "contact") getMessages();
      }
    }, [ selectedChatData, selectedChatType, setSelectedChatMessages ])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-50 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
        </div>
      );
    });
  };

  const renderDMMessages = (message) => {
    const isMyMessage = message.sender === userInfo._id;
    
    return (
      <div className={`${isMyMessage ? "text-right" : "text-left"}`}>
        {message.messageType === "text" && (
          <div
            className={`${
              isMyMessage
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 ml-auto"
                : "bg-[#2a2b33]/5 text-white/80 border-white/20 mr-auto"
            } border inline-block p-2 rounded my-2 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}
        <div className={`text-xs text-gray-600 ${isMyMessage ? "text-right" : "text-left"}`}>
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef} />
    </div>
  );
}

export default MessageContainer;
