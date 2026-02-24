"use client";

import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import PageLoading from "../Loading/PageLoading";
import BackPage from "@/assets/images/svg/backPage.svg";
import Button from "../Button";
import { useEffect, useState } from "react";
import axios from "axios";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";

export default function ViewerComponent({
  notesId,
  pdfUrl,
  showPdf,
  setShowPdf,
  type,
  loading,
}) {
  const noteView = async () => {
    if (!showPdf) {
      return;
    }
    try {
      await axios.get(`/api/notes/${notesId}/view`);
    } catch (error) {
      if (error?.response?.status === 401) {
        return router.push("/login");
      }
      console.error(error.message);
    }
  };

  useEffect(() => {
    noteView();
  }, [showPdf]);

  if (loading) {
    return <PageLoading />;
  }
  return (
    <>
      <Button
        icon={BackPage}
        iconPosition="left"
        className="bg-transparent text-blue-700 hover:bg-transparent font-semibold py-2 px-4 border  rounded btn-sm"
        onClick={() => setShowPdf(false)}
      />
      <div
        className="rajat mt-2 no-select"
        style={{
          border: "1px solid rgba(0, 0, 0, 0.3)",
          height: "750px",
          overflow: "auto",
        }}
      >
        {type === "pdf" && (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <Viewer
              fileUrl={pdfUrl}
            />
          </Worker>
        )}
        {(type === "word" || type === "excel") && (
          <DocViewer
            documents={[{ uri: pdfUrl }]}
            pluginRenderers={DocViewerRenderers}
          />
        )}
      </div>
    </>
  );
}