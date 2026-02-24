"use client";

import { useRouter } from "next/navigation";
import ViewerComponent from "@/components/ViewerComponent";
import Button from "@/components/Button";
import BackPage from "@/assets/images/svg/backPage.svg";
import openEyeGray from "@/assets/images/svg/openEyeGray.svg";
import { useEffect, useState } from "react";
import VideoLoading from "@/components/Loading/VideoLoading";
import PageLoading from "@/components/Loading/PageLoading";
import axios from "axios";
import Image from "next/image";
import { adminRoleObject } from "@/helpers/constant";
import logo from "@/assets/images/thumb-logo.jpg";
import User from "../User";
import InfiniteScroll from "react-infinite-scroll-component";

export default function NotesSinglePage({ notesId, admin }) {
  const router = useRouter();

  const [relatednotes, setRelatednotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedNotesLoading, setRelatedNotesLoading] = useState(false);

  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfData, setPdfData] = useState(null);
  const [showPdf, setShowPdf] = useState(false);

  const [viewData, setViewData] = useState([]);
  const [viewUserCount, setViewUserCount] = useState(0);
  const [viewPage, setViewPage] = useState(1);
  const [viewHasMore, setviewHasMore] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/notes/${notesId}`);
        if (res.status === 200) {
          setPdfUrl(res.data.noteUrl);
          setPdfData(res.data);
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
    fetchData();
  }, [notesId]);

  const linkifyDescription = (description) => {
    const urlPattern =
      /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    return description.replace(
      urlPattern,
      '<a href="$1" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">$1</a>'
    );
  };

  const fetchRelatedNotes = async () => {
    if (!pdfData?.title) {
      return;
    }
    try {
      setRelatedNotesLoading(true);
      const relatedRes = await axios.post(`/api/notes/${notesId}/related`, {
        title: pdfData.title,
      });
      setRelatednotes(relatedRes.data);
    } catch (error) {
      if (error?.response?.status === 401) {
        return router.push("/login");
      }
      console.error(error.message);
    } finally {
      setRelatedNotesLoading(false);
    }
  };

  const fetchNotesViewUser = async (pageNum) => {
    pageNum === 1 && setViewLoading(true);
    try {
      const res = await axios.get(
        `/api/admin/notes/${notesId}/view?page=${pageNum}`
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
    if (notesId) {
      fetchNotesViewUser(viewPage);
    }
  }, [notesId, viewPage]);

  const loadMoreUsers = () => {
    if (!viewLoading && viewHasMore) {
      setViewPage((prevPage) => prevPage + 1);
    }
  };

  if (loading) {
    return <PageLoading />;
  }

  if (!pdfData) {
    return <div>No Notes Available!</div>;
  }

  return (
    <div className="pdf-container">
      {showPdf ? (
        <ViewerComponent
          notesId={notesId}
          pdfUrl={pdfUrl}
          showPdf={showPdf}
          setShowPdf={setShowPdf}
          type={pdfData?.type}
        />
      ) : (
        <div>
          <div className="mb-4">
            <Button
              icon={BackPage}
              iconPosition="left"
              className="bg-transparent text-blue-700 hover:bg-transparent font-semibold py-2 px-4 border border-blue-500 rounded btn-sm"
              onClick={router.back}
            />
          </div>
          <div className="grid grid-cols-5 gap-4 video-single">
            {/* <div className="lg:col-span-2 col-span-5 order-2 lg:order-1">
            <div className="flex justify-between">
              <h2 className="card-title text-base-100 text-2xl font-bold mb-2">
                Related Notes
              </h2>

              <Button
                icon={BackPage}
                iconPosition="left"
                className="bg-transparent text-blue-700 hover:bg-transparent font-semibold py-2 px-4 border border-blue-500 rounded btn-sm"
                onClick={router.back}
              />
            </div>
            <div className="video_scroll">
              {relatedNotesLoading ? (
                <VideoLoading />
              ) : relatednotes.length ? (
                relatednotes.map((val, index) => (
                  <NotesListing
                    className="mb-4"
                    key={index}
                    val={val}
                    admin={true}
                  />
                ))
              ) : (
                <div>Related Notes Not Available</div>
              )}
            </div>
          </div> */}
            <div className="lg:col-span-3 col-span-5 order-1 lg:order-2">
              <div className="flex justify-center flex-col">
                <div onClick={() => setShowPdf(!showPdf)}>
                  <div className="max-w-sm rounded overflow-hidden shadow-lg mb-4 cursor-pointer">
                    <Image
                      className="w-full"
                      src={pdfData?.thumbnail || logo}
                      width={200}
                      height={200}
                      alt="Notes thumbnail"
                    />
                  </div>
                </div>
                <h2 className="card-title text-base-100 text-2xl font-bold mb-2 text-left w-full">
                  {pdfData?.title}
                </h2>
                <p
                  className="whitespace-pre-wrap text-gray-500 text-md font-normal decs mb-4 text-left w-full"
                  dangerouslySetInnerHTML={{
                    __html: linkifyDescription(pdfData?.description || ""),
                  }}
                ></p>
                {admin && (
                  <>
                    <div className="mt-2 mb-2">
                      <b>Categories: </b>
                      {pdfData?.studentCategory &&
                        pdfData?.studentCategory.length > 0 && (
                          <span>
                            {pdfData.studentCategory
                              .map((cat) => adminRoleObject[cat] || cat)
                              .join(", ")}
                          </span>
                        )}
                    </div>

                    <div className="mt-5">
                      <div className="flex justify-between">
                        <h2 className="text-lg font-bold py-2">Users Viewed</h2>
                        {!!viewUserCount && (
                          <p className="flex items-center justify-center gap-1 text-xs text-gray-500">
                            <Image
                              src={openEyeGray}
                              alt="eye"
                              width={15}
                              height={15}
                            />
                            <span>{viewUserCount}</span>
                          </p>
                        )}
                      </div>
                      <div
                        id="scrollableDiv"
                        className="h-72 overflow-y-scroll"
                      >
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
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
