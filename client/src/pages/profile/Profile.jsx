import React, { useEffect } from "react";
import { userAppStore } from "../../store/index";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "../../lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "../../lib/api-client";
import { UPDATE_PROFILE_INFO } from "../../utils/constants";

function Profile() {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = userAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const fileInputRef = useRef(null);


  useEffect(() => {
    if ( userInfo.profileSetup ) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    }
  }, [ userInfo ]);

  const validateProfile = () => {
    if ( !firstName ) {
      toast.error("First Name is required.");
      return false;
    }

    if ( !lastName ) {
      toast.error("Last Name is required.");
      return false;
    }

    return true;
  };

  const saveChanges = async () => {
    if ( validateProfile() ) {
      try {
        const response = await apiClient.patch(
          UPDATE_PROFILE_INFO,
          { firstName, lastName, color: selectedColor },
          { withCredentials: true }
        );

        if ( response.status === 200 && response.data.data ){
          setUserInfo({...response.data.data});
          toast.success("Profile Updated Successfully");
          navigate("/chat");
        }

        console.log(response)

      } catch (error) {
        console.log("Error while saving profile changes", error)
      }
    } 
  };

  const handleNavigationArrow = () => {
    if ( userInfo.profileSetup ) {
      navigate("/chat");
    } else {
      toast.error("Please complete your profile first.");
    }
  }

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div className="">
          <IoArrowBack onClick={ handleNavigationArrow } className="text-3xl lg:text-3xl text-white opacity-50 hover:opacity-90 cursor-pointer" />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:w-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className={`h-20 w-20 md:w-48 md:h-48 rounded-full overflow-hidden ${ getColor(selectedColor) }`}>
              {
                image ?  (
                  <AvatarImage
                    src={ image }
                    alt="profile"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : ( 
                <div className="uppercase w-20 h-20 md:w-48 md:h-48 text-5xl flex items-center justify-center rounded-full">
                  {
                    firstName ? firstName.split("").shift() : userInfo.email.split("").shift()
                  }
                </div> 
                )
              }
            </Avatar>

            { hovered && (
              <div className="absolute w-20 h-20 md:w-48 md:h-48 flex items-center justify-center bg-black/50 rounded-full cursor-pointer">
                { image ? 
                  <FaTrash className="text-black text-xl" /> : 
                  <FaPlus className="text-gray-300 text-xl" /> 
                }
              </div>
            )}
              {/* <input type="text" /> */}
          </div>
          <div className="flex md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <Input 
                placeholder="Email" 
                type="email" 
                disabled 
                value={userInfo.email} 
                className="rounded-lg p-6 bg-[#2c2e3b] border-none" 
              />
            </div>

            <div className="w-full">
              <Input 
                placeholder="First Name"
                type="text"
                value={ firstName }
                onChange={ (e) => setFirstName(e.target.value) }
                className="rounded-lg p-6 bg-[#2c2e3b] border-none text-white"
              />
            </div>

            <div className="w-full">
              <Input
                placeholder="Last Name"
                type="text"
                value={ lastName }
                onChange={ (e) => setLastName(e.target.value) }
                className="rounded-lg p-6 bg-[#2c2e3b] border-none text-white"
              />
            </div>

            <div className="w-full flex gap-5">
              { colors.map( ( color, index ) => (
                <div 
                  className={`${ color } h-6 w-6 rounded-full cursor-pointer transition-all duration-300
                    ${
                      selectedColor === index ? "outline-white/60 outline-1" : ""
                    }
                  `}
                  key={ index }
                  onClick={ () => setSelectedColor(index) }
                ></div>
              )) }
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button 
            className="bg-purple-700 hover:bg-purple-900 w-full p-6 rounded-lg cursor-pointer transition-all ease-in-out duration-300"
            onClick={ saveChanges }
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
