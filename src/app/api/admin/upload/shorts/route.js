export const maxDuration = 60;

import { NextResponse } from "next/server";
import Videos from "../../../../../schemas/Videos";
import connectToDatabase from "../../../../../_database/mongodb";

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const {
      fileName,
      videoUrl,
      thumbnailName,
      thumbnailUrl,
      date,
      title,
      description,
      studentCategory,
      duration,
      width,
      height,
      channelId,
    } = reqBody;

    // Validate required fields
    if (
      !fileName ||
      !date ||
      !title ||
      !videoUrl ||
      !description ||
      !studentCategory ||
      !duration
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate duration (max 60 seconds for shorts)
    if (duration > 60) {
      return NextResponse.json(
        {
          error: `Video duration must be maximum 60 seconds. Current duration: ${duration} seconds`,
        },
        { status: 400 }
      );
    }

    // Validate orientation (portrait: height > width)
    if (width && height && width > height) {
      return NextResponse.json(
        {
          error: `Shorts must be in portrait orientation. Current dimensions: ${width}x${height}. Required: height > width`,
        },
        { status: 400 }
      );
    }

    const parsedDate = new Date(date);
    const currentTime = new Date();
    parsedDate.setHours(
      currentTime.getHours(),
      currentTime.getMinutes(),
      currentTime.getSeconds()
    );

    await connectToDatabase();

    // Save shorts to MongoDB
    const newShort = new Videos({
      title,
      description,
      thumbnail: thumbnailUrl,
      thumbnailFileName: thumbnailName,
      videoUrl: videoUrl,
      shorts: true, // Mark as short
      orientation: height > width ? "portrait" : "landscape",
      videoFileName: fileName,
      studentCategory: JSON.parse(studentCategory),
      videoCategory: "shorts",
      videoDuration: duration,
      channelId: channelId || null,
      videoCreatedAt: parsedDate,
    });

    const { _id } = await newShort.save();

    return NextResponse.json({
      message: "Short uploaded successfully",
      insertId: _id,
      success: true,
    });
  } catch (error) {
    console.error("Error uploading short:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload short" },
      { status: 500 }
    );
  }
}
