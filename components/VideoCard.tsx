
import React from 'react';
import { ContentItem, Educator } from '../types';
import { Play } from 'lucide-react';
import { educators } from '../data/mockData';

interface VideoCardProps {
  item: ContentItem;
  onVideoSelect: (video: ContentItem) => void;
  isRow?: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({ item, onVideoSelect, isRow = false }) => {
    const educator = educators.find(e => e.id === item.educatorId);

    const cardWidth = isRow ? 'w-80' : 'w-full';

    return (
        <div 
            onClick={() => onVideoSelect(item)}
            className={`group relative flex-shrink-0 ${cardWidth} rounded-lg overflow-hidden shadow-lg cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105 hover:z-10`}
        >
            <div className="relative aspect-video">
                <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-100 group-hover:opacity-50 transition-opacity"></div>
                
                {/* Play button on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black/50 rounded-full p-3 backdrop-blur-sm">
                        <Play size={32} className="text-white" style={{ marginLeft: '3px' }}/>
                    </div>
                </div>
                
                {/* Watch Progress Bar */}
                {item.watchPercentage > 0 && (
                     <div className="absolute bottom-0 left-0 h-1 w-full bg-white/20">
                        <div className="h-full bg-cyan-400" style={{ width: `${item.watchPercentage}%` }}></div>
                    </div>
                )}
            </div>
            
            <div className="p-4 bg-[#101622]">
                <p className="text-sm text-cyan-400 font-semibold uppercase">{educator?.name || 'Wealthcon'}</p>
                <h3 className="text-white font-bold text-lg mt-1 truncate">{item.title}</h3>
            </div>
        </div>
    );
};

export default VideoCard;
