import { useEffect } from "react";
import { userAppStore } from "../../store/index";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";


function Chat() {
  const { userInfo } = userAppStore();  
  const navigate = useNavigate();

  useEffect( () => {
    if ( !userInfo.profileSetup ) {
      toast("Please setup your profile first to continue.");
      navigate("/profile");
    }
  }, [ userInfo, navigate ] )

  return (
    <div>chat</div>
  )
}

export default Chat