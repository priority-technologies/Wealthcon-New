
import React from 'react';
import { Play, Volume2, Maximize, Pause } from 'lucide-react';

interface VideoPlayerPlaceholderProps {
  thumbnailUrl: string;
}

const VideoPlayerPlaceholder: React.FC<VideoPlayerPlaceholderProps> = ({ thumbnailUrl }) => {
  return (
    <div 
      className="relative aspect-video w-full bg-black rounded-lg overflow-hidden shadow-2xl group cursor-pointer"
      style={{ backgroundImage: `url(${thumbnailUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/50"></div>
      
      {/* Big Play Button in the center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-black/50 rounded-full p-5 backdrop-blur-sm border border-white/20 transition-transform group-hover:scale-110">
          <Play size={60} className="text-white drop-shadow-lg" style={{ marginLeft: '4px' }} />
        </div>
      </div>

      {/* Mock Controls Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center text-white">
          {/* Play/Pause Button */}
          <Pause size={24} />
          
          {/* Timeline */}
          <div className="flex-grow mx-4 h-1 bg-white/30 rounded-full">
            <div className="w-1/4 h-full bg-cyan-400 rounded-full"></div>
          </div>

          {/* Volume */}
          <Volume2 size={24} className="mr-4" />
          
          {/* Time */}
          <span className="text-sm font-mono mr-4">01:23 / 05:42</span>

          {/* Fullscreen */}
          <Maximize size={22} />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerPlaceholder;
