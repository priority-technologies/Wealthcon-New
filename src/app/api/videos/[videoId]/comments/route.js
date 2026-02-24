import { NextResponse } from "next/server";
import Comments from "../../../../../schemas/Comments";
import Users from "../../../../../schemas/Users";
import connectToDatabase from "../../../../../_database/mongodb";
import mongoose from "mongoose";

export async function GET(request, { params: { videoId } }) {
  try {
    const userId = request.headers.get("x-user-id");

    await connectToDatabase();

    const comments = await Comments.find({
      videoId: new mongoose.Types.ObjectId(videoId),
    })
      .populate("userId", "username email")
      .sort({ postedAt: -1 })
      .lean();

    // Filter: show only approved comments + user's own pending/rejected comments
    const filteredComments = comments.filter((comment) => {
      if (comment.isApproved) return true;
      if (userId && comment.userId._id.toString() === userId) return true;
      return false;
    });

    return NextResponse.json({
      success: true,
      comments: filteredComments,
      total: filteredComments.length,
    });
  } catch (error) {
    console.error("Error fetching comments:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(request, { params: { videoId } }) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { commentText } = await request.json();

    if (!commentText || commentText.trim().length === 0) {
      return NextResponse.json(
        { error: "Comment text is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await Users.findById(userId).select("username");
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const newComment = new Comments({
      videoId: new mongoose.Types.ObjectId(videoId),
      userId: new mongoose.Types.ObjectId(userId),
      authorName: user.username,
      authorAvatar: user.profilePicture || "",
      commentText,
      status: "pending",
      isApproved: false,
    });

    await newComment.save();

    return NextResponse.json(
      {
        success: true,
        message: "Comment submitted for approval",
        comment: newComment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error posting comment:", error.message);
    return NextResponse.json(
      { error: "Failed to post comment" },
      { status: 500 }
    );
  }
}
