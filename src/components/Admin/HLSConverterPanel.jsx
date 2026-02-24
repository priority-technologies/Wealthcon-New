'use client';

import React, { useState } from 'react';
import { Upload, Loader, CheckCircle, AlertCircle } from 'lucide-react';

export default function HLSConverterPanel() {
  const [videoFileName, setVideoFileName] = useState('');
  const [converting, setConverting] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [converted, setConverted] = useState(false);

  const handleConvert = async (e) => {
    e.preventDefault();
    if (!videoFileName.trim()) {
      setError('Please enter a video filename');
      return;
    }

    setConverting(true);
    setError(null);
    setStatus('Starting conversion...');

    try {
      const response = await fetch('/api/admin/upload/convert-hls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoFileName }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Conversion failed');
      }

      const data = await response.json();
      setStatus(`✅ ${data.message}`);
      setConverted(true);
      setVideoFileName('');

      // Check status periodically
      checkConversionStatus(videoFileName);
    } catch (err) {
      setError(`❌ ${err.message}`);
    } finally {
      setConverting(false);
    }
  };

  const checkConversionStatus = async (fileName) => {
    try {
      const response = await fetch(
        `/api/admin/upload/convert-hls?videoFileName=${encodeURIComponent(fileName)}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.isConverted) {
          setStatus(`✅ Conversion completed! HLS URL: ${data.hlsUrl}`);
        }
      }
    } catch (err) {
      console.error('Error checking status:', err);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-6 text-white max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Upload size={24} className="text-cyan-400" />
        <h2 className="text-2xl font-bold">HLS Video Converter</h2>
      </div>

      <p className="text-gray-400 mb-6">
        Convert uploaded MP4 videos to HLS format for adaptive bitrate streaming with 2-second chunks.
      </p>

      <form onSubmit={handleConvert} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Video Filename
          </label>
          <input
            type="text"
            value={videoFileName}
            onChange={(e) => setVideoFileName(e.target.value)}
            placeholder="e.g., sessions/1234.mp4"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
            disabled={converting}
          />
          <p className="text-xs text-gray-400 mt-1">
            Enter the relative path from /uploads/videos/ directory
          </p>
        </div>

        <button
          type="submit"
          disabled={converting || !videoFileName.trim()}
          className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-black font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {converting ? (
            <>
              <Loader size={18} className="animate-spin" />
              Converting... (This may take 5-15 minutes)
            </>
          ) : (
            <>
              <Upload size={18} />
              Start HLS Conversion
            </>
          )}
        </button>
      </form>

      {/* Status Messages */}
      <div className="mt-6 space-y-3">
        {status && (
          <div className="flex items-start gap-3 bg-green-900/30 border border-green-600 rounded-lg p-4">
            <CheckCircle size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-400">Success</p>
              <p className="text-green-200 text-sm mt-1">{status}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 bg-red-900/30 border border-red-600 rounded-lg p-4">
            <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-400">Error</p>
              <p className="text-red-200 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Information Box */}
      <div className="mt-6 bg-blue-900/20 border border-blue-600 rounded-lg p-4">
        <p className="text-sm text-blue-200 mb-2">
          <strong>ℹ️ HLS Conversion Benefits:</strong>
        </p>
        <ul className="text-xs text-blue-200 space-y-1 ml-4 list-disc">
          <li>Adaptive bitrate streaming (auto-adjusts quality based on connection)</li>
          <li>2-second chunks for faster buffering and seeking</li>
          <li>Better bandwidth utilization</li>
          <li>Works on all modern browsers</li>
          <li>Improved user experience on slow connections</li>
        </ul>
      </div>

      {/* Usage Instructions */}
      <div className="mt-6 bg-slate-700/50 rounded-lg p-4">
        <p className="text-sm font-semibold mb-2">📝 How to use:</p>
        <ol className="text-xs text-gray-300 space-y-2 ml-4 list-decimal">
          <li>Upload a video through the normal upload process</li>
          <li>Note the filename (e.g., "sessions/1234.mp4")</li>
          <li>Enter the filename above and click "Start HLS Conversion"</li>
          <li>Wait for conversion to complete (5-15 minutes)</li>
          <li>Videos will automatically use HLS when available, MP4 as fallback</li>
        </ol>
      </div>
    </div>
  );
}
