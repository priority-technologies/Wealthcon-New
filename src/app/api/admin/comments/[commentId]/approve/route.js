import { NextResponse } from "next/server";
import Comments from "@/schemas/Comments";
import connectToDatabase from "@/_database/mongodb";

export async function PUT(request, { params: { commentId } }) {
  try {
    const loggedUserRole = request.headers.get("x-user-role");

    // Only admin can approve comments
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

    // Update comment status to approved
    comment.status = "approved";
    comment.isApproved = true;
    await comment.save();

    return NextResponse.json({
      success: true,
      message: "Comment approved",
      comment,
    });
  } catch (error) {
    console.error("Error approving comment:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
