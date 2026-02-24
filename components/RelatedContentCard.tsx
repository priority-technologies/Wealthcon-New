
import React from 'react';
import { ContentItem } from '../types';
import { Play } from 'lucide-react';

interface RelatedContentCardProps {
  item: ContentItem;
  onSelect: (item: ContentItem) => void;
}

const RelatedContentCard: React.FC<RelatedContentCardProps> = ({ item, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(item)}
      className="group flex items-center space-x-4 bg-white/5 p-2 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
    >
      <div className="flex-shrink-0 w-32 h-20 relative rounded-md overflow-hidden">
        <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play size={24} className="text-white" />
        </div>
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-sm line-clamp-2">{item.title}</h4>
        <p className="text-xs text-gray-400 mt-1">{item.tags[0]}</p>
      </div>
    </div>
  );
};

export default RelatedContentCard;
