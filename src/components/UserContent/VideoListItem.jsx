'use client';

import React from 'react';

const VideoListItem = ({ item }) => {
  if (!item) return null;

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors group">
      <img
        src={item.thumbnail || '/placeholder.png'}
        alt={item.title}
        className="w-32 h-24 object-cover rounded flex-shrink-0 group-hover:scale-105 transition-transform"
      />
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
