'use client';

import React from 'react';

const TopTenCard = ({ item, rank }) => {
  if (!item) return null;

  return (
    <div className="group relative flex items-center flex-shrink-0 cursor-pointer h-56 w-56">
      {/* Overlapping rank number */}
      <span
        className="font-black text-[14rem] absolute z-0 -left-2 transition-transform duration-500 group-hover:scale-105"
        style={{
          WebkitTextStroke: '3px #718096',
          color: 'transparent',
          lineHeight: '1',
        }}
      >
        {rank}
      </span>

      {/* Card with image */}
      <div className="absolute z-10 left-20 w-40 h-full rounded-lg overflow-hidden shadow-lg border-2 border-transparent group-hover:border-white transition-all duration-500 group-hover:scale-110 group-hover:translate-x-2">
        <img
          src={item.thumbnail || '/placeholder.png'}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <h3 className="absolute bottom-2 left-2 text-white font-bold text-base line-clamp-2">{item.title}</h3>
      </div>
    </div>
  );
};

export default TopTenCard;
