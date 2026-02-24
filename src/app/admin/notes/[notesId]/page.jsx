"use client";

import dynamic from "next/dynamic";

const NotesSinglePage = dynamic(
  () => import("@/components/NotesSinglePage/NotesSinglePage"),
  { ssr: false }
);

export default function page({ params: { notesId } }) {
  return <NotesSinglePage notesId={notesId} admin={true} />;
}
