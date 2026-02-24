"use client";

import GallaryCard from "../Card/GallaryCard";
import GalleryModal from "../Modal/GalleryModal";
import { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import PageLoading from "../Loading/PageLoading";
import { UserContext } from "../../app/_context/User";
import Pagination from "../Pagination";
import { useRouter } from "next/navigation";

export default function GallaryImages({ view, editAble, filter, type }) {
  const router = useRouter();
  const { gallery, setGallery, loading, setLoading } = useContext(UserContext);

  const [clickIndex, setClickIndex] = useState(null);

  const [gallaryModal, setGallaryModal] = useState(false);
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
        const response = await axios.get(
          type === "quote" ? `/api/quote` : `/api/gallery`,
          {
            params: {
              sortBy: sortParams.sortBy,
              page,
            },
          }
        );

        setGallery(
          type === "quote" ? response.data.quotes : response.data.gallery
        );

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
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setGallery, type]
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
    setCurrentPage(1);
  }, [filter]);

  if (loading) {
    return <PageLoading />;
  }
  
  return (
    <div>
      <GalleryModal
        data={gallery}
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
        {gallery?.length ? (
          gallery.map((item, index) => (
            <GallaryCard
              key={index}
              item={item}
              setClickIndex={setClickIndex}
              index={index}
              gallaryModal={gallaryModal}
              setGallaryModal={setGallaryModal}
              view={view}
              editAble={editAble}
              type={type}
            />
          ))
        ) : (
          <div>
            {type === "quote"
              ? "Quotes Not Available"
              : "Gallery Images Not Available"}
          </div>
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
