import React from "react";
import { RiCloseFill } from "react-icons/ri";
import { userAppStore } from "../../../../../../store";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "../../../../../../lib/utils";

function ChatHeader() {
  const { closeChat, selectedChatData } = userAppStore();

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
      <div className="flex gap-5 items-center w-full justify-between">
        <div className="flex gap-3 items-center justify-center">
          <div className="flex items-center gap-5 w-full relative">
            <Avatar
              className={`h-12 w-12 flex items-center justify-center rounded-full overflow-hidden ${getColor(
                selectedChatData.color
              )}`}
            >
              {selectedChatData.image ? (
                <AvatarImage
                  src={`${selectedChatData.image}`}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div className="uppercase w-10 h-10 text-lg flex items-center justify-center rounded-full">
                  {selectedChatData.firstName
                    ? selectedChatData.firstName.split("").shift()
                    : selectedChatData.email.split("").shift()}
                </div>
              )}
            </Avatar>

            <div className="flex flex-col">
              <span className="flex">
                {selectedChatData.firstName && selectedChatData.lastName
                  ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
                  : ""}
              </span>
              {/* <span className="text-xs">{selectedChatData.email}</span> */}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={closeChat}
          >
            <RiCloseFill className="text-2xl cursor-pointer" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
