import React from 'react';
import { Category, ContentItem } from '../types';
import ContentCard from './ContentCard';
import { ChevronRight } from 'lucide-react';

interface ContentRowProps {
  category: Category;
  onVideoSelect: (video: ContentItem) => void;
  onSeeAll: (category: Category) => void;
}

const ContentRow: React.FC<ContentRowProps> = ({ category, onVideoSelect, onSeeAll }) => {
  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-4 px-4 md:px-12">
        <h2 className="text-white text-xl md:text-2xl font-bold">{category.title}</h2>
        <button 
          onClick={() => onSeeAll(category)} 
          className="group flex items-center text-sm font-semibold text-cyan-400 hover:text-white transition-colors"
        >
          <span>See All</span>
          <ChevronRight size={20} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
      <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide pl-4 md:pl-12">
        {category.content.map(item => (
          <ContentCard key={item.id} item={item} onVideoSelect={onVideoSelect} />
        ))}
        {/* Add a spacer at the end for better padding on scroll */}
        <div className="flex-shrink-0 w-4 md:w-8"></div>
      </div>
    </div>
  );
};

export default ContentRow;