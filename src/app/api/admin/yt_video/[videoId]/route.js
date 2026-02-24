import { NextResponse } from "next/server";
import mongoose from 'mongoose';
import connectToDatabase from "../../../../../_database/mongodb";
import YoutubeVideos from "../../../../../schemas/Youtube";

export async function GET(request, { params: { videoId } }) {
    try {
        await connectToDatabase();
        const video = await YoutubeVideos.findById(videoId);

        if (!video) {
            return NextResponse.json({ success: false, message: "Video not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: video });
    } catch (error) {
        console.error("Error fetching video:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(request, { params: { videoId } }) {
    try {
        if (!videoId) {
            return NextResponse.json({ success: false, message: "Video ID is required" }, { status: 400 });
        }
        await connectToDatabase();

        if (!mongoose.Types.ObjectId.isValid(videoId)) {
            return NextResponse.json({ success: false, message: "Invalid video ID" }, { status: 400 });
        }
        
        const video = await YoutubeVideos.findByIdAndDelete(videoId);

        if (!video) {
            return NextResponse.json({ success: false, message: "Video not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Video deleted successfully!",
        });
    } catch (error) {
        console.error("Error deleting video:", error.message || error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request, { params: { videoId } }) {
  try {
    await connectToDatabase();
    
    const { yturl, date, title, shorts, description, studentCategory, videoCategory } = await request.json();
    
    if (!yturl || !title || !description || !Array.isArray(studentCategory) || studentCategory.length === 0 || !videoCategory) {
      return NextResponse.json({ success: false, message: "Invalid or missing data" }, { status: 400 });
    }

    let video;
    if (videoId) {
      video = await YoutubeVideos.findByIdAndUpdate(
        videoId,
        {
          yturl,
          date,
          title,
          shorts,
          description,
          studentCategory,
          videoCategory,
        },
        { new: true, runValidators: true }
      );

      if (!video) {
        return NextResponse.json({ success: false, message: "Video not found" }, { status: 404 });
      }
    } else {
      video = new YoutubeVideos({
        yturl,
        date,
        title,
        shorts,
        description,
        studentCategory,
        videoCategory,
      });
      await video.save();
    }

    return NextResponse.json({
      success: true,
      message: videoId ? "Video updated successfully!" : "Video created successfully!",
      data: video,
    });
  } catch (error) {
    console.error("Error handling video request:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
