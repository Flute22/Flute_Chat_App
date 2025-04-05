import React, { useRef, useState, useEffect } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerFill, RiEmojiStickerLine } from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";

function MessageBar() {
  const emojiRef = useRef();
  const [message, setMessage] = useState("");
  const [emojiPikerOpen, setEmojiPikerOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPikerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const handleSendMessage = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex items-center gap-5 pr-5 bg-[#2a2b33] rounded-md">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
          <GrAttachment className="text-2xl cursor-pointer" />
        </button>

        <div className="relative">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={() => setEmojiPikerOpen(true)}
          >
            <RiEmojiStickerFill className="text-2xl cursor-pointer" />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker
              theme="dark"
              open={emojiPikerOpen}
              onEmojiClick={handleSendMessage}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button
        className="text-neutral-500 bg-[#8417ff] p-4 rounded-md hover:bg-[#741bda] focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
      >
        <IoSend className="text-3xl cursor-pointer" />
      </button>
    </div>
  );
}

export default MessageBar;
