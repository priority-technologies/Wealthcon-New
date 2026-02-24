"use client";

import Image from "next/image";
import "./card.scss";
import { Fragment, useContext, useState } from "react";
import Dropdown from "../Dropdown/Dropdown";
import Link from "next/link";
import ConfirmModal from "../Modal/ConfirmModal";
import VideoEdit from "../Modal/VideoEdit";
import YTEdit from "../Modal/YTEdit";
import axios from "axios";
import { formatTimestampDate } from "../../helpers/all";
import { UserContext } from "../../app/_context/User";
import logo from "@/assets/images/thumb-logo.jpg";
import { adminRoleObject } from "@/helpers/constant";

const convertToLinks = (text) => {
  if (!text) return "";
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, index) =>
    part.match(urlRegex) ? (
      <a
        key={index}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline"
      >
        {part}
      </a>
    ) : (
      part
    )
  );
};

const VideoCard = ({ item, view, editAble, type }) => {
  const { setLiveSessions } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  const handleDelete = async () => {
    const res = await axios.delete(
      type === "yt"
        ? `/api/admin/yt_video/${item._id}`
        : `/api/admin/videos/${item._id}`
    );
    if (res.status === 200) {
      setLiveSessions((prevVal) => {
        const updateVal = prevVal.filter((e) => e._id !== item._id);
        return updateVal;
      });
    }
  };

  return (
    <Fragment>
      {view === "grid" ? (
        <div className="card shadow-lg justify-around">
          {editAble && (
            <Dropdown
              setShowModal={setShowModal}
              setConfirmModal={setConfirmModal}
              item={item}
            />
          )}
          {type !== "yt" ? (
            <>
              <Link
                href={
                  editAble
                    ? `/admin/live_session/${item?._id}`
                    : `/live_session/${item._id}`
                }
              >
                <figure className="relative">
                  <Image
                    src={item?.thumbnail || logo}
                    alt="Thumbnail"
                    height={200}
                    width={200}
                    loading="lazy"
                    quality={70}
                  />
                  {item?.progress ? (
                    <div className="videoProgressBarContainer">
                      <div
                        className="videoProgressBarFill"
                        style={{ width: `${item.progress || 0}%` }}
                      ></div>
                    </div>
                  ) : (
                    ""
                  )}
                </figure>
                <h2 className="card-title text-base-100 text-lg font-medium">
                  {item?.title}
                </h2>
              </Link>
              <p className="text-gray-500 text-md font-normal decs">
                {convertToLinks(item?.description)}
              </p>
              <p className="text-base-200 text-sm font-normal history">
                {formatTimestampDate(item?.videoCreatedAt || item?.createdAt)}
              </p>
              {editAble && (
                <div className="mt-2">
                  <b>Categories: </b>
                  {item?.studentCategory &&
                    item?.studentCategory.length > 0 && (
                      <span>
                        {item.studentCategory
                          .map((cat) => adminRoleObject[cat] || cat)
                          .join(", ")}
                      </span>
                    )}
                </div>
              )}
            </>
          ) : (
            <>
              <Link
                href={
                  editAble
                    ? `/admin/yt_session/${item?._id}`
                    : `/yt_session/${item._id}`
                }
              >
                <figure className="relative">
                  <Image
                    src={item?.thumbnail || logo}
                    alt="Thumbnail 2"
                    height={200}
                    width={200}
                    loading="lazy"
                    quality={70}
                  />
                  {item?.progress ? (
                    <div className="videoProgressBarContainer">
                      <div
                        className="videoProgressBarFill"
                        style={{ width: `${item.progress || 0}%` }}
                      ></div>
                    </div>
                  ) : (
                    ""
                  )}
                </figure>
                <h2 className="card-title text-base-100 text-lg font-medium">
                  {item?.title}
                </h2>
              </Link>
              <p className="text-gray-500 text-md font-normal decs">
                {convertToLinks(item?.description)}
              </p>
              <p className="text-base-200 text-sm font-normal history">
                {formatTimestampDate(item?.videoCreatedAt || item?.createdAt)}
              </p>
              {editAble && (
                <div className="mt-2">
                  <b>Categories: </b>
                  {item?.studentCategory &&
                    item?.studentCategory.length > 0 && (
                      <span>
                        {item.studentCategory
                          .map((cat) => adminRoleObject[cat] || cat)
                          .join(", ")}
                      </span>
                    )}
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="card shadow-lg list-view">
          {editAble && (
            <Dropdown
              setShowModal={setShowModal}
              setConfirmModal={setConfirmModal}
              item={item}
            />
          )}
          {type !== "yt" ? (
            <>
              <div className="card-horizontal ">
                <Link
                  href={
                    editAble
                      ? `/admin/live_session/${item?._id}`
                      : `/live_session/${item._id}`
                  }
                >
                  <div className="cardheader">
                    <figure className="relative">
                      <Image
                        src={item?.thumbnail || logo}
                        alt="File"
                        height={100}
                        width={100}
                        loading="lazy"
                        quality={70}
                      />
                      {item?.progress ? (
                        <div className="videoProgressBarContainer">
                          <div
                            className="videoProgressBarFill"
                            style={{ width: `${item.progress || 0}%` }}
                          ></div>
                        </div>
                      ) : (
                        ""
                      )}
                    </figure>
                    <div>
                      <h2 className="card-title text-base-100 text-lg font-medium min-w-48 max-w-48">
                        {item?.title}
                      </h2>
                      <div className="text-base-200 text-sm font-normal history">
                        {formatTimestampDate(
                          item?.videoCreatedAt || item?.createdAt
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="cardbody p-0">
                  <div className="text-base-200 text-sm font-normal decs">
                    {convertToLinks(item?.description)}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="card-horizontal ">
                <Link
                  href={
                    editAble
                      ? `/admin/yt_session/${item?._id}`
                      : `/yt_session/${item._id}`
                  }
                >
                  <div className="cardheader">
                    <figure className="relative">
                      <Image
                        src={item?.thumbnail || logo}
                        alt="File"
                        height={100}
                        width={100}
                        loading="lazy"
                        quality={70}
                      />
                      {item?.progress ? (
                        <div className="videoProgressBarContainer">
                          <div
                            className="videoProgressBarFill"
                            style={{ width: `${item.progress || 0}%` }}
                          ></div>
                        </div>
                      ) : (
                        ""
                      )}
                    </figure>
                    <div>
                      <h2 className="card-title text-base-100 text-lg font-medium min-w-48 max-w-48">
                        {item?.title}
                      </h2>
                      <div className="text-base-200 text-sm font-normal history">
                        {formatTimestampDate(
                          item?.videoCreatedAt || item?.createdAt
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="cardbody p-0">
                  <div className="text-base-200 text-sm font-normal decs">
                    {convertToLinks(item?.description)}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {type !== "yt"
        ? showModal && (
            <VideoEdit
              showModal={showModal}
              setShowModal={setShowModal}
              modalTitle="Edit video Details"
              item={item}
            />
          )
        : showModal && (
            <YTEdit
              showModal={showModal}
              setShowModal={setShowModal}
              modalTitle="Edit video Details"
              item={item}
            />
          )}

      {confirmModal && (
        <ConfirmModal
          showModal={confirmModal}
          setShowModal={setConfirmModal}
          modalTitle="Are you sure you want to delete this video?"
          onClick={handleDelete}
          id={item._id}
        />
      )}
    </Fragment>
  );
};

export default VideoCard;
