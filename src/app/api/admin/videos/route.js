import { NextResponse } from "next/server";
import Videos from "@/schemas/Videos";
import connectToDatabase from "@/_database/mongodb";

export async function GET(request) {
  try {
    const loggedUserRole = request.headers.get("x-user-role");

    if (loggedUserRole !== "admin" && loggedUserRole !== "superAdmin") {
      return NextResponse.json(
        { error: "Access denied. Admin only." },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const videos = await Videos.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ videos });
  } catch (error) {
    console.error("Error fetching videos:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const loggedUserRole = request.headers.get("x-user-role");

    if (loggedUserRole !== "admin" && loggedUserRole !== "superAdmin") {
      return NextResponse.json(
        { error: "Access denied. Admin only." },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const body = await request.json();

    if (!body.title || !body.videoCategory) {
      return NextResponse.json(
        { error: "Title and videoCategory are required" },
        { status: 400 }
      );
    }

    const video = new Videos({
      title: body.title,
      description: body.description || "",
      videoFileName: body.videoFileName || "placeholder.mp4",
      thumbnailFileName: body.thumbnailFileName || "placeholder.jpg",
      thumbnail: body.thumbnail || "",
      videoDuration: body.videoDuration || "0:00",
      videoUrl: body.videoUrl || "",
      shorts: body.shorts || false,
      orientation: body.orientation || "landscape",
      videoCategory: body.videoCategory,
      studentCategory: body.studentCategory || ["all"],
      channelId: body.channelId || null,
      isDownloadable: body.isDownloadable || false,
      viewCount: 0,
    });

    await video.save();
    return NextResponse.json({ video, message: "Video created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating video:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
