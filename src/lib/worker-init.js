/**
 * Initialize video conversion worker
 * This should be called once when the server starts
 */

let workerInitialized = false;
let conversionWorker = null;

export async function initializeConversionWorker() {
  if (workerInitialized) {
    console.log('[Worker] Conversion worker already initialized');
    return conversionWorker;
  }

  try {
    const { initializeConversionWorker: createWorker } = require('./queue');
    conversionWorker = createWorker();
    workerInitialized = true;
    console.log('[Worker] ✅ Conversion worker initialized successfully');
    return conversionWorker;
  } catch (error) {
    console.error('[Worker] ❌ Failed to initialize conversion worker:', error.message);
    // Don't throw, let the app continue - conversions can still be queued
    return null;
  }
}

export function isWorkerInitialized() {
  return workerInitialized;
}

export function getWorker() {
  return conversionWorker;
}
