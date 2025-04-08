import React, { useEffect } from "react";
import Logo from "../../../../assets/flute1.jpeg";
import ProfileInfo from "./components/profile-info/profile-info";
import NewDM from "./components/new-dm/new-dm";
import { GET_CONTACTS } from "../../../../utils/constants";
import { apiClient } from "../../../../lib/api-client";

function ContactsContainer() {
  useEffect( () => {
    const getContacts = async () => {
      try {
        const response = await apiClient.get(GET_CONTACTS, { withCredentials: true });

        if (response.status === 200 && response.data.data) {
          console.log(response.data.data);
        }
        
      } catch (error) {
        console.log("Error while fetching contacts", error);
      }
    }
  }, [])

  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      <div className="pt-3 pl-2">
        <img src={Logo} width={130} alt="logo" />
        {/* <h3>Flute</h3> */}
      </div>

      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct Messages" />
          <NewDM />
        </div>
      </div>

      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels" />
        </div>
      </div>

      <ProfileInfo />
    </div>
  );
}

export default ContactsContainer;

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light opacity-90 text-sm">
      {text}
    </h6>
  );
};
