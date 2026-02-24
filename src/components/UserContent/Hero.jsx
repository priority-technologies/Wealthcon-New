'use client';

import React from 'react';
import Link from 'next/link';
import { Play, Info } from 'lucide-react';

const Hero = ({ item }) => {
  if (!item) {
    return (
      <div className="relative h-[56.25vw] min-h-[400px] max-h-[800px] w-full bg-gradient-to-b from-wc-dark/20 to-wc-dark"></div>
    );
  }

  return (
    <div className="relative h-[56.25vw] min-h-[400px] max-h-[800px] w-full">
      <img
        src={item.thumbnail || '/placeholder.png'}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-wc-dark via-wc-dark/60 to-transparent"></div>
      <div className="absolute bottom-[20%] left-4 md:left-12 text-white z-10">
        <h1 className="text-3xl md:text-6xl font-black max-w-xl">{item.title}</h1>
        <p className="text-sm md:text-lg mt-4 max-w-xl line-clamp-3">{item.description}</p>
        <div className="flex space-x-4 mt-6">
          <Link
            href={`/videos/${item._id}`}
            className="flex items-center justify-center bg-white text-black font-bold px-6 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            <Play className="mr-2" size={24} />
            Play
          </Link>
          <Link
            href={`/videos/${item._id}`}
            className="flex items-center justify-center bg-white/30 text-white font-bold px-6 py-2 rounded-md hover:bg-white/40 transition-colors backdrop-blur-sm"
          >
            <Info className="mr-2" size={24} />
            More Info
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
