
import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import { ContentItem, Educator, Page } from '../types';
import { contentData, educators } from '../data/mockData';
import { Search, ChevronDown, LayoutGrid, List } from 'lucide-react';
import VideoCard from '../components/VideoCard';
import TopTenRow from '../components/TopTenRow';
import VideoListItem from '../components/VideoListItem';
import ContentSlider from '../components/ContentSlider';

type ViewMode = 'grid' | 'list';

interface VideosPageProps {
    onLogout: () => void;
    onVideoSelect: (video: ContentItem) => void;
    onNavigate: (page: Page) => void;
}

const featuredVideo = contentData.find(c => c.id === 'content-8') || contentData[0];

const VideosPage: React.FC<VideosPageProps> = ({ onLogout, onVideoSelect, onNavigate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('latest');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [listChannelFilter, setListChannelFilter] = useState('all');
    const [visibleCount, setVisibleCount] = useState(10);
    
    const topTenContent = useMemo(() => {
        return [...contentData].sort((a,b) => b.viewCount - a.viewCount).slice(0, 10);
    }, []);

    const channels = useMemo(() => {
        const educatorMap = new Map<string, Educator>();
        educators.forEach(e => educatorMap.set(e.id, e));

        const videoMap = new Map<string, ContentItem[]>();
        contentData.forEach(video => {
            if (!videoMap.has(video.educatorId)) {
                videoMap.set(video.educatorId, []);
            }
            videoMap.get(video.educatorId)!.push(video);
        });

        return Array.from(videoMap.entries()).map(([educatorId, videos]) => ({
            educator: educatorMap.get(educatorId)!,
            videos: videos,
        }));
    }, []);

    const filteredAndSortedContent = useMemo(() => {
        let content = contentData.slice();

        if (viewMode === 'list' && listChannelFilter !== 'all') {
            content = content.filter(item => item.educatorId === listChannelFilter);
        }

        if (searchTerm) {
            content = content.filter(item =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        switch (sortOrder) {
            case 'latest':
                content.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
                break;
            case 'oldest':
                content.sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
                break;
            case 'a-z':
                content.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'z-a':
                content.sort((a, b) => b.title.localeCompare(a.title));
                break;
        }

        return content;
    }, [searchTerm, sortOrder, viewMode, listChannelFilter]);
    
    const isSearchResults = searchTerm.length > 0;

    return (
        <div className="bg-[#050a14] min-h-screen text-white">
            <Navbar onLogout={onLogout} onNavigate={onNavigate} currentPage="videos" />
            
            {!isSearchResults && viewMode === 'grid' && (
                 <div className="relative h-[40vw] min-h-[300px] max-h-[600px] w-full">
                    <img src={featuredVideo.heroImageUrl} alt={featuredVideo.title} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050a14] via-[#050a14]/70 to-transparent"></div>
                    <div className="absolute bottom-[15%] left-4 md:left-12 text-white z-10">
                        <h1 className="text-3xl md:text-5xl font-black max-w-2xl">{featuredVideo.title}</h1>
                        <p className="text-sm md:text-base mt-3 max-w-xl line-clamp-2">{featuredVideo.description}</p>
                    </div>
                </div>
            )}
           
            <main className={`py-8 ${isSearchResults || viewMode === 'list' ? 'pt-24' : ''}`}>
                <div className="container mx-auto px-4 md:px-12">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                        <div className="relative w-full md:w-auto md:flex-grow max-w-lg">
                            <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text" placeholder="Search by title or tag..." value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/5 border-2 border-transparent focus:border-cyan-400 rounded-lg pl-12 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none transition-colors"
                            />
                        </div>
                        <div className="flex items-center space-x-2 md:space-x-4">
                            {viewMode === 'list' && (
                                <div className="relative">
                                    <select value={listChannelFilter} onChange={(e) => setListChannelFilter(e.target.value)} className="appearance-none bg-white/5 hover:bg-white/10 rounded-lg pl-4 pr-10 py-2.5 font-semibold focus:outline-none cursor-pointer">
                                        <option value="all">All Channels</option>
                                        {educators.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                    </select>
                                    <ChevronDown className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                </div>
                            )}
                             <div className="relative">
                                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="appearance-none bg-white/5 hover:bg-white/10 rounded-lg pl-4 pr-10 py-2.5 font-semibold focus:outline-none cursor-pointer">
                                    <option value="latest">Latest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="a-z">A-Z</option>
                                    <option value="z-a">Z-A</option>
                                </select>
                                <ChevronDown className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                            </div>
                            <div className="flex items-center bg-white/5 rounded-lg p-1">
                               <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white/20' : 'text-gray-400'} hover:text-white transition-colors`}><LayoutGrid size={20} /></button>
                               <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white/20' : 'text-gray-400'} hover:text-white transition-colors`}><List size={20} /></button>
                            </div>
                        </div>
                    </div>
                </div>

                {isSearchResults ? (
                    <div className="container mx-auto px-4 md:px-12">
                        <h2 className="text-2xl font-bold mb-4">Search Results</h2>
                        {filteredAndSortedContent.length > 0 ? (
                             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {filteredAndSortedContent.slice(0, visibleCount).map(item => (
                                    <VideoCard key={item.id} item={item} onVideoSelect={onVideoSelect} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-center py-12">No videos found for "{searchTerm}". Try another search.</p>
                        )}
                        {visibleCount < filteredAndSortedContent.length && (
                             <div className="text-center mt-12">
                                <button onClick={() => setVisibleCount(c => c + 8)} className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105">
                                    Load More
                                </button>
                            </div>
                        )}
                    </div>
                ) : viewMode === 'list' ? (
                     <div className="container mx-auto px-4 md:px-12">
                        <div className="space-y-4">
                            {filteredAndSortedContent.slice(0, visibleCount).map(item => (
                                <VideoListItem key={item.id} item={item} onVideoSelect={onVideoSelect} />
                            ))}
                        </div>
                         {visibleCount < filteredAndSortedContent.length && (
                             <div className="text-center mt-12">
                                <button onClick={() => setVisibleCount(c => c + 10)} className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105">
                                    Load More
                                </button>
                            </div>
                        )}
                     </div>
                ) : (
                     <div className="space-y-12">
                        <TopTenRow items={topTenContent} onVideoSelect={onVideoSelect} />
                        {channels.map(({ educator, videos }) => (
                             <div key={educator.id}>
                                <div className="container mx-auto px-4 md:px-12">
                                      <h2 className="text-2xl font-bold mb-4">{educator.name}'s Channel</h2>
                                </div>
                                <ContentSlider>
                                    {videos.map(item => (
                                        <VideoCard key={item.id} item={item} onVideoSelect={onVideoSelect} isRow={true} />
                                    ))}
                                </ContentSlider>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default VideosPage;
