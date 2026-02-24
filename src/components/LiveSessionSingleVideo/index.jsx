"use client";

import {
  Player,
  ControlBar,
  ReplayControl,
  ForwardControl,
  CurrentTimeDisplay,
  TimeDivider,
  PlaybackRateMenuButton,
  VolumeMenuButton,
} from "video-react";
import "video-react/dist/video-react.css";
import "./video_single.scss";
import VideoListing from "../VideoListing";
import React, { useEffect, useRef, useState } from "react";
import Button from "../Button";
import openEyeGray from "../../assets/images/svg/openEyeGray.svg";
import CorrectCircleIcon from "../../assets/images/svg/correctCircle.svg";
import PlusCircleIcon from "../../assets/images/svg/plusCircle.svg";
import BackPage from "../../assets/images/svg/backPage.svg";
import PageLoading from "../Loading/PageLoading";
import axios from "axios";
import VideoLoading from "../Loading/VideoLoading";
import { useRouter } from "next/navigation";
import { adminRoleObject } from "@/helpers/constant";
import InfiniteScroll from "react-infinite-scroll-component";
import User from "../User";
import Image from "next/image";
import logo from "@/assets/images/thumb-logo.jpg";
import useTrackVideoProgress from "@/hooks/useTrackVideoProgress";
import { minToSec, secToMin } from "@/helpers/all";

