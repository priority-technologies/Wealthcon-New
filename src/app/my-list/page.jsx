'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import VideoCard from '@/components/UserContent/VideoCard';

const MyListPage = () => {
  const [savedVideos, setSavedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWatchLater();
  }, []);

  const fetchWatchLater = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/watch-later');
      const data = await response.json();
      setSavedVideos(data.videos || []);
    } catch (error) {
      console.error('Error fetching watch later:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-wc-dark flex items-center justify-center">
        <p className="text-white">Loading your list...</p>
      </div>
    );
  }

  return (
    <div className="bg-wc-dark min-h-screen text-white pt-8 pb-12">
      <div className="container mx-auto px-4 md:px-12">
        <h1 className="text-4xl font-black mb-8">My List</h1>
        {savedVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {savedVideos.map((video) => (
              <Link key={video._id} href={`/videos/${video._id}`}>
                <VideoCard item={video} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Your list is empty. Save videos to see them here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListPage;
