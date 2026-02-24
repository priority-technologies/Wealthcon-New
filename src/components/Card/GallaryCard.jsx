"use client";

import Image from "next/image";
import "./card.scss";
import { Fragment, useContext, useState } from "react";
import { formatTimestampDate } from "../../helpers/all";
import Dropdown from "../Dropdown/Dropdown";
import axios from "axios";
import ConfirmModal from "../Modal/ConfirmModal";
import { UserContext } from "@/app/_context/User";
import logo from "@/assets/images/thumb-logo.jpg";
import { adminRoleObject } from "@/helpers/constant";
import ViewUserModel from "../Modal/ViewUserModel";
import NotesEdit from "../Modal/NotesEdit";

const GallaryCard = ({
  item,
  view,
  index,
  setGallaryModal,
  setClickIndex,
  editAble,
  type,
}) => {
  const { setNotes, setGallery } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [viewUser, setViewUser] = useState(false);

  const openSideshow = () => {
    setClickIndex(index);
    setGallaryModal(true);
  };

  const handleDelete = async () => {
    const res = await axios.delete(
      type === "quote"
        ? `/api/admin/quote/${item._id}`
        : `/api/admin/notes/${item._id}`
    );
    if (res.status === 200) {
      if (type === "quote") {
        setGallery((prevVal) => {
          const updateVal = prevVal.filter((e) => e._id !== item._id);
          return updateVal;
        });
      } else {
        setNotes((prevVal) => {
          const updateVal = prevVal.filter((e) => e._id !== item._id);
          return updateVal;
        });
      }
    }
  };

  return (
    <Fragment>
      {view === "grid" ? (
        <div className="card shadow-lg grid-view">
          {editAble && (
            <Dropdown
              setShowModal={setShowModal}
              setConfirmModal={setConfirmModal}
              setViewUser={() => setViewUser(true)}
              item={item}
            />
          )}
          <figure onClick={openSideshow}>
            <Image
              src={item.image || logo}
              alt="cardImg"
              height={200}
              width={200}
              loading="lazy"
              quality={70}
            />
          </figure>
          <h2 className="card-title text-base-100 text-lg font-medium">
            {item.title}
          </h2>
          <p className="text-base-200 text-sm font-normal history">
            {formatTimestampDate(item?.imageCreatedAt || item?.notesCreatedAt)}
          </p>
          {editAble && (
            <div className="mt-2">
              <b>Categories: </b>
              {item?.studentCategory && item?.studentCategory.length > 0 && (
                <span>
                  {item.studentCategory
                    .map((cat) => adminRoleObject[cat] || cat)
                    .join(", ")}
                </span>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="card shadow-lg list-view">
          {editAble && (
            <Dropdown
              setShowModal={setShowModal}
              setConfirmModal={setConfirmModal}
              setViewUser={() => setViewUser(true)}
              item={item}
            />
          )}
          <div className="card-horizontal">
            <div className="cardheader">
              <figure onClick={openSideshow}>
                <Image
                  src={item.image || logo}
                  alt="cardImg"
                  height={100}
                  width={100}
                />
              </figure>
              <div>
                <h2 className="card-title text-base-100 text-lg font-medium min-w-48 max-w-48">
                  {item.title}
                </h2>
                <div className="text-base-200 text-sm font-normal history">
                  {formatTimestampDate(item?.imageCreatedAt || item?.notesCreatedAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <NotesEdit
          showModal={showModal}
          setShowModal={setShowModal}
          modalTitle="Edit notes Details"
          item={item}
        />
      )}

      {confirmModal && (
        <ConfirmModal
          showModal={confirmModal}
          setShowModal={setConfirmModal}
          modalTitle="Are you sure you want to delete this image?"
          onClick={handleDelete}
          id={item._id}
        />
      )}

      {viewUser && (
        <ViewUserModel
          showModal={viewUser}
          setShowModal={setViewUser}
          id={item._id}
          type="gallery"
        />
      )}
    </Fragment>
  );
};

export default GallaryCard;
