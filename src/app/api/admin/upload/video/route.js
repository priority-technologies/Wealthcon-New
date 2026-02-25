export const maxDuration = 60;

import { NextResponse } from "next/server";
import Videos from "@/schemas/Videos";
import connectToDatabase from "@/_database/mongodb";
import { enqueueVideoConversion } from "@/lib/queue";

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const {
      fileName,
      videoUrl,
      thumbnailName,
      thumbnailUrl,
      date,
      shorts,
      title,
      description,
      studentCategory,
      videoCategory,
      duration,
      channelId,
    } = body;

    // Parse studentCategory if it's a string
    const parsedCategory = typeof studentCategory === "string"
      ? JSON.parse(studentCategory)
      : studentCategory;

    // Convert relative path to absolute URL for schema validation
    let absoluteVideoUrl = videoUrl;
    if (videoUrl && !videoUrl.startsWith("http")) {
      const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
      const host = request.headers.get("host") || "localhost:3001";
      absoluteVideoUrl = `${protocol}://${host}${videoUrl}`;
    }

    // Handle duration - schema expects Number (seconds) but UI may send string like "2:30"
    let videoDurationSeconds = 0;
    if (typeof duration === "string" && duration.includes(":")) {
      // Parse "2:30" format to seconds
      const parts = duration.split(":");
      videoDurationSeconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
    } else if (typeof duration === "number") {
      videoDurationSeconds = duration;
    }

    const video = new Videos({
      title,
      description,
      thumbnail: thumbnailUrl || "",
      thumbnailFileName: thumbnailName || "",
      videoUrl: absoluteVideoUrl,
      videoFileName: fileName,
      videoDuration: videoDurationSeconds || 0,
      shorts: shorts || false,
      orientation: shorts ? "portrait" : "landscape",
      studentCategory: parsedCategory || ["all"],
      videoCategory,
      channelId: channelId || null,
      isDownloadable: false,
      videoCreatedAt: date ? new Date(date) : new Date(),
      viewCount: 0,
    });

    await video.save();

    // Enqueue HLS conversion job
    try {
      const videoPath = `/uploads/videos/${fileName}`;
      await enqueueVideoConversion(video._id.toString(), fileName, videoPath);
      console.log(`✅ Queued HLS conversion for video ${video._id}`);
    } catch (queueError) {
      console.error('Error enqueueing conversion:', queueError.message);
      // Don't fail the upload if queueing fails, log it and continue
      // The video can be converted later manually
    }

    return NextResponse.json(
      {
        success: true,
        message: "Video created successfully",
        insertId: video._id,
        video,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating video record:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
