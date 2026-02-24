import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import { Page, ContentItem, NoteItem, ChartItem } from '../types';
import { User, Activity, ShieldCheck, ArrowLeft, Search, ChevronDown, LayoutGrid, List } from 'lucide-react';
import { contentData, notesData, chartsData } from '../data/mockData';
import VideoCard from '../components/VideoCard';
import VideoListItem from '../components/VideoListItem';
import NoteCard from '../components/NoteCard';
import NoteListItem from '../components/NoteListItem';
import ChartCard from '../components/ChartCard';
import ChartListItem from '../components/ChartListItem';

type ViewMode = 'grid' | 'list';
type ActivityItem = ContentItem | NoteItem | ChartItem;

interface ActivityListViewProps {
    title: string;
    items: ActivityItem[];
    onBack: () => void;
    renderCard: (item: ActivityItem) => React.ReactNode;
    renderListItem: (item: ActivityItem) => React.ReactNode;
}

const ActivityListView: React.FC<ActivityListViewProps> = ({ title, items, onBack, renderCard, renderListItem }) => {
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('latest');
    
    const getSortDate = (item: ActivityItem): Date => {
        if ('releaseDate' in item) return new Date(item.releaseDate);
        if ('publishDate' in item) return new Date(item.publishDate);
        return new Date(0); // fallback
    };

    const filteredAndSortedItems = useMemo(() => {
        let results = [...items];

        if (searchTerm) {
            results = results.filter(item =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        switch (sortOrder) {
            case 'latest':
                results.sort((a, b) => getSortDate(b).getTime() - getSortDate(a).getTime());
                break;
            case 'oldest':
                results.sort((a, b) => getSortDate(a).getTime() - getSortDate(b).getTime());
                break;
            case 'a-z':
                results.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'z-a':
                results.sort((a, b) => b.title.localeCompare(a.title));
                break;
        }

        return results;
    }, [searchTerm, sortOrder, items]);
    
    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="flex-shrink-0 flex items-center text-gray-200 hover:text-white bg-white/10 p-2 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-3xl md:text-4xl font-black">{title}</h1>
                </div>
            </div>
            
             <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <div className="relative w-full md:w-auto md:flex-grow max-w-lg">
                    <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text" placeholder={`Search in ${title}...`} value={searchTerm}
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
                       <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white/20' : 'text-gray-400'} hover:text-white transition-colors`} aria-label="Grid View"><LayoutGrid size={20} /></button>
                       <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white/20' : 'text-gray-400'} hover:text-white transition-colors`} aria-label="List View"><List size={20} /></button>
                    </div>
                </div>
            </div>

             <div>
                {filteredAndSortedItems.length > 0 ? (
                    viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredAndSortedItems.map(item => (
                                <div key={item.id}>{renderCard(item)}</div>
                            ))}
                        </div>
                    ) : (
                         <div className="space-y-4">
                            {filteredAndSortedItems.map(item => (
                                <div key={item.id}>{renderListItem(item)}</div>
                            ))}
                        </div>
                    )
                ) : (
                    <p className="text-gray-400 text-center py-12">No items found.</p>
                )}
            </div>
        </div>
    );
};


interface ProfilePageProps {
    onLogout: () => void;
    onNavigate: (page: Page) => void;
    onVideoSelect: (video: ContentItem) => void;
    onNoteSelect: (note: NoteItem) => void;
    onChartSelect: (chart: ChartItem) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onLogout, onNavigate, onVideoSelect, onNoteSelect, onChartSelect }) => {
    const [activeView, setActiveView] = useState<'stats' | 'videos' | 'notes' | 'charts'>('stats');

    const completedVideos = useMemo(() => contentData.filter(v => v.watchPercentage === 100), []);
    const savedNotes = useMemo(() => notesData.filter(n => n.isSaved), []);
    const savedCharts = useMemo(() => chartsData.filter(c => c.isSaved), []);

    const renderContent = () => {
        switch (activeView) {
            case 'videos':
                return <ActivityListView
                    title="Completed Courses"
                    items={completedVideos}
                    onBack={() => setActiveView('stats')}
                    renderCard={(item) => <VideoCard item={item as ContentItem} onVideoSelect={onVideoSelect} />}
                    renderListItem={(item) => <VideoListItem item={item as ContentItem} onVideoSelect={onVideoSelect} />}
                />
            case 'notes':
                return <ActivityListView
                    title="Saved Notes"
                    items={savedNotes}
                    onBack={() => setActiveView('stats')}
                    renderCard={(item) => <NoteCard note={item as NoteItem} onNoteSelect={onNoteSelect} />}
                    renderListItem={(item) => <NoteListItem note={item as NoteItem} onNoteSelect={onNoteSelect} />}
                />
            case 'charts':
                 return <ActivityListView
                    title="Saved Charts"
                    items={savedCharts}
                    onBack={() => setActiveView('stats')}
                    renderCard={(item) => <ChartCard chart={item as ChartItem} onChartSelect={onChartSelect} />}
                    renderListItem={(item) => <ChartListItem chart={item as ChartItem} onChartSelect={onChartSelect} />}
                />
            case 'stats':
            default:
                return (
                    <div className="space-y-8">
                         <div>
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><Activity /> My Activity</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div onClick={() => setActiveView('videos')} className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                                    <p className="text-gray-400 text-sm">Courses Completed</p>
                                    <p className="text-3xl font-bold">{completedVideos.length}</p>
                                </div>
                                <div onClick={() => setActiveView('notes')} className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                                    <p className="text-gray-400 text-sm">Notes Saved</p>
                                    <p className="text-3xl font-bold">{savedNotes.length}</p>
                                </div>
                                <div onClick={() => setActiveView('charts')} className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                                    <p className="text-gray-400 text-sm">Charts Viewed</p>
                                    <p className="text-3xl font-bold">{savedCharts.length}</p>
                                </div>
                            </div>
                        </div>
                        
                         <div>
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><ShieldCheck /> Account Details</h2>
                            <div className="bg-white/5 p-6 rounded-lg">
                                <p className="text-gray-300">This is a placeholder for account details management.</p>
                            </div>
                        </div>
                    </div>
                )
        }
    }

    return (
        <div className="bg-[#050a14] min-h-screen text-white">
            <Navbar onLogout={onLogout} onNavigate={onNavigate} currentPage="profile" />
           
            <main className="py-8 pt-24">
                <div className="container mx-auto px-4 md:px-12">
                   <div className="max-w-4xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                            <div className="relative">
                                <img src="https://i.pravatar.cc/150?u=current-user" alt="User Avatar" className="w-32 h-32 rounded-full border-4 border-cyan-500" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-center md:text-left">Dr. Ankit</h1>
                                <p className="text-lg text-gray-400 text-center md:text-left">doctor@wealthcon.com</p>
                            </div>
                        </div>

                        {renderContent()}

                   </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;