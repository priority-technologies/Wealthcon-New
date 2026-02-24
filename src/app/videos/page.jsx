'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, LayoutGrid, List } from 'lucide-react';
import VideoCard from '@/components/UserContent/VideoCard';
import TopTenRow from '@/components/UserContent/TopTenRow';
import VideoListItem from '@/components/UserContent/VideoListItem';

const VideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [channels, setChannels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);
  const [selectedChannel, setSelectedChannel] = useState('all');

  useEffect(() => {
    fetchVideos();
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const response = await fetch('/api/channels');
      const result = await response.json();
      setChannels(result.channels || []);
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  };

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/videos');
      const result = await response.json();
      setVideos(result.videos || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const topTenContent = useMemo(() => {
    return [...videos]
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 10);
  }, [videos]);

  const filteredAndSortedContent = useMemo(() => {
    let content = videos.slice();

    // Filter by channel
    if (selectedChannel !== 'all') {
      content = content.filter((item) => item.channelId === selectedChannel);
    }

    if (searchTerm) {
      content = content.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (sortOrder) {
      case 'latest':
        content.sort((a, b) => new Date(b.videoCreatedAt) - new Date(a.videoCreatedAt));
        break;
      case 'oldest':
        content.sort((a, b) => new Date(a.videoCreatedAt) - new Date(b.videoCreatedAt));
        break;
      case 'a-z':
        content.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'z-a':
        content.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    return content;
  }, [searchTerm, sortOrder, selectedChannel, videos]);

  const isSearchResults = searchTerm.length > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-wc-dark flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wc-cyan mx-auto"></div>
          <p className="mt-4">Loading videos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-wc-dark min-h-screen text-white">
      {!isSearchResults && viewMode === 'grid' && (
        <div className="relative h-[40vw] min-h-[300px] max-h-[600px] w-full">
          {videos.length > 0 && (
            <>
              <img
                src={videos[0].thumbnail}
                alt={videos[0].title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-wc-dark via-wc-dark/70 to-transparent"></div>
              <div className="absolute bottom-[15%] left-4 md:left-12 text-white z-10">
                <h1 className="text-3xl md:text-5xl font-black max-w-2xl">{videos[0].title}</h1>
                <p className="text-sm md:text-base mt-3 max-w-xl line-clamp-2">{videos[0].description}</p>
              </div>
            </>
          )}
        </div>
      )}

      <main className={`py-8 ${isSearchResults || viewMode === 'list' ? 'pt-24' : 'pt-8'}`}>
        <div className="container mx-auto px-4 md:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <div className="relative w-full md:w-auto md:flex-grow max-w-lg">
              <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border-2 border-transparent focus:border-wc-cyan rounded-lg pl-12 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="relative">
                <select
                  value={selectedChannel}
                  onChange={(e) => {
                    setSelectedChannel(e.target.value);
                    setVisibleCount(10);
                  }}
                  className="appearance-none bg-white/5 hover:bg-white/10 rounded-lg pl-4 pr-10 py-2.5 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="all">All Channels</option>
                  {channels.map((channel) => (
                    <option key={channel._id} value={channel._id}>
                      {channel.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="appearance-none bg-white/5 hover:bg-white/10 rounded-lg pl-4 pr-10 py-2.5 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="latest">Latest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="a-z">A-Z</option>
                  <option value="z-a">Z-A</option>
                </select>
                <ChevronDown className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
              <div className="flex items-center bg-white/5 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white/20' : 'text-gray-400'} hover:text-white transition-colors`}
                >
                  <LayoutGrid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white/20' : 'text-gray-400'} hover:text-white transition-colors`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {isSearchResults ? (
          <div className="container mx-auto px-4 md:px-12">
            <h2 className="text-2xl font-bold mb-4">Search Results</h2>
            {filteredAndSortedContent.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredAndSortedContent.slice(0, visibleCount).map((item) => (
                  <Link key={item._id} href={`/videos/${item._id}`}>
                    <VideoCard item={item} />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-12">No videos found for &quot;{searchTerm}&quot;. Try another search.</p>
            )}
            {visibleCount < filteredAndSortedContent.length && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setVisibleCount((c) => c + 8)}
                  className="bg-wc-cyan hover:bg-cyan-600 text-black font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105"
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        ) : viewMode === 'list' ? (
          <div className="container mx-auto px-4 md:px-12">
            <div className="space-y-4">
              {filteredAndSortedContent.slice(0, visibleCount).map((item) => (
                <Link key={item._id} href={`/videos/${item._id}`}>
                  <VideoListItem item={item} />
                </Link>
              ))}
            </div>
            {visibleCount < filteredAndSortedContent.length && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setVisibleCount((c) => c + 10)}
                  className="bg-wc-cyan hover:bg-cyan-600 text-black font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105"
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            <TopTenRow items={topTenContent} />
            <div className="container mx-auto px-4 md:px-12">
              <h2 className="text-2xl font-bold mb-6">All Videos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredAndSortedContent.slice(0, visibleCount).map((item) => (
                  <Link key={item._id} href={`/videos/${item._id}`}>
                    <VideoCard item={item} />
                  </Link>
                ))}
              </div>
            </div>
            {visibleCount < filteredAndSortedContent.length && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setVisibleCount((c) => c + 8)}
                  className="bg-wc-cyan hover:bg-cyan-600 text-black font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105"
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default VideosPage;
