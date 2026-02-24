import { NextResponse } from "next/server";



import Videos from "@/schemas/Videos";
import connectToDatabase from "@/_database/mongodb";
import { s3 } from "@/helpers/constant";

export async function PUT(request, { params: { videoId } }) {
  try {
    const {
      filename,
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
    } = await request.json();
    const studentCat = JSON.parse(studentCategory);

    if (
      !filename ||
      !date ||
      !title ||
      !videoUrl ||
      !description ||
      !studentCat.length ||
      !videoCategory
    ) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const parsedDate = new Date(date);
    const currentTime = new Date();
    parsedDate.setHours(currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds());

    await connectToDatabase();

    const updatedVideo = await Videos.updateOne(
      { _id: videoId },
      {
        $set: {
          title,
          description,
          thumbnail: thumbnailUrl,
          thumbnailFileName: thumbnailName,
          videoUrl: videoUrl,
          shorts,
          videoFileName: filename,
          studentCategory: studentCat,
          videoCategory,
          videoDuration: duration,
          videoCreatedAt: parsedDate
        },
      }
    );

    if (updatedVideo.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Video not found or not updated." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Updated successfully" },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: e.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params: { videoId } }) {
  try {
    await connectToDatabase();

    // Find and delete the video
    const result = await Videos.findByIdAndDelete(videoId);

    if (!result) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Delete video from S3
    const videoParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: result.videoFileName,
    };
    await s3.deleteObject(videoParams).promise();

    // Delete thumbnail from S3 if it exists
    if (result.thumbnailFileName) {
      const thumbnailParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: result.thumbnailFileName,
      };
      await s3.deleteObject(thumbnailParams).promise();
    }

    // Respond with success message
    return NextResponse.json(
      { message: "Video and associated assets deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting video or assets:", error);
    return NextResponse.json(
      { error: "Error deleting video or assets", error: error.message },
      { status: 500 }
    );
  }
}
