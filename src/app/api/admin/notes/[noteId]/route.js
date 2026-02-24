import { NextResponse } from "next/server";
import { s3 } from "../../../../../helpers/constant";
import Notes from "../../../../../schemas/Notes";
import connectToDatabase from "../../../../../_database/mongodb";

export async function PUT(request, { params: { noteId } }) {
  try {
    const {
      filename,
      notesUrl,
      thumbnailFileName,
      thumbnailUrl,
      date,
      title,
      description,
      studentCategory,
      pageCount,
      type,
    } = await request.json();
    const studentCat = JSON.parse(studentCategory);

    if (
      !filename ||
      !notesUrl ||
      !date ||
      !title ||
      !description ||
      !studentCat.length ||
      !type
    ) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const parsedDate = new Date(date);
    const currentTime = new Date();
    parsedDate.setHours(
      currentTime.getHours(),
      currentTime.getMinutes(),
      currentTime.getSeconds()
    );

    await connectToDatabase();

    const updateNotes = await Notes.updateOne(
      { _id: noteId },
      {
        $set: {
          title,
          description,
          thumbnail: thumbnailUrl,
          thumbnailFileName,
          noteUrl: notesUrl,
          noteFileName: filename,
          studentCategory: studentCat,
          pageCount,
          notesCreatedAt: parsedDate,
          type,
        },
      }
    );

    if (updateNotes.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Notes not found or not updated." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params: { noteId } }) {
  try {
    await connectToDatabase();

    // Find and delete the video
    const result = await Notes.findByIdAndDelete(noteId);

    if (!result) {
      return NextResponse.json({ error: "Notes not found" }, { status: 404 });
    }

    // Delete Notes from S3
    const notesParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: result.noteFileName,
    };
    await s3.deleteObject(notesParams).promise();

    // Delete thumbnail from S3 if it exists
    if (result.thumbnailFileName) {
      const thumbnailParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: result.thumbnailFileName,
      };
      await s3.deleteObject(thumbnailParams).promise();
    }

    // Respond with success message
    return NextResponse.json(
      { message: "Notes and associated assets deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting notes or assets:", error);
    return NextResponse.json(
      { error: "Error deleting notes or assets", error: error.message },
      { status: 500 }
    );
  }
}
