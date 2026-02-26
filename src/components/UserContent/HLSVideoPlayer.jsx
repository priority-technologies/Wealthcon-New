'use client';

import React, { useEffect, useRef, useState } from 'react';
import shaka from 'shaka-player';

export default function HLSVideoPlayer({
  videoUrl,
  onTimeUpdate,
  onPlayPause,
  resumeTime,
  className = '',
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [player, setPlayer] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [streamUrl, setStreamUrl] = useState(videoUrl);
  const [streamType, setStreamType] = useState('mp4');

  // Check for HLS stream availability
  useEffect(() => {
    const checkHLS = async () => {
      try {
        if (!videoUrl) return;

        // Extract video filename from URL
        const urlParts = videoUrl.split('/');
        const videoFileName = urlParts[urlParts.length - 1];
        const videoNameWithoutExt = videoFileName.replace(/\.[^/.]+$/, '');

        // Check if HLS version is available
        const hlsUrl = `/uploads/videos/${videoNameWithoutExt}/${videoNameWithoutExt}.m3u8`;

        const response = await fetch(hlsUrl, { method: 'HEAD' });
        if (response.ok) {
          console.log('HLS stream found, using adaptive bitrate');
          setStreamUrl(hlsUrl);
          setStreamType('hls');
        } else {
          console.log('HLS stream not available, using MP4');
          setStreamUrl(videoUrl);
          setStreamType('mp4');
        }
      } catch (err) {
        console.log('HLS check failed, falling back to MP4:', err.message);
        setStreamUrl(videoUrl);
        setStreamType('mp4');
      }
    };

    checkHLS();
  }, [videoUrl]);

  useEffect(() => {
    // Initialize Shaka Player
    const initPlayer = async () => {
      try {
        setIsLoading(true);
        if (!videoRef.current) return;

        // Check if browser supports Shaka Player
        if (!shaka.Player.isBrowserSupported()) {
          console.warn('Browser does not support Shaka Player, using native video player');
          setIsLoading(false);
          return;
        }

        // Shaka Player is not supported in this browser.
        if (!window.MediaSource) {
          console.log('MediaSource is not supported, falling back to native player');
          setIsLoading(false);
          return;
        }

        // Create player instance
        const newPlayer = new shaka.Player(videoRef.current);
        setPlayer(newPlayer);

        // Listen for errors
        newPlayer.addEventListener('error', (event) => {
          console.error('Shaka Player error:', event.detail);
          setError('Video playback error. Please try again.');
        });

        // Configure adaptive bitrate streaming
        const config = {
          streaming: {
            bufferingGoal: 8, // 8 second buffer goal
            rebufferingGoal: 4, // 4 second rebuffering goal
            bufferBehind: 30, // Keep 30 seconds behind
          },
        };

        newPlayer.configure(config);

        // Load the media (use HLS if available, fallback to MP4)
        try {
          console.log(`Loading ${streamType.toUpperCase()} stream: ${streamUrl}`);
          await newPlayer.load(streamUrl);
          console.log(`✅ ${streamType.toUpperCase()} video loaded successfully`);
          setError(null);

          // Resume from saved position if available
          if (resumeTime && videoRef.current) {
            videoRef.current.currentTime = resumeTime;
          }
        } catch (loadError) {
          if (loadError.code === shaka.util.Error.Code.LOAD_INTERRUPTED) {
            console.log('Load interrupted');
          } else {
            console.error('Error loading media:', loadError);
            setError('Failed to load video');
          }
        }
      } catch (err) {
        console.error('Error initializing player:', err);
        setError('Failed to initialize player');
      } finally {
        setIsLoading(false);
      }
    };

    initPlayer();

    // Cleanup
    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, [streamUrl, resumeTime, player]);

  // Handle time update for watch progress
  const handleTimeUpdate = () => {
    if (videoRef.current && onTimeUpdate) {
      onTimeUpdate(videoRef.current.currentTime);
    }
  };

  // Handle play/pause for analytics
  const handlePlayPause = () => {
    if (onPlayPause) {
      onPlayPause(!videoRef.current?.paused);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-black rounded-lg overflow-hidden ${className}`}
    >
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <p className="text-gray-400 text-sm">
              {streamType === 'hls'
                ? 'HLS stream error, trying fallback...'
                : 'Check your connection and try again'}
            </p>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-wc-cyan mb-4"></div>
            <p className="text-gray-300">Loading video...</p>
          </div>
        </div>
      )}

      <div className="relative pt-[56.25%]">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full"
          controls
          controlsList="nodownload"
          onTimeUpdate={handleTimeUpdate}
          onPlay={handlePlayPause}
          onPause={handlePlayPause}
        >
          {/* Fallback for browsers that don't support Shaka Player */}
          {streamUrl && (
            <>
              <source
                src={streamUrl}
                type={streamType === 'hls' ? 'application/x-mpegURL' : 'video/mp4'}
              />
            </>
          )}
          Your browser does not support the video tag.
        </video>
        {/* Stream type indicator */}
        <div className="absolute bottom-16 right-4 bg-black/70 px-3 py-1 rounded text-xs text-gray-300 z-5">
          {streamType === 'hls' ? '🎬 HLS (Adaptive)' : '📹 MP4'}
        </div>
      </div>
    </div>
  );
}
