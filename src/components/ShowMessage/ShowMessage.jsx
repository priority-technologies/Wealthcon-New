import Image from "next/image";
import Logo from "../../assets/images/thumb-logo.jpg";
import Ramsir from "../../assets/images/ramsir.jpeg";
import { Fragment, useContext, useState } from "react";
import "./showmessage.scss";
import PageLoading from "../Loading/PageLoading";
import { formatTimestampDateTime } from "../../helpers/all";
import { UserContext } from "@/app/_context/User";
import ConfirmModal from "../Modal/ConfirmModal";
import Dropdown from "../Dropdown/Dropdown";
import axios from "axios";
import { adminRoleObject } from "@/helpers/constant";
import ViewUserModel from "../Modal/ViewUserModel";
import EditMessage from "../Modal/EditMessage";
import AddMessage from "../Modal/AddMessage";

const ShowMessage = ({ type, className, messages, loading, setMessages, messageByRam }) => {
  const { userDetails } = useContext(UserContext);
  const classes = `${className || ""}  `;
  const [showModal, setShowModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [viewUser, setViewUser] = useState(false);
  const [editMessage, setEditMessage] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  
  const handleDelete = async () => {
    const res = await axios.delete(
      type === "Message"
        ? `/api/admin/messages/${selectedMessageId}`
        : `/api/admin/announcements/${selectedMessageId}`
    );
    if (res.status === 200) {
      setMessages((prevMessages) => {
        return prevMessages.filter(
          (message) => message._id !== selectedMessageId
        );
      });
      setConfirmModal(false);
    }
  };

  const openDeleteModal = (messageId) => {
    setSelectedMessageId(messageId);
    setConfirmModal(true);
  };

  const openViewUserModal = (messageId) => {
    setSelectedMessageId(messageId);
    setViewUser(true);
  };

  const openEditMessageModal = (message) => {
    setSelectedMessageId(message);
    setEditMessage(true);
  };

  const linkifyDescription = (description) => {
    const urlPattern =
      /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    return description.replace(
      urlPattern,
      '<a href="$1" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">$1</a>'
    );
  };

  if (loading) {
    return <PageLoading />;
  }

  return (
    <Fragment>
      <div className={classes}>
        {messages?.length ? (
          messages.map((message, index) => (
            <div className="chat chat-start" key={index}>
              <div className="chat-image avatar self-start">
                <div className="w-10 rounded-full">
                  <Image src={messageByRam?Ramsir:Logo} alt="logo" className="text-center " />
                </div>
              </div>
              <div className="flex flex-col gap-2 chat-bubble bg-primary-content text-lg border border-primary pt-2">
                {["admin", "superAdmin"].includes(userDetails.role) && (
                  <Dropdown
                    setShowModal={setShowModal}
                    setConfirmModal={() => openDeleteModal(message._id)}
                    setViewUser={() => openViewUserModal(message._id)}
                    setEditMessage={() => openEditMessageModal(message)}
                  />
                )}

                <p
                  className="text-base-100 whitespace-pre-wrap decs"
                  dangerouslySetInnerHTML={{
                    __html: linkifyDescription(message?.message || ""),
                  }}
                ></p>

                {["admin", "superAdmin"].includes(userDetails.role) && (
                  <div className="font-bold text-xs text-base-100">
                    Category:{" "}
                    {message.studentCategory.map((value, index) => (
                      <span key={index} className="font-normal opacity-50">
                        {adminRoleObject[value]}
                        {message.studentCategory.length > index + 1 && ", "}
                      </span>
                    ))}
                  </div>
                )}
                <div className="chat-footer text-xs opacity-50 text-end	text-base-100">
                  {formatTimestampDateTime(
                    message.createdAt
                    // type === "Announcement"
                    //   ? message.datetime
                    //   : message.createdAt
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>{type} not Available</div>
        )}
      </div>
      {confirmModal && (
        <ConfirmModal
          showModal={confirmModal}
          setShowModal={setConfirmModal}
          modalTitle="Are you sure you want to delete this message?"
          onClick={handleDelete}
          id={selectedMessageId}
        />
      )}
      
      {viewUser && (
        <ViewUserModel
          showModal={viewUser}
          setShowModal={setViewUser}
          id={selectedMessageId}
          type={type === "Message" ? "Message" : "Announcements" }
        />
      )}
      {editMessage && (
        <EditMessage
          showModal={editMessage}
          setShowModal={setEditMessage}
          message={selectedMessageId}
          type={type === "Message" ? "Message" : "Announcements" }
        />
      )}
    </Fragment>
  );
};

export default ShowMessage;
