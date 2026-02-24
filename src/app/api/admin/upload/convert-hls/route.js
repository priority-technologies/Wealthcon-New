import { NextResponse } from 'next/server';
import { join } from 'path';
import { existsSync } from 'fs';
import { convertToHLSAdaptive } from '@/utils/hlsConverter';

export async function POST(request) {
  try {
    const { videoFileName, videPath } = await request.json();
    const loggedUserRole = request.headers.get('x-user-role');

    // Only admin can convert videos
    if (loggedUserRole !== 'admin' && loggedUserRole !== 'superAdmin') {
      return NextResponse.json(
        { error: 'Access denied. Admin only.' },
        { status: 403 }
      );
    }

    if (!videoFileName) {
      return NextResponse.json(
        { error: 'videoFileName is required' },
        { status: 400 }
      );
    }

    // Construct paths
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    const videoPath = join(uploadsDir, 'videos', videoFileName);
    const hlsOutputDir = join(uploadsDir, 'videos', videoFileName.replace(/\.[^/.]+$/, ''));

    // Verify video file exists
    if (!existsSync(videoPath)) {
      return NextResponse.json(
        { error: 'Video file not found' },
        { status: 404 }
      );
    }

    console.log(`Starting HLS conversion for: ${videoFileName}`);
    console.log(`Video path: ${videoPath}`);
    console.log(`Output dir: ${hlsOutputDir}`);

    // Start conversion (this runs asynchronously in the background)
    convertToHLSAdaptive(videoPath, hlsOutputDir)
      .then((result) => {
        console.log('✅ HLS conversion completed:', result);
      })
      .catch((error) => {
        console.error('❌ HLS conversion error:', error);
      });

    // Return immediately with conversion started message
    return NextResponse.json({
      success: true,
      message: 'HLS conversion started',
      videoFileName,
      hlsDirectory: hlsOutputDir.replace(process.cwd(), ''),
      estimatedTime: '5-15 minutes depending on video length',
      note: 'Conversion is happening in the background. Check back later for completion.',
    });
  } catch (error) {
    console.error('Error in HLS conversion endpoint:', error.message);
    return NextResponse.json(
      { error: error.message || 'HLS conversion failed' },
      { status: 500 }
    );
  }
}

// Endpoint to check conversion status
export async function GET(request) {
  try {
    const videoFileName = request.nextUrl.searchParams.get('videoFileName');
    const loggedUserRole = request.headers.get('x-user-role');

    if (loggedUserRole !== 'admin' && loggedUserRole !== 'superAdmin') {
      return NextResponse.json(
        { error: 'Access denied. Admin only.' },
        { status: 403 }
      );
    }

    if (!videoFileName) {
      return NextResponse.json(
        { error: 'videoFileName is required' },
        { status: 400 }
      );
    }

    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    const hlsDir = join(uploadsDir, 'videos', videoFileName.replace(/\.[^/.]+$/, ''));
    const manifestPath = join(hlsDir, `${videoFileName.replace(/\.[^/.]+$/, '')}.m3u8`);

    const isConverted = existsSync(manifestPath);

    return NextResponse.json({
      videoFileName,
      isConverted,
      hlsUrl: isConverted ? `/uploads/videos/${videoFileName.replace(/\.[^/.]+$/, '')}/${videoFileName.replace(/\.[^/.]+$/, '')}.m3u8` : null,
      status: isConverted ? 'completed' : 'processing',
    });
  } catch (error) {
    console.error('Error checking conversion status:', error.message);
    return NextResponse.json(
      { error: 'Failed to check conversion status' },
      { status: 500 }
    );
  }
}
