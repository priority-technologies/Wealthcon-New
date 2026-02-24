import { NextResponse } from "next/server";
import Videos from "@/schemas/Videos";
import connectToDatabase from "@/_database/mongodb";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const video = await Videos.findById(params.videoId).lean();
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }
    return NextResponse.json({ video });
  } catch (error) {
    console.error("Error fetching video:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const video = await Videos.findByIdAndUpdate(
      params.videoId,
      { $set: body },
      { new: true }
    ).lean();

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json({ video, message: "Video updated successfully" });
  } catch (error) {
    console.error("Error updating video:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const video = await Videos.findByIdAndDelete(params.videoId);

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
