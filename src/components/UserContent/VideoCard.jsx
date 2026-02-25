'use client';

import React from 'react';
import { Play } from 'lucide-react';

const VideoCard = ({ item, isRow = false, rank = null }) => {
  if (!item) return null;

  const cardWidth = isRow ? 'w-80' : 'w-full';

  return (
    <div className={`group relative flex-shrink-0 ${cardWidth} rounded-lg overflow-hidden shadow-lg cursor-pointer transition-transform hover:scale-105 hover:z-10`}>
      {/* Ranking Badge */}
      {rank && (
        <div className="absolute top-3 left-3 z-20 bg-cyan-500 text-black font-black text-2xl rounded-full w-12 h-12 flex items-center justify-center">
          {rank}
        </div>
      )}

      <div className="relative aspect-video">
        <img
          src={item.thumbnail || '/placeholder.png'}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-100 group-hover:opacity-50 transition-opacity duration-300"></div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-black/50 rounded-full p-3 backdrop-blur-sm">
            <Play className="text-white" size={32} style={{ marginLeft: '3px' }} />
          </div>
        </div>

        {item.watchPercentage > 0 && (
          <div className="absolute bottom-0 left-0 h-1 w-full bg-white/20">
            <div
              className="h-full bg-cyan-400 transition-all duration-500"
              style={{ width: `${item.watchPercentage}%` }}
            />
          </div>
        )}
      </div>

      <div className="p-4 bg-wc-card">
        <p className="text-sm text-wc-cyan font-semibold uppercase">{item.educatorName || 'Content'}</p>
        <h3 className="text-white font-bold text-lg mt-1 truncate">{item.title}</h3>
      </div>
    </div>
  );
};

export default VideoCard;
