'use client';

import React from 'react';
import HLSConverterPanel from '@/components/Admin/HLSConverterPanel';

export default function HLSConverterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
            HLS Video Converter
          </h1>
          <p className="text-gray-400 text-lg">
            Convert your uploaded videos to HLS format for professional adaptive bitrate streaming
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Converter Panel */}
          <div className="lg:col-span-2">
            <HLSConverterPanel />
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* What is HLS? */}
            <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-3">What is HLS?</h3>
              <p className="text-sm text-purple-100">
                HTTP Live Streaming (HLS) is a modern video streaming protocol that delivers video in small chunks with automatic quality adjustment based on user's bandwidth.
              </p>
            </div>

            {/* Requirements */}
            <div className="bg-gradient-to-br from-orange-900 to-orange-800 rounded-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-3">⚙️ Requirements</h3>
              <ul className="text-sm text-orange-100 space-y-2">
                <li>✓ Shaka Packager installed</li>
                <li>✓ ffmpeg (for video analysis)</li>
                <li>✓ Enough disk space</li>
                <li>✓ Admin access</li>
              </ul>
            </div>

            {/* Features */}
            <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-3">🎯 Features</h3>
              <ul className="text-sm text-green-100 space-y-2">
                <li>✓ Adaptive bitrate</li>
                <li>✓ 2-sec chunks</li>
                <li>✓ Auto fallback</li>
                <li>✓ Bandwidth detection</li>
              </ul>
            </div>

            {/* Status */}
            <div className="bg-gradient-to-br from-cyan-900 to-cyan-800 rounded-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-3">📊 Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Shaka Player:</span>
                  <span className="text-green-400 font-bold">✓ Installed</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shaka Packager:</span>
                  <span className="text-green-400 font-bold">✓ Installed</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>HLS Support:</span>
                  <span className="text-green-400 font-bold">✓ Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="mt-12 bg-slate-800/50 rounded-lg p-8 border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6">🚀 Quick Start</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 rounded-lg p-6">
              <div className="text-3xl font-bold text-cyan-400 mb-3">1</div>
              <h4 className="font-bold text-white mb-2">Upload Video</h4>
              <p className="text-gray-400 text-sm">
                Go to Admin Videos and upload your MP4 video file through the standard upload process.
              </p>
            </div>

            <div className="bg-slate-900 rounded-lg p-6">
              <div className="text-3xl font-bold text-cyan-400 mb-3">2</div>
              <h4 className="font-bold text-white mb-2">Convert to HLS</h4>
              <p className="text-gray-400 text-sm">
                Copy the filename (e.g., "sessions/1234.mp4") and paste it here, then click Convert.
              </p>
            </div>

            <div className="bg-slate-900 rounded-lg p-6">
              <div className="text-3xl font-bold text-cyan-400 mb-3">3</div>
              <h4 className="font-bold text-white mb-2">Automatic Usage</h4>
              <p className="text-gray-400 text-sm">
                Once converted, videos automatically use HLS when available. No action needed!
              </p>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-12 bg-slate-800/50 rounded-lg p-8 border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6">⚙️ Technical Details</h2>

          <div className="space-y-4 text-gray-300 text-sm">
            <div>
              <h4 className="font-bold text-white mb-2">Chunk Duration</h4>
              <p>Videos are split into 2-second chunks for fast seeking and buffering.</p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-2">Bitrate Selection</h4>
              <p>
                Shaka Player automatically selects the best quality based on:
                <ul className="ml-4 mt-2 space-y-1 list-disc">
                  <li>Available bandwidth</li>
                  <li>Network conditions</li>
                  <li>Device capabilities</li>
                </ul>
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-2">Directory Structure</h4>
              <p className="font-mono bg-black/30 p-2 rounded">
                /public/uploads/videos/sessionid/sessionid.m3u8<br/>
                /public/uploads/videos/sessionid/segment_*.ts
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-2">Fallback</h4>
              <p>
                If HLS fails or isn't available, videos automatically fall back to MP4 format
                without any manual intervention.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
