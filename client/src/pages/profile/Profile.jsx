import React from "react";
import { userAppStore } from "../../store/index";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function Profile() {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = userAppStore();
  const { firstName, setFirstName } = useState("");
  const { lastName, setLastName } = useState("");
  const { image, setImage } = useState(null);
  const { hovered, setHovered } = useState(false);
  const { selectedColor, setSelectedColor } = useState(0);

  const saveChanges = async () => {};

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div className="">
          <IoArrowBack className="text-3xl lg:text-5xl text-white/90" />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:w-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
