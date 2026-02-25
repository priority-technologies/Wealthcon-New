'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Share2, Clock, Check } from 'lucide-react';
import Link from 'next/link';
import CommentsPanel from '@/components/UserContent/CommentsPanel';
import HLSVideoPlayer from '@/components/UserContent/HLSVideoPlayer';

export default function VideoDetailPage({ params: { videoId } }) {
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [watchHistory, setWatchHistory] = useState(null);
  const [videoRef, setVideoRef] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [savingToList, setSavingToList] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchVideo();
    fetchUserId();
  }, [videoId]);

  useEffect(() => {
    if (userId && videoId) {
      fetchWatchHistory();
    }
  }, [userId, videoId]);

  const fetchUserId = async () => {
    try {
      const response = await fetch('/api/auth/profile');
      if (response.ok) {
        const data = await response.json();
        const id = data.user?._id || data.user?.id || data._id || data.id;
        const role = data.user?.role || data.role;
        if (id) {
          setUserId(id);
        }
        if (role) {
          setUserRole(role);
        }
      } else {
        console.log('Auth response not ok:', response.status);
      }
    } catch (err) {
      console.log('Error fetching user:', err.message);
    }
  };

  const fetchWatchHistory = async () => {
    try {
      const response = await fetch(`/api/videos/${videoId}/progress`);
      if (response.ok) {
        const data = await response.json();
        setWatchHistory(data.watchHistory || null);
      }
    } catch (err) {
      console.log('No watch history found');
    }
  };

  const formatTime = (minutes) => {
    if (!minutes) return '0:00';
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes % 1) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResume = () => {
    if (videoRef && watchHistory?.watchedDuration) {
      const minutes = parseInt(watchHistory.watchedDuration);
      videoRef.currentTime = minutes * 60;
      videoRef.play();
    }
  };

  const fetchVideo = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/videos/${videoId}`);
      if (!response.ok) throw new Error('Video not found');

      const data = await response.json();
      const videoData = data.video || data;
      setVideo(videoData);
      setIsSaved(videoData.savedLater || false);

      // Fetch related videos
      const relatedResponse = await fetch(`/api/videos/${videoId}/related`);
      if (relatedResponse.ok) {
        const relatedData = await relatedResponse.json();
        setRelatedVideos((relatedData.videos || []).slice(0, 5));
      }
    } catch (err) {
      console.error('Error fetching video:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSavedStatus = async () => {
    if (!userId) {
      alert('Please log in to save videos');
      return;
    }

    setSavingToList(true);
    try {
      const action = isSaved ? 'remove' : 'add';
      const response = await fetch('/api/watch-later', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({
          videoId,
          action,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update saved status');
      }

      setIsSaved(!isSaved);
    } catch (err) {
      console.error('Error toggling saved status:', err);
      alert('Failed to update saved status. Please try again.');
    } finally {
      setSavingToList(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-wc-dark flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wc-cyan mx-auto"></div>
          <p className="mt-4">Loading video...</p>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-wc-dark flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl font-bold">Error loading video</p>
          <p className="text-gray-400 mt-2">{error || 'Video not found'}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 bg-wc-cyan text-black font-bold py-2 px-6 rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-wc-dark min-h-screen text-white animate-fade-in">
      <div className="absolute top-20 left-0 right-0 z-10 p-4">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-200 hover:text-white bg-black/30 backdrop-blur-sm p-2 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="ml-2 hidden md:inline">Back</span>
        </button>
      </div>

      <div className="container mx-auto px-4 md:px-12 pt-28 pb-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="mb-6">
              {watchHistory?.watchedDuration && (
                <div className="mb-3 flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-3">
                  <span className="text-sm text-gray-300">
                    Resume from {formatTime(watchHistory.watchedDuration)}?
                  </span>
                  <button
                    onClick={handleResume}
                    className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg text-sm transition-colors"
                  >
                    Resume
                  </button>
                  <button
                    onClick={() => setWatchHistory(null)}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-gray-300 rounded-lg text-sm transition-colors"
                  >
                    Start Over
                  </button>
                </div>
              )}
              <HLSVideoPlayer
                videoUrl={video.videoUrl}
                resumeTime={watchHistory?.watchedDuration ? parseInt(watchHistory.watchedDuration) * 60 : undefined}
                onTimeUpdate={(currentTime) => {
                  console.log('Video progress:', currentTime);
                }}
                onPlayPause={(isPlaying) => {
                  console.log('Playing:', isPlaying);
                }}
                className="mb-6"
              />
            </div>

            {/* Video Info */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-3xl md:text-5xl font-black">{video.title}</h1>
                <div className="flex items-center space-x-4 text-gray-400 mt-2">
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1.5" />
                    <span>{video.videoDuration || 'N/A'} min</span>
                  </div>
                  {video.viewCount && (
                    <div className="flex items-center">
                      <span>{video.viewCount.toLocaleString()} views</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex space-x-3 mt-4 md:mt-0 flex-shrink-0">
                <button
                  onClick={toggleSavedStatus}
                  disabled={savingToList}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    isSaved
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {isSaved ? (
                    <>
                      <Check size={20} className="mr-2" /> Saved
                    </>
                  ) : (
                    <>
                      <Plus size={20} className="mr-2" /> My List
                    </>
                  )}
                </button>
                <button className="flex items-center bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                  <Share2 size={18} className="mr-2" /> Share
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-8">
              <CommentsPanel videoId={videoId} userId={userId} userRole={userRole} />
            </div>

            {/* Tabs */}
            <div className="mt-8">
              <div className="border-b border-gray-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`${
                      activeTab === 'overview'
                        ? 'border-wc-cyan text-wc-cyan'
                        : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('resources')}
                    className={`${
                      activeTab === 'resources'
                        ? 'border-wc-cyan text-wc-cyan'
                        : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg`}
                  >
                    Resources
                  </button>
                </nav>
              </div>
              <div className="py-6">
                {activeTab === 'overview' && (
                  <div>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{video.description}</p>
                  </div>
                )}
                {activeTab === 'resources' && (
                  <div>
                    <p className="text-gray-400">Downloadable resources will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Up Next Sidebar */}
          <div className="lg:col-span-1 mt-12 lg:mt-0">
            <h2 className="text-2xl font-bold mb-4">Up Next</h2>
            <div className="space-y-4">
              {relatedVideos.map((relatedVideo) => (
                <Link key={relatedVideo._id} href={`/videos/${relatedVideo._id}`}>
                  <div className="group cursor-pointer">
                    <img
                      src={relatedVideo.thumbnail || '/placeholder.png'}
                      alt={relatedVideo.title}
                      className="w-full h-24 object-cover rounded mb-2 group-hover:opacity-80 transition-opacity"
                    />
                    <h3 className="text-sm font-bold group-hover:text-wc-cyan transition-colors line-clamp-2">
                      {relatedVideo.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
