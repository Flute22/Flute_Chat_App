import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import Lottie from "react-lottie";
import { animationDefaultOptions, getColor } from "../../../../../../lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SEARCH_CONTACTS } from "../../../../../../utils/constants";
import { apiClient } from "../../../../../../lib/api-client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { userAppStore } from "../../../../../../store/index";

function NewDM() {
  const { setSelectChatType, setSelectChatData } = userAppStore();
  const [openNewContactModel, setOpenNewContactModel] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);

  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const response = await apiClient.post(
          SEARCH_CONTACTS,
          { searchTerm },
          { withCredentials: true }
        );
        console.log(response);

        if (response.status === 200 && response.data.data) {
          setSearchedContacts(response.data.data);
        } else {
          setSearchedContacts([]);
        }
      }
    } catch (error) {
      console.log("Error while searching contacts", error);
    }
  };


  const selectNewContact = (contact) => {
    setOpenNewContactModel(false);
    setSelectChatType("contact");
    setSelectChatData(contact);
    setSearchedContacts([])
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setOpenNewContactModel(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg[#1c1b1e] border-none mb-2 p-3 text-white">
            <p>Select new contact here</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openNewContactModel} onOpenChange={setOpenNewContactModel}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-center">
              Please select a contact
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="">
            <Input
              placeholder="Search contacts"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => {
                searchContacts(e.target.value);
              }}
            />
          </div>

          <ScrollArea className="h-[250px] w-[350px] rounded-md p-4">
            <div className="flex flex-col gap-5">
              {searchedContacts.map((contact) => {
                return (
                  <div
                    key={contact._id}
                    className="flex gap-3 items-center cursor-pointer"
                    onClick={() => selectNewContact(contact)}
                  >
                    <div className="flex items-center gap-5 w-full relative">
                      <Avatar
                        className={`h-12 w-12 flex items-center justify-center rounded-full overflow-hidden ${getColor(
                          contact.color
                        )}`}
                      >
                        {contact.image ? (
                          <AvatarImage
                            src={`${contact.image}`}
                            alt="profile"
                            className="object-cover w-full h-full bg-black"
                          />
                        ) : (
                          <div className="uppercase w-10 h-10 text-lg flex items-center justify-center rounded-full">
                            {contact.firstName
                              ? contact.firstName.split("").shift()
                              : contact.email.split("").shift()}
                          </div>
                        )}
                      </Avatar>

                      <div className="flex flex-col">
                        <span className="flex">
                          {contact.firstName && contact.lastName
                            ? `${contact.firstName} ${contact.lastName}`
                            : contact.email}
                        </span>
                        <span className="text-xs">{contact.email}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          <div>
            {searchedContacts.length <= 0 ? (
              <div className="flex-1 md:bg-[#181920] md:flex flex-col justify-center items-center duration-1000 transition-all">
                <Lottie
                  isClickToPauseDisabled={true}
                  height={100}
                  width={100}
                  options={animationDefaultOptions}
                />

                <div className="text-opacity-80 text-center text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-3xl transition-all duration-100">
                  <h3 className="host-grotesk-medium">
                    Hi
                    <span className="text-purple-500">! </span> Search New
                    <span className="text-purple-500"> Contacts</span>
                    <span className="text-purple-500">.</span>
                  </h3>
                </div>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default NewDM;
