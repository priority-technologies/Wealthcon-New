"use client";

import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import PageLoading from "../Loading/PageLoading";
import VideoCard from "../Card/VideoCard";
import { UserContext } from "../../app/_context/User";
import axios from "axios";
import Pagination from "../Pagination";
import { useRouter } from "next/navigation";

export default function Index({ view, editAble, type, filter, typeOfVideo }) {
  const router = useRouter();
  const { liveSessions, setLiveSessions, loading, setLoading } =
    useContext(UserContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItem, setTotalItem] = useState(0);
  const [sortParams, setSortParams] = useState({
    sortBy: filter.sortBy,
    category: filter.category,
  });
  const [initialLoad, setInitialLoad] = useState(true);

  const isShorts = typeOfVideo === "shorts";

  const fetchData = useCallback(
    async (page, sortParams) => {
      try {
        setLoading(true);

        const response = await axios.get(
          type === "watch_later" ? `/api/watch-later` : `/api/videos`,
          {
            params: {
              sortBy: sortParams.sortBy,
              category: sortParams.category,
              page,
              shorts: isShorts,
            },
          }
        );

        setLiveSessions(response.data.videos || []);
        setCurrentPage(Number(response.headers["x-current-page"] || 1));
        setTotalPages(Number(response.headers["x-total-pages"] || 1));
        setTotalItem(Number(response.headers["x-total-item"] || 0));
      } catch (error) {
        if (error?.response?.status === 401) {
          router.push("/login");
        }
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setLiveSessions, isShorts, type, router]
  );

  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      return;
    }
    fetchData(currentPage, sortParams);
  }, [currentPage, sortParams, fetchData, initialLoad]);

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
        {Array.isArray(liveSessions) && liveSessions.length ? (
          liveSessions.map((item, index) => (
            <VideoCard
              key={index}
              item={item}
              view={view}
              editAble={editAble}
            />
          ))
        ) : (
          <div>Session Not Available</div>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItem={totalItem}
        onPageChange={(e) => {
          if (!loading) {
            setCurrentPage(e);
            sessionStorage.setItem("lp", e);
          }
        }}
      />
    </div>
  );
}
