import connectToDatabase from "@/_database/mongodb";
import YoutubeVideos from "@/schemas/Youtube";
import { NextResponse } from "next/server";

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
