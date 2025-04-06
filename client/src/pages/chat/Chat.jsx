import { useEffect } from "react";
import { userAppStore } from "../../store/index";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ChatContainer from "./components/chat-container/chat-container";
import ContactsContainer from "./components/contacts-container/contacts-container";
import EmptyChatContainer from "./components/empty-chat-container/empty-chat-container";


function Chat() {
  const { userInfo, selectedChatType } = userAppStore();  
  const navigate = useNavigate();

  useEffect( () => {
    if ( !userInfo.profileSetup ) {
      toast("Please setup your profile first to continue.");
      navigate("/profile");
    }
  }, [ userInfo, navigate ] )

  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      <ContactsContainer />
      {
        selectedChatType === undefined ? <EmptyChatContainer /> : <ChatContainer />
      }
    </div>
  )
}

export default Chat