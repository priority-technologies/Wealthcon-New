import { NextResponse } from "next/server";
import YoutubeVideos from "../../../../schemas/Youtube";
import connectToDatabase from "../../../../_database/mongodb";

export async function POST(request) {
    try {
      await connectToDatabase(); 
  
      const { yturl, date, title, shorts, description, studentCategory, videoCategory } = await request.json();
  
      if (!yturl || !title || !description || !studentCategory.length || !videoCategory) {
        return NextResponse.json({ success: false, message: "Invalid data" }, { status: 400 });
      }
  
      const video = new YoutubeVideos({
        yturl,
        date,
        title,
        shorts,
        description,
        studentCategory,
        videoCategory,
      });
  
      await video.save();
  
      return NextResponse.json({
        success: true,
        message: "Video uploaded successfully!",
        data: video,
      });
    } catch (error) {
      console.error("Error saving video:", error);
      return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
