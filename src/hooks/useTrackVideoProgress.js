import { secToMin } from "@/helpers/all";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

const useTrackVideoProgress = (playerRef, videoId) => {
  const [isVideoPlay, setIsVideoPlay] = useState(false);
  const lastLoggedSecond = useRef(null);
  const cancelTokenSourceRef = useRef(null);

  useEffect(() => {
    let frameId;

    const updateLastViewedTime = async (
      watchedDuration,
      videoDuration = null
    ) => {
      if (cancelTokenSourceRef.current) {
        cancelTokenSourceRef.current.cancel("Cancelled due to new request");
      }

      const source = axios.CancelToken.source();
      cancelTokenSourceRef.current = source;

      try {
        await axios.post(
          "/api/videos/progress",
          { videoId, watchedDuration, videoDuration },
          {
            headers: {
              "Content-Type": "application/json",
            },
            cancelToken: source.token,
          }
        );
      } catch (error) {
        if (axios.isCancel(error) || error.name === "CanceledError") {
          // Optional: log or silently ignore
          // console.log("Request canceled");
        } else {
          console.error("❌ Failed to update last view:", error);
        }
      }
    };

    const trackTime = async () => {
      const video = playerRef.current?.video?.video;
      if (video && !video.paused && !video.ended) {
        const currentSecond = Math.floor(video.currentTime);
        if (
          currentSecond % 10 === 0 &&
          lastLoggedSecond.current !== currentSecond
        ) {
          lastLoggedSecond.current = currentSecond;

          const formattedDuration = secToMin(currentSecond);
          const videoDuration = secToMin(video.duration);
          // console.log("⏱️ Video at:", formattedDuration, "min");
          updateLastViewedTime(formattedDuration, videoDuration);
        }
        frameId = requestAnimationFrame(trackTime);
      }
    };

    const setupListeners = () => {
      const video = playerRef.current?.video?.video;
      if (!video) return;

      const handlePlay = () => {
        // console.log("▶️ Play");
        setIsVideoPlay(true);
        frameId = requestAnimationFrame(trackTime);
      };

      const handlePause = () => {
        // console.log("⏸️ Pause");
        cancelAnimationFrame(frameId);
      };

      const handleEnded = () => {
        // console.log("✅ Ended");
        cancelAnimationFrame(frameId);
      };

      video.addEventListener("play", handlePlay);
      video.addEventListener("pause", handlePause);
      video.addEventListener("ended", handleEnded);

      // Cleanup
      return () => {
        video.removeEventListener("play", handlePlay);
        video.removeEventListener("pause", handlePause);
        video.removeEventListener("ended", handleEnded);
        cancelAnimationFrame(frameId);
      };
    };

    // Wait until video is ready
    const waitInterval = setInterval(() => {
      const video = playerRef.current?.video?.video;
      if (video) {
        clearInterval(waitInterval);
        const cleanup = setupListeners();
        if (cleanup) {
          return cleanup;
        }
      }
    }, 200);

    return () => {
      clearInterval(waitInterval);
      cancelAnimationFrame(frameId);
      if (cancelTokenSourceRef.current) {
        cancelTokenSourceRef.current.cancel("Cleanup: Component unmounted");
      }
    };
  }, [playerRef, videoId]);

  return { isVideoPlay };
};

export default useTrackVideoProgress;
