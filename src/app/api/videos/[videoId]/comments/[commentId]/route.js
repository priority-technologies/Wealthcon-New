import { NextResponse } from "next/server";
import Comments from "../../../../../../schemas/Comments";
import Users from "../../../../../../schemas/Users";
import connectToDatabase from "../../../../../../_database/mongodb";
import mongoose from "mongoose";

export async function DELETE(request, { params: { videoId, commentId } }) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const comment = await Comments.findById(commentId);
    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    // Only allow user to delete their own comment
    if (comment.userId.toString() !== userId) {
      return NextResponse.json(
        { error: "Can only delete your own comments" },
        { status: 403 }
      );
    }

    await Comments.findByIdAndDelete(commentId);

    return NextResponse.json({
      success: true,
      message: "Comment deleted",
    });
  } catch (error) {
    console.error("Error deleting comment:", error.message);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}
