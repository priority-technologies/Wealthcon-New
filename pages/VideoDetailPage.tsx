
import React, { useState } from 'react';
import { ContentItem } from '../types';
import { ArrowLeft, Plus, Share2, Clock } from 'lucide-react';
import RelatedContentCard from '../components/RelatedContentCard';
import VideoPlayerPlaceholder from '../components/VideoPlayerPlaceholder';

interface VideoDetailPageProps {
  video: ContentItem;
  relatedContent: ContentItem[];
  onBack: () => void;
  onVideoSelect: (video: ContentItem) => void;
}

const VideoDetailPage: React.FC<VideoDetailPageProps> = ({ video, relatedContent, onBack, onVideoSelect }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="bg-[#050a14] min-h-screen text-white animate-fade-in">
       {/* A simplified nav/header can exist on this page too if needed, or it can be truly immersive */}
       <div className="absolute top-0 left-0 right-0 z-10 p-4">
        <button onClick={onBack} className="flex items-center text-gray-200 hover:text-white bg-black/30 backdrop-blur-sm p-2 rounded-full transition-colors">
          <ArrowLeft size={20} />
          <span className="ml-2 hidden md:inline">Back to Library</span>
        </button>
       </div>
      
      <div className="container mx-auto px-4 md:px-12 pt-20 pb-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="mb-6">
              <VideoPlayerPlaceholder thumbnailUrl={video.heroImageUrl} />
            </div>

            {/* Video Info */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black">{video.title}</h1>
                    <div className="flex items-center space-x-4 text-gray-400 mt-2">
                        <div className="flex items-center">
                            <Clock size={16} className="mr-1.5" />
                            <span>{video.durationMinutes} min</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                            {video.tags.map(tag => (
                                <span key={tag} className="bg-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex space-x-3 mt-4 md:mt-0 flex-shrink-0">
                    <button className="flex items-center bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                        <Plus size={20} className="mr-2" /> My List
                    </button>
                    <button className="flex items-center bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                        <Share2 size={18} className="mr-2" /> Share
                    </button>
                </div>
            </div>
            
            {/* Tabs */}
            <div className="mt-8">
              <div className="border-b border-gray-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`${
                      activeTab === 'overview'
                        ? 'border-cyan-400 text-cyan-400'
                        : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('resources')}
                    className={`${
                      activeTab === 'resources'
                        ? 'border-cyan-400 text-cyan-400'
                        : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg`}
                  >
                    Resources
                  </button>
                </nav>
              </div>
              <div className="py-6">
                {activeTab === 'overview' && (
                  <p className="text-gray-300 leading-relaxed">{video.longDescription}</p>
                )}
                {activeTab === 'resources' && (
                  <div>
                    <p className="text-gray-400">Downloadable resources will appear here.</p>
                    {/* Example of a resource link */}
                    <a href="#" className="text-cyan-400 hover:underline mt-4 block">Presentation Slides (.pdf)</a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Up Next Sidebar */}
          <div className="lg:col-span-1 mt-12 lg:mt-0">
            <h2 className="text-2xl font-bold mb-4">Up Next</h2>
            <div className="space-y-4">
              {relatedContent.slice(0, 5).map(item => (
                <RelatedContentCard key={item.id} item={item} onSelect={onVideoSelect}/>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default VideoDetailPage;
