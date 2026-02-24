
import React from 'react';
import { ContentItem } from '../types';
import { educators } from '../data/mockData';
import { Clock, Play } from 'lucide-react';

interface VideoListItemProps {
  item: ContentItem;
  onVideoSelect: (video: ContentItem) => void;
}

const VideoListItem: React.FC<VideoListItemProps> = ({ item, onVideoSelect }) => {
  const educator = educators.find(e => e.id === item.educatorId);

  return (
    <div 
      onClick={() => onVideoSelect(item)}
      className="group flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6 p-4 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
    >
      <div className="flex-shrink-0 w-full md:w-64 aspect-video relative rounded-lg overflow-hidden">
        <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play size={40} className="text-white" />
        </div>
        {item.watchPercentage > 0 && (
            <div className="absolute bottom-0 left-0 h-1 w-full bg-white/20">
                <div className="h-full bg-cyan-400" style={{ width: `${item.watchPercentage}%` }}></div>
            </div>
        )}
      </div>
      <div className="flex-1">
        <p className="text-xs text-cyan-400 font-semibold uppercase mb-1">{educator?.name || 'Wealthcon'}</p>
        <h3 className="text-xl font-bold text-white">{item.title}</h3>
        <p className="text-sm text-gray-400 mt-2 line-clamp-2">{item.description}</p>
        <div className="flex items-center space-x-4 text-gray-400 mt-3 text-sm">
            <div className="flex items-center">
                <Clock size={14} className="mr-1.5" />
                <span>{item.durationMinutes} min</span>
            </div>
            <div className="flex flex-wrap gap-x-2">
                {item.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="bg-gray-700/50 text-xs font-medium px-2 py-0.5 rounded">{tag}</span>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default VideoListItem;
