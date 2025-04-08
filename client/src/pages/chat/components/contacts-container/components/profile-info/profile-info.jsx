import React from "react";
import { getColor } from "../../../../../../lib/utils";
import { userAppStore } from "../../../../../../store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoPowerSharp } from "react-icons/io5"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FiEdit2 } from "react-icons/fi"
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../../../../../lib/api-client";
import { LOGOUT_ROUTE } from "../../../../../../utils/constants";

function ProfileInfo() {
  const { userInfo, setUserInfo } = userAppStore();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const response = await apiClient.post(LOGOUT_ROUTE, {}, { withCredentials: true });
      
      if ( response.status === 200 ) {
        navigate("/auth");
        setUserInfo(null);
      }

    } catch (error) {
      console.log("Error while logging out", error);
      
    }
  }

  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-4 w-full bg-[#2a2b33]">
      <div className="flex items-center justify-center gap-2">
        <div className="w-12 h-12 relative">
          <Avatar
            className={`h-12 w-12 flex items-center justify-center rounded-full overflow-hidden ${getColor(
              userInfo.color
            )}`}
          >
            {userInfo.image ? (
              <AvatarImage
                src={`${userInfo.image}`}
                alt="profile"
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <div className="uppercase w-10 h-10 text-lg flex items-center justify-center rounded-full">
                {userInfo.firstName
                  ? userInfo.firstName.split("").shift()
                  : userInfo.email.split("").shift()}
              </div>
            )}
          </Avatar>
        </div>

        <div>
          {userInfo.firstName && userInfo.lastName
            ? `${userInfo.firstName} ${userInfo.lastName}`
            : userInfo.email}
        </div>
      </div>

      <div className="flex gap-5 ">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>  
                <FiEdit2 className="text-purple-500 text-xl font-medium" 
                onClick={ () => navigate("/profile") }
                /> 
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>  
                <IoPowerSharp className="text-red-500 text-xl font-medium " 
                onClick={ logout }
                /> 
            </TooltipTrigger>
            <TooltipContent>
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

export default ProfileInfo;
