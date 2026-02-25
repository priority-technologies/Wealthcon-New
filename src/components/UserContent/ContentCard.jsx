'use client';

import React from 'react';
import { PlayCircle } from 'lucide-react';

const ContentCard = ({ item, rank = null }) => {
  if (!item) return null;

  return (
    <div className="group relative flex-shrink-0 w-64 rounded-lg overflow-hidden shadow-lg cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105 hover:z-10">
      {/* Ranking Badge */}
      {rank && (
        <div className="absolute top-3 left-3 z-20 bg-cyan-500 text-black font-black text-xl rounded-full w-10 h-10 flex items-center justify-center">
          {rank}
        </div>
      )}

      <img
        src={item.thumbnail || '/placeholder.png'}
        alt={item.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="absolute bottom-0 left-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-white font-bold text-md">{item.title}</h3>
        {item.tags && (
          <p className="text-white/80 text-xs mt-1">{item.tags.slice(0, 2).join(' • ')}</p>
        )}
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <PlayCircle className="text-white/80" size={48} />
      </div>
    </div>
  );
};

export default ContentCard;
