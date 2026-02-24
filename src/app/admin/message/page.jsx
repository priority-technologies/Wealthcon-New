"use client";

import React, { Fragment, useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "@/app/_context/User";
import InfiniteScroll from "react-infinite-scroll-component";
import Filter from "@/components/Filter";
import ShowMessage from "@/components/ShowMessage";
import { useRouter } from "next/navigation";
import VideoLoading from "@/components/Loading/VideoLoading";

function Message() {
  const router = useRouter();
  const { messages, setMessages, loading, setLoading } =
    useContext(UserContext);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [view, setView] = useState("grid");

  const fetchData = async (pageNum) => {
    if (pageNum === 1) {
      setLoading(true);
    }

    try {
      const res = await axios.get(`/api/messages?page=${pageNum}`);
      if (res.status === 200) {
        if (pageNum === 1) {
          setMessages(res.data.messages);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            ...res.data.messages,
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
        title="Dr. Ram's Messages"
        type="message"
        view={view}
        setView={setView}
        admin={true}
      />
      <InfiniteScroll
        dataLength={messages?.length || []}
        next={loadMoreMessages}
        hasMore={hasMore}
        loader={!loading && <VideoLoading />}
        className="xl:space-y-6 space-y-3 !overflow-hidden"
      >
        <ShowMessage
          type="Message"
          loading={loading}
          messages={messages}
          setMessages={setMessages}
          messageByRam
        />
      </InfiniteScroll>
    </Fragment>
  );
}

export default Message;
