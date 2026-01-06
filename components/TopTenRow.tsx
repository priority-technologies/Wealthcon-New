
import React from 'react';
import { ContentItem } from '../types';
import TopTenCard from './TopTenCard';
import ContentSlider from './ContentSlider';

interface TopTenRowProps {
  items: ContentItem[];
  onVideoSelect: (video: ContentItem) => void;
}

const TopTenRow: React.FC<TopTenRowProps> = ({ items, onVideoSelect }) => {
  return (
    <div>
        <div className="container mx-auto px-4 md:px-12">
            <h2 className="text-2xl font-bold mb-4">Top 10 Most Viewed</h2>
        </div>
        <ContentSlider className="space-x-12">
            {items.map((item, index) => (
                <TopTenCard key={item.id} item={item} rank={index + 1} onVideoSelect={onVideoSelect} />
            ))}
        </ContentSlider>
    </div>
  );
};

export default TopTenRow;
