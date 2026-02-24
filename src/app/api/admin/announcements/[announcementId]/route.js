import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../_database/mongodb";
import Announcements from "@/schemas/Announcements";

export async function DELETE(request, { params: { announcementId } }) {
  try {
    await connectToDatabase();
    const deletedAnnouncement = await Announcements.findByIdAndDelete(
      announcementId
    );

    if (!deletedAnnouncement) {
      return NextResponse.json(
        { error: "Announcement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Announcement deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting Announcement:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


export async function PUT(request, { params }) {    
  try {     
      const id = params.announcementId;
      if (!id) {
          return NextResponse.json(
              { error: "Message ID is required" },
              { status: 400 }
          );
      }
      const { message, studentCategory } = await request.json();
      if (!message || !studentCategory) {
          return NextResponse.json(
              { error: "Missing required fields" },
              { status: 400 }
          );
      }
      await connectToDatabase();
      const updatedMessage = await Announcements.findByIdAndUpdate(
          id,
          {
              message,
              studentCategory: JSON.parse(studentCategory),
          },
          { new: true }
      );
      if (!updatedMessage) {
          return NextResponse.json(
              { error: "Message not found" },
              { status: 404 }
          );
      }
      return NextResponse.json({ message: "Message updated successfully", updatedMessage });
  } catch (error) {
      console.error("Error updating the message:", error.message);
      return NextResponse.json(
          { error: error.message || "Internal server error" },
          { status: 500 }
      );
  }
}