
import React from 'react';
import { ContentItem } from '../types';
import { Play, Info } from 'lucide-react';

interface HeroProps {
  item: ContentItem;
  onVideoSelect: (video: ContentItem) => void;
}

const Hero: React.FC<HeroProps> = ({ item, onVideoSelect }) => {
  return (
    <div className="relative h-[56.25vw] min-h-[400px] max-h-[800px] w-full">
      <img src={item.heroImageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050a14] via-[#050a14]/60 to-transparent"></div>
      <div className="absolute bottom-[20%] left-4 md:left-12 text-white z-10">
        <h1 className="text-3xl md:text-6xl font-black max-w-xl">{item.title}</h1>
        <p className="text-sm md:text-lg mt-4 max-w-xl line-clamp-3">{item.longDescription}</p>
        <div className="flex space-x-4 mt-6">
          <button 
            onClick={() => onVideoSelect(item)}
            className="flex items-center justify-center bg-white text-black font-bold px-6 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            <Play className="mr-2" size={24} />
            Play
          </button>
          <button 
            onClick={() => onVideoSelect(item)}
            className="flex items-center justify-center bg-white/30 text-white font-bold px-6 py-2 rounded-md hover:bg-white/40 transition-colors backdrop-blur-sm"
          >
            <Info className="mr-2" size={24} />
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;