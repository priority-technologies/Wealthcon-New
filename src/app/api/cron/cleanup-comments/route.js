import { NextResponse } from "next/server";
import Comments from "../../../../schemas/Comments";
import connectToDatabase from "../../../../_database/mongodb";

export async function GET(request) {
  try {
    // Verify the request is from Vercel Cron or authorized source
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Calculate date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Find and delete rejected comments older than 30 days
    const result = await Comments.deleteMany({
      status: "rejected",
      rejectedAt: { $lt: thirtyDaysAgo },
    });

    console.log(`Cleanup cron executed: ${result.deletedCount} comments deleted`);

    return NextResponse.json({
      success: true,
      message: `Cleanup completed. ${result.deletedCount} rejected comments deleted`,
    });
  } catch (error) {
    console.error("Error in cleanup cron:", error.message);
    return NextResponse.json(
      { error: "Cleanup failed" },
      { status: 500 }
    );
  }
}

// Vercel Cron Configuration
export const maxDuration = 60; // 1 minute timeout
