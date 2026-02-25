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

  // Comment approval states
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [approvingCommentId, setApprovingCommentId] = useState(null);
  const [rejectingCommentId, setRejectingCommentId] = useState(null);

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

  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      const response = await axios.get(`/api/videos/${videoId}/comments`, {
        headers: { 'x-user-role': 'admin' },
      });
      if (response.status === 200) {
        const pendingComments = (response.data.comments || []).filter(
          (c) => c.status === 'pending' || !c.isApproved
        );
        setComments(pendingComments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error.message);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleApproveComment = async (commentId) => {
    try {
      setApprovingCommentId(commentId);
      const response = await axios.put('/api/admin/comments', {
        commentId,
        status: 'approved',
      });
      if (response.status === 200) {
        setComments(comments.filter((c) => c._id !== commentId));
      }
    } catch (error) {
      console.error('Error approving comment:', error.message);
      alert('Failed to approve comment');
    } finally {
      setApprovingCommentId(null);
    }
  };

  const handleRejectComment = async (commentId) => {
    try {
      setRejectingCommentId(commentId);
      const response = await axios.put('/api/admin/comments', {
        commentId,
        status: 'rejected',
      });
      if (response.status === 200) {
        setComments(comments.filter((c) => c._id !== commentId));
      }
    } catch (error) {
      console.error('Error rejecting comment:', error.message);
      alert('Failed to reject comment');
    } finally {
      setRejectingCommentId(null);
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
      fetchComments();
    }
  }, [videoId, admin]);

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
            <video
              ref={playerRef}
              className="videoPlayer aspect-video mb-4 w-full bg-black rounded"
              poster={video?.thumbnail || logo?.src}
              controls
              playsInline
              onContextMenu={(e) => e.preventDefault()}
              style={{ maxWidth: "100%", height: "auto" }}
            >
              {video?.videoUrl && (
                <source src={video.videoUrl} type={videoSrcType || "video/mp4"} />
              )}
              Your browser does not support the video tag.
            </video>
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

          {admin && (
            <div className="mt-8">
              <h2 className="text-lg font-bold py-4 border-b border-gray-300">Comments Pending Approval</h2>
              {commentsLoading ? (
                <div className="py-4">
                  <VideoLoading />
                </div>
              ) : comments.length === 0 ? (
                <div className="py-4 text-center text-gray-600">
                  No comments pending approval
                </div>
              ) : (
                <div className="space-y-4 mt-4">
                  {comments.map((comment) => (
                    <div key={comment._id} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      {/* Comment Header */}
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {comment.authorName || 'Anonymous'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(comment.postedAt || comment.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                          Pending
                        </span>
                      </div>

                      {/* Comment Text */}
                      <p className="text-gray-700 mb-3">{comment.commentText}</p>

                      {/* Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mb-3 pl-3 border-l-2 border-gray-300 text-sm">
                          <p className="text-xs font-semibold text-gray-600 mb-2">
                            Replies ({comment.replies.length}):
                          </p>
                          {comment.replies.map((reply, idx) => (
                            <div key={idx} className="mb-2">
                              <p className="font-semibold text-gray-700 text-sm">
                                {reply.authorName}
                              </p>
                              <p className="text-gray-600 text-sm">{reply.replyText}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Meta */}
                      <div className="flex gap-4 text-xs text-gray-600 mb-3">
                        {comment.likes > 0 && <span>👍 {comment.likes} likes</span>}
                        {comment.replies && comment.replies.length > 0 && (
                          <span>💬 {comment.replies.length} replies</span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-3 border-t border-gray-300">
                        <button
                          onClick={() => handleApproveComment(comment._id)}
                          disabled={approvingCommentId === comment._id}
                          className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 disabled:bg-green-400 font-semibold"
                        >
                          {approvingCommentId === comment._id ? 'Approving...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleRejectComment(comment._id)}
                          disabled={rejectingCommentId === comment._id}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 disabled:bg-red-400 font-semibold"
                        >
                          {rejectingCommentId === comment._id ? 'Rejecting...' : 'Reject'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
