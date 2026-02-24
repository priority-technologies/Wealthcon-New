import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import { ContentItem, Category, Page } from '../types';
import { Search, ChevronDown, LayoutGrid, List, ArrowLeft } from 'lucide-react';
import VideoCard from '../components/VideoCard';
import VideoListItem from '../components/VideoListItem';

type ViewMode = 'grid' | 'list';

interface CategoryPageProps {
    category: Category;
    onLogout: () => void;
    onVideoSelect: (video: ContentItem) => void;
    onNavigate: (page: Page) => void;
    onBack: () => void;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ category, onLogout, onVideoSelect, onNavigate, onBack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('latest');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [visibleCount, setVisibleCount] = useState(12);

    const filteredAndSortedContent = useMemo(() => {
        let content = [...category.content];

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
    }, [searchTerm, sortOrder, category.content]);

    return (
        <div className="bg-[#050a14] min-h-screen text-white">
            <Navbar onLogout={onLogout} onNavigate={onNavigate} currentPage="home" />
           
            <main className="py-8 pt-24">
                <div className="container mx-auto px-4 md:px-12">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <button onClick={onBack} className="flex-shrink-0 flex items-center text-gray-200 hover:text-white bg-white/10 p-2 rounded-full transition-colors">
                                <ArrowLeft size={24} />
                            </button>
                            <h1 className="text-3xl md:text-4xl font-black">{category.title}</h1>
                        </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                        <div className="relative w-full md:w-auto md:flex-grow max-w-lg">
                            <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text" placeholder="Search in this category..." value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/5 border-2 border-transparent focus:border-cyan-400 rounded-lg pl-12 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none transition-colors"
                            />
                        </div>
                        <div className="flex items-center space-x-2 md:space-x-4">
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

                <div className="container mx-auto px-4 md:px-12">
                    {filteredAndSortedContent.length > 0 ? (
                        viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {filteredAndSortedContent.slice(0, visibleCount).map(item => (
                                    <VideoCard key={item.id} item={item} onVideoSelect={onVideoSelect} />
                                ))}
                            </div>
                        ) : (
                             <div className="space-y-4">
                                {filteredAndSortedContent.slice(0, visibleCount).map(item => (
                                    <VideoListItem key={item.id} item={item} onVideoSelect={onVideoSelect} />
                                ))}
                            </div>
                        )
                    ) : (
                        <p className="text-gray-400 text-center py-12">No videos found matching your criteria in this category.</p>
                    )}
                    {visibleCount < filteredAndSortedContent.length && (
                         <div className="text-center mt-12">
                            <button onClick={() => setVisibleCount(c => c + 8)} className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105">
                                Load More
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CategoryPage;
