"use client";

import { Fragment, useEffect, useState } from "react";
import "./modal.scss";
import Button from "../Button";
import CloseIcon from "../../assets/images/svg/closeIcon.svg";
import openEyeGray from "../../assets/images/svg/openEyeGray.svg";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import User from "../User";
import VideoLoading from "../Loading/VideoLoading";
import Image from "next/image";

const ViewUserModel = ({ id, showModal, setShowModal, type }) => {
  const [data, setData] = useState([]); 
  const [viewUserCount, setViewUserCount] = useState(0);
  const [page, setPage] = useState(1); 
  const [hasMore, setHasMore] = useState(false); 
  const [loading, setLoading] = useState(false); 
  
  const closeModal = () => {
    setShowModal(false);
    setData([]);
    setPage(1);
    setHasMore(true);
  };

  const fetchData = async (pageNum) => {
    pageNum === 1 && setLoading(true);
    try {
      const res = await axios.get(
        type === "gallery"
          ? `/api/admin/gallery/${id}/view?page=${pageNum}` 
          :  type === "Message" 
          ?  `/api/admin/messages/${id}/view?page=${pageNum}`
          : `/api/admin/announcements/${id}/view?page=${pageNum}`
      );
      if (res.status === 200) {
        if (pageNum === 1) {
          setData(res.data.users || []);
        } else {
          setData((prevUsers) => [...prevUsers, ...(res.data.users || [])]);
        }
        setViewUserCount(res.data.userCount || 0);
        setHasMore(res.data.hasMore);
      }
    } catch (error) {
      console.error("Error fetching user details:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showModal && id) {
      fetchData(page);
    }
  }, [showModal, id, page]);

  const loadMoreUsers = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <Fragment>
      {showModal && (
        <dialog className="modal" open={showModal}>
          <div className="relative modal-box rounded-none bg-primary-content">
            <div className="flex justify-between">
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-lg font-bold">Users Viewed</h2>
                {!!viewUserCount && (
                  <p className="flex gap-1 text-xs text-gray-500">
                    <Image src={openEyeGray} alt="eye" width={15} height={15} />
                    <span>{viewUserCount}</span>
                  </p>
                )}
              </div>
              <Button
                size="btn-sm"
                variant="btn-ghost"
                className="bg-primary hover:bg-base-200 z-[10] right-2 top-2"
                iconPosition="left"
                icon={CloseIcon}
                onClick={closeModal}
              />
            </div>
            <div id="scrollableDiv" className="h-72 overflow-y-scroll">
              {loading ? (
                <VideoLoading />
              ) : data?.length ? (
                <InfiniteScroll
                  dataLength={data?.length || []}
                  next={loadMoreUsers}
                  hasMore={hasMore}
                  loader={<VideoLoading />}
                  className="xl:space-y-3 space-y-3 !overflow-hidden"
                  scrollableTarget="scrollableDiv"
                >
                  {data.map((user, index) => (
                    <User key={index} name={user.username} email={user.email} />
                  ))}
                </InfiniteScroll>
              ) : (
                <div>Users not available</div>
              )}
            </div>
          </div>
        </dialog>
      )}
    </Fragment>
  );
};

export default ViewUserModel;
