"use client";

import dynamic from "next/dynamic";
import usePreventActions from "@/hooks/usePreventActions";

const NotesSinglePage = dynamic(
  () => import("@/components/NotesSinglePage/NotesSinglePage"),
  { ssr: false }
);

export default function Notepage({ params: { notesId } }) {
  //usePreventActions();
  // const pdf =
  // 	'https://wealthcon-lms.s3.ap-south-1.amazonaws.com/notes/test.pdf';
  return (
    <div className="pdf-container">
      <NotesSinglePage notesId={notesId} admin={false}/>
    </div>
  );
}
