
import React from 'react';
import { ChartItem } from '../types';
import { educators } from '../data/mockData';
import { Calendar, Image } from 'lucide-react';

interface ChartListItemProps {
  chart: ChartItem;
  onChartSelect: (chart: ChartItem) => void;
}

const ChartListItem: React.FC<ChartListItemProps> = ({ chart, onChartSelect }) => {
  const author = educators.find(e => e.id === chart.authorId);
  const formattedDate = new Date(chart.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div 
      onClick={() => onChartSelect(chart)}
      className="group flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6 p-4 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
    >
      <div className="flex-shrink-0 w-full md:w-56 aspect-video relative rounded-lg overflow-hidden">
        <img src={chart.imageUrl} alt={chart.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Image size={40} className="text-white" />
        </div>
      </div>
      <div className="flex-1">
        <p className="text-xs text-cyan-400 font-semibold uppercase mb-1">{author?.name || 'Admin'}</p>
        <h3 className="text-xl font-bold text-white">{chart.title}</h3>
        <p className="text-sm text-gray-400 mt-2 line-clamp-2">{chart.description}</p>
        <div className="flex items-center space-x-4 text-gray-400 mt-3 text-sm">
            <div className="flex items-center">
                <Calendar size={14} className="mr-1.5" />
                <span>{formattedDate}</span>
            </div>
             <span className="bg-gray-700/50 text-xs font-medium px-2 py-0.5 rounded">{chart.category}</span>
        </div>
      </div>
    </div>
  );
};

export default ChartListItem;
