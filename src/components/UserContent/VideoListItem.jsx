'use client';

import React from 'react';

const VideoListItem = ({ item }) => {
  if (!item) return null;

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors group">
      {/* Thumbnail with progress bar */}
      <div className="relative w-32 h-24 flex-shrink-0 rounded overflow-hidden">
        <img
          src={item.thumbnail || '/placeholder.png'}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
        {item.watchPercentage > 0 && (
          <div className="absolute bottom-0 left-0 h-1 w-full bg-white/20">
            <div
              className="h-full bg-cyan-400 transition-all duration-500"
              style={{ width: `${item.watchPercentage}%` }}
            />
          </div>
        )}
      </div>

      <div className="flex-grow">
        <h3 className="text-white font-bold text-base hover:text-wc-cyan transition-colors">{item.title}</h3>
        <p className="text-gray-400 text-sm mt-1 line-clamp-2">{item.description}</p>
        <p className="text-gray-500 text-xs mt-2">
          {item.videoCreatedAt ? new Date(item.videoCreatedAt).toLocaleDateString() : 'N/A'}
        </p>
      </div>
      {item.watchPercentage > 0 && (
        <div className="text-xs text-wc-cyan font-semibold flex-shrink-0">
          {Math.round(item.watchPercentage)}%
        </div>
      )}
    </div>
  );
};

export default VideoListItem;
