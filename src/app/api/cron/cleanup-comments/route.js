/**
 * COMMENT CLEANUP CRON JOB
 *
 * Schedule: Daily at 2:00 AM IST
 * Frequency: Once per day
 * Timezone: IST (Indian Standard Time, UTC+5:30)
 *
 * Cron Configuration in vercel.json:
 * {
 *   "crons": [
 *     {
 *       "path": "/api/cron/cleanup-comments",
 *       "schedule": "0 20 * * *"
 *     }
 *   ]
 * }
 *
 * Cron Expression: "0 20 * * *"
 * - Minute: 0
 * - Hour: 20 (8 PM UTC = 1:30 AM IST)
 * - Day of Month: * (any day)
 * - Month: * (any month)
 * - Day of Week: * (any day)
 *
 * This ensures rejected comments older than 30 days are deleted daily at 2:00 AM IST
 */

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
