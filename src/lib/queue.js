import { Queue, Worker } from 'bullmq';
import mongoose from 'mongoose';
import connectToDatabase from '@/_database/mongodb';
import Videos from '@/schemas/Videos';
import { convertToHLSAdaptive, cleanupHLS } from '@/utils/hlsConverter';
import path from 'path';

// Use in-memory storage instead of Redis
// For production, replace with Redis connection
const queueConfig = {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  },
};

// Create conversion queue
export const conversionQueue = new Queue('video-conversion', {
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: {
      age: 3600, // Keep completed jobs for 1 hour
    },
  },
});

/**
 * Add a video to the conversion queue
 */
export async function enqueueVideoConversion(videoId, videoFileName, videoPath) {
  try {
    const job = await conversionQueue.add(
      'convert-video',
      {
        videoId,
        videoFileName,
        videoPath,
      },
      {
        jobId: `convert-${videoId}`,
        priority: 1,
      }
    );
    return job;
  } catch (error) {
    console.error('Error enqueueing video conversion:', error);
    throw error;
  }
}

/**
 * Get job status
 */
export async function getConversionStatus(videoId) {
  try {
    const job = await conversionQueue.getJob(`convert-${videoId}`);
    if (!job) {
      return null;
    }

    const progress = job.progress();
    const state = await job.getState();

    return {
      jobId: job.id,
      state,
      progress,
      attempts: job.attemptsMade,
      failedReason: job.failedReason,
    };
  } catch (error) {
    console.error('Error getting conversion status:', error);
    return null;
  }
}

/**
 * Initialize the worker to process video conversion jobs
 */
export function initializeConversionWorker() {
  const worker = new Worker(
    'video-conversion',
    async (job) => {
      try {
        const { videoId, videoFileName, videoPath } = job.data;

        console.log(`[Worker] Starting HLS conversion for video ${videoId}`);

        // Connect to database
        await connectToDatabase();

        // Update status to converting
        await Videos.findByIdAndUpdate(videoId, {
          conversionStatus: 'converting',
          conversionProgress: 5,
        });

        job.updateProgress(5);

        // Prepare output directory
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
        const outputDir = path.join(uploadsDir, videoFileName.replace(/\.[^/.]+$/, ''));
        const fullVideoPath = path.join(uploadsDir, videoFileName);

        // Simulate progress updates (actual conversion happens in hlsConverter)
        job.updateProgress(20);

        // Convert to HLS
        const result = await convertToHLSAdaptive(fullVideoPath, outputDir);

        job.updateProgress(90);

        // Update database with success
        const hlsUrl = `/uploads/videos/${videoFileName.replace(/\.[^/.]+$/, '')}/${videoFileName.replace(/\.[^/.]+$/, '')}.m3u8`;

        await Videos.findByIdAndUpdate(videoId, {
          conversionStatus: 'completed',
          conversionProgress: 100,
          hlsUrl,
          conversionError: null,
        });

        job.updateProgress(100);

        console.log(`[Worker] ✅ HLS conversion completed for video ${videoId}`);
        console.log(`[Worker] HLS URL: ${hlsUrl}`);

        return {
          success: true,
          videoId,
          hlsUrl,
        };
      } catch (error) {
        console.error(`[Worker] ❌ Conversion failed for video ${job.data.videoId}:`, error.message);

        const { videoId } = job.data;
        const attempts = job.attemptsMade || 0;

        // If this is the second attempt (final), mark as failed
        if (attempts >= 2) {
          await Videos.findByIdAndUpdate(videoId, {
            conversionStatus: 'failed',
            conversionProgress: 0,
            conversionError: error.message,
            conversionAttempts: attempts,
          });

          console.log(`[Worker] Video ${videoId} failed after ${attempts} attempts. Using MP4 fallback.`);
        } else {
          // Retry (job.js will handle automatic retry)
          await Videos.findByIdAndUpdate(videoId, {
            conversionAttempts: attempts + 1,
            conversionError: `Attempt ${attempts + 1} failed: ${error.message}`,
          });
        }

        throw error; // Re-throw to trigger retry
      }
    },
    {
      connection: queueConfig.connection,
      concurrency: 2, // Process max 2 videos simultaneously
    }
  );

  // Event listeners
  worker.on('completed', (job) => {
    console.log(`[Worker] Job completed: ${job.id}`);
  });

  worker.on('failed', (job, error) => {
    console.error(`[Worker] Job failed: ${job.id} - ${error.message}`);
  });

  worker.on('error', (error) => {
    console.error('[Worker] Worker error:', error);
  });

  return worker;
}

export default conversionQueue;
