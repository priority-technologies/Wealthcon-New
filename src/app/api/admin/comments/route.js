import { NextResponse } from "next/server";
import Comments from "@/schemas/Comments";
import connectToDatabase from "@/_database/mongodb";

export async function GET(request) {
  try {
    const loggedUserRole = request.headers.get("x-user-role");

    // Only admin can access
    if (loggedUserRole !== "admin" && loggedUserRole !== "superAdmin") {
      return NextResponse.json(
        { error: "Access denied. Admin only." },
        { status: 403 }
      );
    }

    await connectToDatabase();

    // Fetch all comments with pending status, sorted by most recent
    const comments = await Comments.find({ status: "pending" })
      .populate("videoId", "title")
      .populate("userId", "username email")
      .sort({ postedAt: -1 })
      .lean();

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const loggedUserRole = request.headers.get("x-user-role");

    // Only admin can approve/reject
    if (loggedUserRole !== "admin" && loggedUserRole !== "superAdmin") {
      return NextResponse.json(
        { error: "Access denied. Admin only." },
        { status: 403 }
      );
    }

    const { commentId, status } = await request.json();

    if (!commentId || !status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid commentId or status" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updateData = {
      status,
      isApproved: status === "approved",
    };

    if (status === "rejected") {
      updateData.rejectedAt = new Date();
    }

    const updatedComment = await Comments.findByIdAndUpdate(
      commentId,
      updateData,
      { new: true }
    );

    if (!updatedComment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Comment ${status} successfully`,
      comment: updatedComment,
    });
  } catch (error) {
    console.error("Error updating comment:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
