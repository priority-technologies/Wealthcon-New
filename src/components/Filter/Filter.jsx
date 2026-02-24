"use client";

import Image from "next/image";
import Typography from "../Typography";
import Select from "../Input/Select";
import Button from "../Button";
import VideoUploader from "../Modal/VideoUploader";
import NotesUploader from "../Modal/NotesUploader";
import GalleryUploader from "../Modal/GalleryUploader";
import AddMessage from "../Modal/AddMessage";
import GridIcon from "../../assets/images/svg/grid.svg";
import ListIcon from "../../assets/images/svg/list.svg";
import UploadIcon from "../../assets/images/svg/upload.svg";
import "./filter.scss";
import { Fragment, useEffect, useState } from "react";
import AddAnnouncement from "../Modal/AddAnnouncement";
import AddQuote from "../Modal/AddQuote";
import YTUploader from "../Modal/YTUploader";

const Filter = ({
  title,
  type,
  className,
  view,
  setView,
  admin,
  filterSelect,
  setFilterSelect,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [btnTitle, setBtnTitle] = useState("");

  useEffect(() => {
    switch (type) {
      case "liveSession":
        setBtnTitle("Upload Video");
        break;
      case "ytSession":
        setBtnTitle("Add Video");
        break;
      case "notes":
        setBtnTitle("Upload Notes & Charts");
        break;
      case "gallary":
        setBtnTitle("Upload Photos");
        break;
      case "watch_later":
        break;
      case "message":
        setBtnTitle("New Message");
        break;
      case "announcement":
        setBtnTitle("New Announcement");
        break;
      case "quote":
        setBtnTitle("New Quote image");
        break;
      default:
        setBtnTitle("");
    }
  }, [type]);

  const handleChangeSelect = (e) => {
    const { name, value } = e.target;
    setFilterSelect((presVal) => ({ ...presVal, [name]: value }));
  };

  return (
    <Fragment>
      <div className="flex justify-between items-center flex-wrap gap-4">
        <Typography
          tag="h1"
          size="text-xl"
          weight="font-semibold"
          color="text-base-content"
          className="block text-left"
        >
          {title}
        </Typography>
        <div className="filter-wrapper flex md:justify-between justify-start items-center flex-wrap gap-2">
          {admin && btnTitle && (
            <Button
              icon={UploadIcon}
              iconPosition="left"
              className="btn-primary btn-sm"
              onClick={() => setShowModal(true)}
            >
              <span className="md:block hidden">{btnTitle}</span>
            </Button>
          )}
          {type === "liveSession" ? (
            <VideoUploader
              showModal={showModal}
              setShowModal={setShowModal}
              modalTitle="Upload video Details"
            />
          ) : type === "ytSession" ? (
            <YTUploader
              showModal={showModal}
              setShowModal={setShowModal}
              modalTitle="Upload video Details"
            />
          ) : type === "notes" ? (
            <NotesUploader
              showModal={showModal}
              setShowModal={setShowModal}
              modalTitle="Upload notes & charts"
            />
          ) : type === "gallary" ? (
            <GalleryUploader
              showModal={showModal}
              setShowModal={setShowModal}
            />
          ) : admin && type === "message" ? (
            <AddMessage showModal={showModal} setShowModal={setShowModal} />
          ) : admin && type === "announcement" ? (
            <AddAnnouncement
              showModal={showModal}
              setShowModal={setShowModal}
            />
          ) : admin && type === "quote" ? (
            <AddQuote
              showModal={showModal}
              setShowModal={setShowModal}
            />
          )
            : (
              <></>
            )}
          {type !== "message" && type !== "announcement" && (
            <Select
              label="Sort by"
              name="sortBy"
              value={filterSelect.sortBy}
              options={
                type !== "gallary"
                  ? [
                    { label: "Date", value: "date" },
                    { label: "Size", value: "size" },
                    { label: "Name A-Z", value: "nameAsc" },
                    { label: "Name Z-A", value: "nameDesc" },
                  ]
                  : [
                    { label: "Date", value: "date" },
                    { label: "Name A-Z", value: "nameAsc" },
                    { label: "Name Z-A", value: "nameDesc" },
                  ]
              }
              onChange={handleChangeSelect}
              className="p-4 pr-10 border rounded-none w-full w-28"
            />
          )}
          {(type === "liveSession" || type === "ytSession" || type === "watch_later") && (
            <Select
              label="Filter"
              name="category"
              value={filterSelect.category}
              options={[
                { label: "All Session", value: "all" },
                { label: "Videos", value: "live" },
                {
                  label: "Assignment video",
                  value: "assignment",
                },
              ]}
              onChange={handleChangeSelect}
              className="p-4 pr-10 border rounded-none  md:w-full w-24"
            />
          )}

          {type !== "message" && type !== "announcement" && (
            <>
              <div
                className={`layout-view ${view === "grid" ? "active" : ""}`}
                onClick={() => setView("grid")}
              >
                <Image
                  src={GridIcon}
                  alt="grid view"
                  className="cursor-pointer"
                />
              </div>
              <div
                className={`layout-view ${view === "list" ? "active" : ""}`}
                onClick={() => setView("list")}
              >
                <Image
                  src={ListIcon}
                  alt="list view"
                  className="cursor-pointer"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Filter;
