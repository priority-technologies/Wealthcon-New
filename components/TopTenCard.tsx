import React from 'react';
import { ContentItem } from '../types';

interface TopTenCardProps {
  item: ContentItem;
  rank: number;
  onVideoSelect: (video: ContentItem) => void;
}

const TopTenCard: React.FC<TopTenCardProps> = ({ item, rank, onVideoSelect }) => {
  return (
    <div 
      onClick={() => onVideoSelect(item)} 
      className="group relative flex items-center flex-shrink-0 cursor-pointer h-56 w-56"
    >
      <span 
        className="font-black text-[14rem] absolute z-0 -left-2 top-1/2 -translate-y-1/2 transition-transform duration-500 ease-out group-hover:scale-105"
        // FIX: Removed the 'textStroke' property as it is not a standard CSS property and causes a TypeScript error. The vendor-prefixed 'WebkitTextStroke' is sufficient.
        style={{
          WebkitTextStroke: '3px #718096',
          color: 'transparent',
          lineHeight: '1',
        }}
      >
        {rank}
      </span>
      <div className="absolute z-10 left-20 w-40 h-full rounded-lg overflow-hidden shadow-lg transition-transform duration-500 ease-out group-hover:scale-110 group-hover:translate-x-2 border-2 border-transparent group-hover:border-white">
        <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <h3 className="absolute bottom-2 left-2 text-white font-bold text-base line-clamp-2 drop-shadow-md">{item.title}</h3>
      </div>
    </div>
  );
};

export default TopTenCard;
