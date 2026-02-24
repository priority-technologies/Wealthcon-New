"use client";

import { useContext, useEffect, useState, useCallback } from "react";
import PageLoading from "../Loading/PageLoading";
import VideoCard from "../Card/VideoCard";
import { UserContext } from "../../app/_context/User";
import axios from "axios";
import Pagination from "../Pagination";
import { useRouter } from "next/navigation";

export default function Index({ view, setView, editAble, filter }) {
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

  const fetchData = useCallback(
    async (page, sortParams) => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/videos`, {
          params: {
            sortBy: sortParams.sortBy,
            category: sortParams.category,
            page,
          },
        });
        setLiveSessions(response.data.videos);

        const currentPage = Number(response.headers["x-current-page"]);
        const totalPages = Number(response.headers["x-total-pages"]);
        const totalCount = Number(response.headers["x-total-item"]);

        setCurrentPage(currentPage);
        setTotalPages(totalPages);
        setTotalItem(totalCount);
      } catch (error) {
        if (error?.response?.status === 401) {
          return router.push("/login");
        }
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setLiveSessions]
  );

  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      return;
    }

    fetchData(currentPage, sortParams);
  }, [currentPage, sortParams, fetchData, initialLoad]);

  useEffect(() => {
    setSortParams({
      sortBy: filter.sortBy,
      category: filter.category,
    });
    setCurrentPage(1);
  }, [filter]);

  if (loading) {
    return <PageLoading />;
  }

  return (
    <div>
      <div
        className={`mt-5 grid custom_scroll ${
          view === "grid"
            ? "grid-view grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4"
            : "list-view grid-cols-1 gap-2"
        }`}
      >
        {liveSessions?.length ? (
          <>
            {liveSessions.map((item, index) => (
              <VideoCard
                key={index}
                item={item}
                view={view}
                editAble={editAble}
              />
            ))}
          </>
        ) : (
          <div>Session Not Available</div>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItem={totalItem}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
