"use client";

import React, { useEffect, useContext, useState, useCallback } from "react";
import NotesCard from "../Card/NotesCard";
import PageLoading from "../Loading/PageLoading";
import { UserContext } from "../../app/_context/User";
import axios from "axios";
import Pagination from "../Pagination";
import { useRouter } from "next/navigation";
import GalleryModal from "../Modal/GalleryModal";
import GallaryCard from "../Card/GallaryCard";

export default function NoteComponent({ view, editAble, filter }) {
  const router = useRouter();
  const { notes, setNotes, loading, setLoading } = useContext(UserContext);

  const [gallaryModal, setGallaryModal] = useState(false);
  const [clickIndex, setClickIndex] = useState(null);
  const [gallarydata, setGallaryData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItem, setTotalItem] = useState(0);
  const [sortParams, setSortParams] = useState({
    sortBy: filter.sortBy,
  });
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchData = useCallback(
    async (page, sortParams) => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/notes`, {
          params: {
            sortBy: sortParams.sortBy,
            page,
          },
        });
        setNotes(response.data.notes);

        const galleryData = response.data.notes
          .filter((item) => item.type === "image")
          .map((item) => ({
            ...item,
            image: item.noteUrl,
          }));

        setGallaryData(galleryData);

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
    [setLoading, setNotes]
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
    });
    const getSessionId = sessionStorage.getItem("np");
    if (getSessionId) {
      setCurrentPage(Number(getSessionId));
    } else {
      setCurrentPage(1);
    }
  }, [filter]);

  if (loading) {
    return <PageLoading />;
  }

  return (
    <div>
      <GalleryModal
        data={gallarydata}
        showModal={gallaryModal}
        setShowModal={setGallaryModal}
        clickIndex={clickIndex}
        editAble={editAble}
      />
      <div
        className={`mt-5 custom_scroll grid ${
          view === "grid"
            ? "grid-view grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4"
            : "list-view grid-cols-1 gap-2"
        }`}
      >
        {notes?.length ? (
          notes.map((item, index) => {
            if (item.type === "image") {
              const imageIndex = gallarydata.findIndex(
                (val) => val._id === item._id
              );
              return (
                <GallaryCard
                  key={index}
                  item={{ ...item, image: item.noteUrl }}
                  setClickIndex={setClickIndex}
                  index={imageIndex}
                  gallaryModal={gallaryModal}
                  setGallaryModal={setGallaryModal}
                  view={view}
                  editAble={editAble}
                  type={item.type}
                />
              );
            }

            return (
              <NotesCard
                key={index}
                item={item}
                view={view}
                editAble={editAble}
              />
            );
          })
        ) : (
          <div>Notes Not Available</div>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItem={totalItem}
        onPageChange={(e) => {
          setCurrentPage(e);
          sessionStorage.setItem("np", e);
        }}
      />
    </div>
  );
}
