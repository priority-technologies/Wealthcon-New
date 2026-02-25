import { NextResponse } from 'next/server';
import connectToDatabase from '@/_database/mongodb';
import Videos from '@/schemas/Videos';
import mongoose from 'mongoose';
import { getConversionStatus } from '@/lib/queue';

export async function GET(request, { params: { videoId } }) {
  const loggedUserRole = request.headers.get('x-user-role');

  // Only admin can check conversion status
  if (loggedUserRole !== 'admin' && loggedUserRole !== 'superAdmin') {
    return NextResponse.json(
      { error: 'Access denied. Admin only.' },
      { status: 403 }
    );
  }

  if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    return NextResponse.json(
      { error: 'Invalid video ID' },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();

    // Get video from database
    const video = await Videos.findById(videoId).select(
      'conversionStatus conversionProgress hlsUrl conversionError conversionAttempts'
    );

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Get job status from queue
    const jobStatus = await getConversionStatus(videoId);

    return NextResponse.json({
      videoId,
      status: video.conversionStatus,
      progress: video.conversionProgress,
      hlsUrl: video.hlsUrl,
      error: video.conversionError,
      attempts: video.conversionAttempts,
      jobStatus,
    });
  } catch (error) {
    console.error('Error checking conversion status:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
