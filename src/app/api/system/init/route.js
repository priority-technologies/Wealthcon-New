import { NextResponse } from 'next/server';
import { initializeConversionWorker, isWorkerInitialized } from '@/lib/worker-init';

/**
 * Initialize system services
 * This endpoint should be called once when the application starts
 */
export async function GET(request) {
  try {
    // Initialize conversion worker
    await initializeConversionWorker();

    return NextResponse.json({
      success: true,
      status: 'System initialized',
      workerInitialized: isWorkerInitialized(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error initializing system:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
