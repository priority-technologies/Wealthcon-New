export const maxDuration = 60;

import { NextResponse } from "next/server";
import Notes from "../../../../../schemas/Notes";
import connectToDatabase from "../../../../../_database/mongodb";

export async function POST(request) {
  try {
    const {
      filename,
      notesUrl,
      thumbnailName,
      thumbnailUrl,
      date,
      title,
      description,
      studentCategory,
      pageCount,
      type
    } = await request.json();

    if (
      !filename ||
      !notesUrl ||
      !date ||
      !title ||
      !description ||
      !studentCategory
    ) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const parsedDate = new Date(date);
    const currentTime = new Date();
    parsedDate.setHours(currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds());

    await connectToDatabase();
    // Save video details to MongoDB
    const newNotes = new Notes({
      title,
      description,
      thumbnail: thumbnailUrl,
      thumbnailFileName: thumbnailName,
      noteUrl: notesUrl,
      noteFileName: filename,
      studentCategory: JSON.parse(studentCategory),
      pageCount,
      type,
      notesCreatedAt: parsedDate
    });
    const { _id } = await newNotes.save();

    return NextResponse.json({
      message: "Upload complete",
      url: notesUrl,
      insertId: _id,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
