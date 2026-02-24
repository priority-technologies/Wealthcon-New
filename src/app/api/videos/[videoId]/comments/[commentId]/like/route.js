import { NextResponse } from "next/server";
import Comments from "../../../../../../../schemas/Comments";
import connectToDatabase from "../../../../../../../_database/mongodb";
import mongoose from "mongoose";

export async function POST(request, { params: { videoId, commentId } }) {
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

    const userObjId = new mongoose.Types.ObjectId(userId);
    const hasLiked = comment.likedBy.some((id) => id.equals(userObjId));

    if (hasLiked) {
      comment.likedBy = comment.likedBy.filter((id) => !id.equals(userObjId));
      comment.likes = Math.max(0, comment.likes - 1);
    } else {
      comment.likedBy.push(userObjId);
      comment.likes += 1;
    }

    await comment.save();

    return NextResponse.json({
      success: true,
      message: hasLiked ? "Unlike successful" : "Like successful",
      likes: comment.likes,
    });
  } catch (error) {
    console.error("Error liking comment:", error.message);
    return NextResponse.json(
      { error: "Failed to like comment" },
      { status: 500 }
    );
  }
}
