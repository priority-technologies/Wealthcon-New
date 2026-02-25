import { NextResponse } from "next/server";
import Comments from "@/schemas/Comments";
import connectToDatabase from "@/_database/mongodb";

export async function PUT(request, { params: { commentId } }) {
  try {
    const loggedUserRole = request.headers.get("x-user-role");

    // Only admin can reject comments
    if (loggedUserRole !== "admin" && loggedUserRole !== "superAdmin") {
      return NextResponse.json(
        { error: "Access denied. Admin only." },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const comment = await Comments.findById(commentId);
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Update comment status to rejected
    comment.status = "rejected";
    comment.rejectedAt = new Date();
    await comment.save();

    return NextResponse.json({
      success: true,
      message: "Comment rejected",
      comment,
    });
  } catch (error) {
    console.error("Error rejecting comment:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
