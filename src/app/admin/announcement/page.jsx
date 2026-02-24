"use client";

import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Filter from "../../../components/Filter";
import ShowMessage from "../../../components/ShowMessage";
import axios from "axios";
import { UserContext } from "@/app/_context/User";
import { useRouter } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";

function Announcement() {
  const router = useRouter();
  const { announcements, setAnnouncements, loading, setLoading } =
    useContext(UserContext);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [view, setView] = useState("grid");

  const fetchData = async (pageNum) => {
    if (pageNum === 1) {
      setLoading(true);
    }
    try {
      const res = await axios.get(`/api/allAnnouncements?page=${pageNum}`);
      if (res.status === 200) {
        if (pageNum === 1) {
          setAnnouncements(res.data.announcements);
        } else {
          setAnnouncements((prevMessages) => [
            ...prevMessages,
            ...res.data.announcements,
          ]);
        }
        setHasMore(res.data.hasMore);
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        return router.push("/login");
      }
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const loadMoreMessages = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1); // Increment the page number
    }
  };

  return (
    <Fragment>
      <Filter
        title="Admin's Update"
        type="announcement"
        view={view}
        setView={setView}
        admin={true}
      />
      {/* <div className="custom_scroll mt-5"> */}
      <InfiniteScroll
        dataLength={announcements?.length || []}
        next={loadMoreMessages}
        hasMore={hasMore}
        loader={<>Loading...</>}
        className="xl:space-y-6 space-y-3"
      >
        <ShowMessage
          type="Announcement"
          loading={loading}
          messages={announcements}
          setMessages={setAnnouncements}
        />
      </InfiniteScroll>
      {/* </div> */}
    </Fragment>
  );
}

export default Announcement;
