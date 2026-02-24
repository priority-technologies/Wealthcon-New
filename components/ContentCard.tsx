
import React from 'react';
import { ContentItem } from '../types';
import { PlayCircle } from 'lucide-react';

interface ContentCardProps {
  item: ContentItem;
  onVideoSelect: (video: ContentItem) => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ item, onVideoSelect }) => {
  return (
    <div 
      onClick={() => onVideoSelect(item)}
      className="group relative flex-shrink-0 w-64 rounded-lg overflow-hidden shadow-lg cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105 hover:z-10">
      <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute bottom-0 left-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-white font-bold text-md">{item.title}</h3>
        <p className="text-white/80 text-xs mt-1">{item.tags.join(' • ')}</p>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
         <PlayCircle size={48} className="text-white/80" />
      </div>
    </div>
  );
};

export default ContentCard;