export default function LiveSessionSingleVideo({ videoId, admin }) {
  const router = useRouter();
  const playerRef = useRef(null);
  const { isVideoPlay } = useTrackVideoProgress(playerRef, videoId);
  const [video, setVideo] = useState(null);
  const [savedLater, setSavedLater] = useState(false);
  const [videoSrcType, setVideoSrcType] = useState([]);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedVideoLoading, setRelatedVideoLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  const [viewData, setViewData] = useState([]);
  const [viewUserCount, setViewUserCount] = useState(0);
  const [viewPage, setViewPage] = useState(1);
  const [viewHasMore, setviewHasMore] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [watchProgress, setWatchProgress] = useState(0);

  const handleSaveLater = async () => {
    try {
      setBtnLoading(true);
      const response = await axios.post("/api/watch-later", {
        videoId,
        action: savedLater ? "remove" : "add",
      });
      if (response.status === 200) {
        setSavedLater((presVal) => !presVal);
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        return router.push("/login");
      }
      console.error(error.message);
    } finally {
      setBtnLoading(false);
    }
  };

  const fetchVideoData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/videos/${videoId}`);
      if (res.status !== 200) {
        return;
      }
      let { data } = res;

      const ext = data.videoUrl.split(".").pop();
      const validExtensions = ["mp4", "webm", "ogg"];
      if (validExtensions.includes(ext)) {
        setVideoSrcType(`video/${ext}`);
      }

      if (!data?.videoDuration || data.videoDuration === 0) {
        const videoURL = data.videoUrl;

        const videoElement = document.createElement("video");
        videoElement.preload = "metadata";
        videoElement.src = videoURL;

        videoElement.onloadedmetadata = () => {
          const duration = videoElement.duration;
          const formattedDuration = secToMin(duration);

          data.videoDuration = formattedDuration;

          URL.revokeObjectURL(videoURL);
        };
      }
      if (data?.watchedDuration) {
        const total = minToSec(data?.videoDuration);
        const watched = minToSec(data?.watchedDuration || 0);
        const progress = (watched / total) * 100;
        setWatchProgress(progress);
      }

      setVideo(data);
      setSavedLater(data.savedLater);
    } catch (error) {
      if (error?.response?.status === 401) {
        return router.push("/login");
      }
      console.error("Error fetching video:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedVideos = async () => {
    if (!video?.title) {
      return;
    }
    try {
      setRelatedVideoLoading(true);
      const relatedRes = await axios.post(`/api/videos/${videoId}/related`, {
        title: video.title,
      });
      setRelatedVideos(relatedRes.data);
    } catch (error) {
      if (error?.response?.status === 401) {
        return router.push("/login");
      }
      console.error(error.message);
    } finally {
      setRelatedVideoLoading(false);
    }
  };

  const fetchVideosViewUser = async (pageNum) => {
    pageNum === 1 && setViewLoading(true);
    try {
      const res = await axios.get(
        `/api/admin/videos/${videoId}/view?page=${pageNum}`
      );
      if (res.status === 200) {
        if (pageNum === 1) {
          setViewData(res.data.users || []);
        } else {
          setViewData((prevUsers) => [...prevUsers, ...(res.data.users || [])]);
        }
        setViewUserCount(res.data.userCount || 0);
        setviewHasMore(res.data.hasMore);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setViewLoading(false);
    }
  };

  useEffect(() => {
    fetchVideoData();
  }, [videoId]);

  useEffect(() => {
    fetchRelatedVideos();
  }, [video]);

  useEffect(() => {
    if (videoId && admin) {
      fetchVideosViewUser(viewPage);
    }
  }, [videoId, viewPage, admin]);

  const loadMoreUsers = () => {
    if (!viewLoading && viewHasMore) {
      setViewPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (video?.videoUrl && playerRef.current) {
      // Load the new video and play it
      playerRef.current.load();
      playerRef.current.pause();
    }
  }, [video?.videoUrl]);

  const handleContextMenu = (e) => {
    e.preventDefault();
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

  if (!video) {
    return <div>No Video Available!</div>;
  }

  return (
    <>
      {!relatedVideos?.length ? (
        <div className="mb-4">
          <Button
            icon={BackPage}
            iconPosition="left"
            className="bg-transparent text-blue-700 hover:bg-transparent font-semibold py-2 px-4 border border-blue-500 rounded btn-sm"
            onClick={router.back}
          />
        </div>
      ) : (
        ""
      )}
      <div className="grid grid-cols-5 gap-4 video-single">
        {relatedVideos?.length ? (
          <div className="lg:col-span-2 col-span-5 order-2 lg:order-1 hidden">
            <div className="flex justify-between">
              <h2 className="card-title text-base-100 text-2xl font-bold mb-2">
                Short videos
              </h2>

              <Button
                icon={BackPage}
                iconPosition="left"
                className="bg-transparent text-blue-700 hover:bg-transparent font-semibold py-2 px-4 border border-blue-500 rounded btn-sm"
                onClick={router.back}
              />
            </div>
            <div className="video_scroll">
              {relatedVideoLoading ? (
                <VideoLoading />
              ) : relatedVideos.length ? (
                relatedVideos.map((val, index) => (
                  <VideoListing
                    className="mb-4"
                    key={index}
                    val={val}
                    admin={admin}
                  />
                ))
              ) : (
                <div>Short videos Not Available</div>
              )}
            </div>
          </div>
        ) : (
          ""
        )}

        <div className="lg:col-span-3 col-span-5 order-1 lg:order-2">
          <div
            className="video_player"
            onContextMenu={handleContextMenu}
            // onMouseDown={handleContextMenu}
            // onMouseUp={handleContextMenu}
            style={{
              maxWidth: "640px",
              width: "100%",
            }}
            >
            <Player
              ref={playerRef}
              autoPlay={false}
              className="videoPlayer aspect-video mb-4"
              poster={video?.thumbnail || logo?.src}
              onContextMenu={(e) => e.preventDefault()} // Disable right-click
              // onMouseDown={(e) => e.preventDefault()} // Disable mouse down actions
              // onMouseUp={(e) => e.preventDefault()} // Disable mouse up actions
              aspectRatio="16:9"
              fluid={true}
              playsInline
              // width={100}
              // height={100}
              startTime={minToSec(video?.watchedDuration) || 0}
            >
              {video?.videoUrl && (
                <source src={video.videoUrl} type={videoSrcType} />
              )}
              <ControlBar autoHide={false} autoHideTime={false}>
                <ReplayControl key={1} seconds={10} order={1.1} />
                <ForwardControl seconds={10} order={1.2} />
                <CurrentTimeDisplay order={4.1} />
                <TimeDivider order={4.2} />
                <PlaybackRateMenuButton
                  rates={[2, 1.5, 1.25, 1, 0.5, 0.1]}
                  order={7.1}
                />
                <VolumeMenuButton />
              </ControlBar>
            </Player>
            {!isVideoPlay && watchProgress ? (
              <div className="videoProgressBarContainer">
                <div
                  className="videoProgressBarFill"
                  style={{ width: `${watchProgress}%` }}
                ></div>
              </div>
            ) : (
              ""
            )}
          </div>
          <h2 className="card-title text-base-100 text-2xl font-bold mb-2">
            {video?.title}
          </h2>
          <p
            className="whitespace-pre-wrap text-gray-500 text-md font-normal decs mb-4"
            dangerouslySetInnerHTML={{
              __html: linkifyDescription(video?.description || ""),
            }}
          ></p>
          {admin && (
            <div className="mt-2 mb-2">
              <b>Categories: </b>
              {video?.studentCategory && video?.studentCategory.length > 0 && (
                <span>
                  {video.studentCategory
                    .map((cat) => adminRoleObject[cat] || cat)
                    .join(", ")}
                </span>
              )}
            </div>
          )}
          <Button
            icon={savedLater ? CorrectCircleIcon : PlusCircleIcon}
            iconPosition="left"
            className="btn-primary btn-sm"
            onClick={handleSaveLater}
            loading={btnLoading}
          >
            Watch later
          </Button>

          {admin && (
            <div className="mt-5">
              <div className="flex justify-between">
                <h2 className="text-lg font-bold py-2">Users Viewed</h2>
                {!!viewUserCount && (
                  <p className="flex items-center justify-center gap-1 text-xs text-gray-500">
                    <Image src={openEyeGray} alt="eye" width={15} height={15} />
                    <span>{viewUserCount}</span>
                  </p>
                )}
              </div>
              <div id="scrollableDiv" className="h-72 overflow-y-scroll">
                {viewLoading ? (
                  <VideoLoading />
                ) : viewData?.length ? (
                  <InfiniteScroll
                    dataLength={viewData?.length || []}
                    next={loadMoreUsers}
                    hasMore={viewHasMore}
                    loader={<VideoLoading />}
                    className="xl:space-y-3 space-y-3 !overflow-hidden"
                    scrollableTarget="scrollableDiv"
                  >
                    {viewData.map((user, index) => (
                      <User
                        key={index}
                        name={user.username}
                        email={user.email}
                      />
                    ))}
                  </InfiniteScroll>
                ) : (
                  <div>Users not available</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
