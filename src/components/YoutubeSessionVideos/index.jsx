"use client";

import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import PageLoading from "../Loading/PageLoading";
import VideoCard from "../Card/VideoCard";
import { UserContext } from "../../app/_context/User";
import axios from "axios";
import Pagination from "../Pagination";
import { useRouter } from "next/navigation";

export default function YouTubeIndex({ view, editAble, type, filter, typeOfVideo }) {
  const router = useRouter();
  const { loading, setLoading } = useContext(UserContext);

  const [youtubeVideos, setYouTubeVideos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItem, setTotalItem] = useState(0);
  const [sortParams, setSortParams] = useState({
    sortBy: filter.sortBy,
    category: filter.category,
  });

  const [initialLoad, setInitialLoad] = useState(true);

  const isShorts = typeOfVideo === "shorts";


  const fetchYouTubeVideos = useCallback(
    async (page, sortParams) => {
      try {
        setLoading(true);

        const response = await axios.get(`/api/yt_video`, {
          params: {
            sortBy: sortParams.sortBy,
            category: sortParams.category,
            page,
            shorts: isShorts,
          },
        });

        setYouTubeVideos(response.data.videos || []);
        setCurrentPage(Number(response.headers["x-current-page"] || 1));
        setTotalPages(Number(response.headers["x-total-pages"] || 1));
        setTotalItem(Number(response.headers["x-total-item"] || 0));
      } catch (error) {
        if (error?.response?.status === 401) {
          router.push("/login");
        }
        console.error("Error fetching YouTube videos:", error);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, router, isShorts, type,]
  );

  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      return;
    }
    fetchYouTubeVideos(currentPage, sortParams);
  }, [currentPage, sortParams, fetchYouTubeVideos, initialLoad]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const validFilter = filter || { sortBy: "date", category: "all" };
      setSortParams({
        sortBy: validFilter.sortBy,
        category: validFilter.category,
      });
      const getSessionId = sessionStorage.getItem("lp");
      setCurrentPage(getSessionId ? Number(getSessionId) : 1);
    }
  }, [filter]);

  const gridClass = useMemo(
    () =>
      view === "grid"
        ? "grid-view grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4"
        : "list-view grid-cols-1 gap-2",
    [view]
  );

  if (loading) {
      return <PageLoading />;
  }

  return (
    <div>
      <div className={`mt-5 grid custom_scroll ${gridClass}`}>
        {youtubeVideos.length ? (
          youtubeVideos.map((item, index) => (
            <VideoCard key={index} item={item} view={view} editAble={editAble} type="yt" />
          ))
        ) : (
          <div>No YouTube Videos Available</div>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItem={totalItem}
        onPageChange={(e) => {
          setCurrentPage(e);
          sessionStorage.setItem("youtubePage", e);
        }}
      />
    </div>
  );
}
