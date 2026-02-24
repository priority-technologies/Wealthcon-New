import Users from "@/schemas/Users";
import Notes from "../../../../schemas/Notes";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const loggedUserId = request.headers.get("x-user-id");
  const noteId = params?.noteId;

  // Validate inputs
  if (!loggedUserId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  if (!noteId || !mongoose.isValidObjectId(noteId)) {
    return NextResponse.json({ error: "Invalid note ID format" }, { status: 400 });
  }

  const objectId = new mongoose.Types.ObjectId(noteId);

  try {
    // Fetch the note and update the user's view status in parallel
    const note = await Notes.findById(objectId)

    // Check if the note exists
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    const newNote = note.toObject()
    return NextResponse.json({
      ...newNote,
      thumbnail: newNote.thumbnailFileName ? `${process.env.AWS_CLOUDFRONT_URL}/${newNote.thumbnailFileName}` : "",
      noteUrl: `${process.env.AWS_CLOUDFRONT_URL}/${newNote.noteFileName}`,
    });

  } catch (error) {
    console.error("Error fetching note:", error.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
