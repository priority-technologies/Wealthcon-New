import { NextResponse } from "next/server";
import Comments from "@/schemas/Comments";
import connectToDatabase from "@/_database/mongodb";

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { status } = body; // "approved" or "rejected"

    if (!["approved", "rejected", "pending"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const comment = await Comments.findByIdAndUpdate(
      params.commentId,
      { $set: { status } },
      { new: true }
    ).lean();

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json({ comment, message: `Comment ${status} successfully` });
  } catch (error) {
    console.error("Error updating comment:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const comment = await Comments.findByIdAndDelete(params.commentId);

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
