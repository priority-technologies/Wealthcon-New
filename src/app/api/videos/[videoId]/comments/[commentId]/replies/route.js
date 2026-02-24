import { NextResponse } from "next/server";
import Comments from "../../../../../../../schemas/Comments";
import Users from "../../../../../../../schemas/Users";
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

    const { replyText } = await request.json();

    if (!replyText || replyText.trim().length === 0) {
      return NextResponse.json(
        { error: "Reply text is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await Users.findById(userId).select("username profilePicture");
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const comment = await Comments.findById(commentId);
    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    const newReply = {
      userId: new mongoose.Types.ObjectId(userId),
      authorName: user.username,
      authorAvatar: user.profilePicture || "",
      replyText,
      likes: 0,
      likedBy: [],
      postedAt: new Date(),
    };

    comment.replies.push(newReply);
    await comment.save();

    return NextResponse.json(
      {
        success: true,
        message: "Reply added",
        reply: newReply,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding reply:", error.message);
    return NextResponse.json(
      { error: "Failed to add reply" },
      { status: 500 }
    );
  }
}
