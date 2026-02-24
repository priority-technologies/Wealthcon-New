
import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import { ChartItem, Page } from '../types';
import { chartsData } from '../data/mockData';
import { LayoutGrid, List, Search, ChevronDown } from 'lucide-react';
import ChartCard from '../components/ChartCard';
import ChartListItem from '../components/ChartListItem';

type ViewMode = 'grid' | 'list';

interface ChartsPageProps {
    onLogout: () => void;
    onChartSelect: (chart: ChartItem) => void;
    onNavigate: (page: Page) => void;
}

const ChartsPage: React.FC<ChartsPageProps> = ({ onLogout, onChartSelect, onNavigate }) => {
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('latest');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const categories = useMemo(() => ['all', ...Array.from(new Set(chartsData.map(n => n.category)))], []);

    const filteredAndSortedCharts = useMemo(() => {
        let charts = [...chartsData];

        if (categoryFilter !== 'all') {
            charts = charts.filter(chart => chart.category === categoryFilter);
        }

        if (searchTerm) {
            charts = charts.filter(chart =>
                chart.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        switch (sortOrder) {
            case 'latest':
                charts.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
                break;
            case 'oldest':
                charts.sort((a, b) => new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime());
                break;
            case 'a-z':
                charts.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'z-a':
                charts.sort((a, b) => b.title.localeCompare(a.title));
                break;
        }

        return charts;
    }, [searchTerm, sortOrder, categoryFilter]);

    return (
        <div className="bg-[#050a14] min-h-screen text-white">
            <Navbar onLogout={onLogout} onNavigate={onNavigate} currentPage="charts" />
           
            <main className="py-8 pt-24">
                <div className="container mx-auto px-4 md:px-12">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                       <h1 className="text-3xl md:text-4xl font-black">All Charts</h1>
                        <div className="flex items-center space-x-2 md:space-x-4">
                           <div className="relative w-full md:w-auto">
                                <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text" placeholder="Search charts..." value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-white/5 border-2 border-transparent focus:border-cyan-400 rounded-lg pl-12 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none transition-colors"
                                />
                            </div>
                             <div className="relative">
                                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="appearance-none bg-white/5 hover:bg-white/10 rounded-lg pl-4 pr-10 py-2.5 font-semibold focus:outline-none cursor-pointer">
                                    {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
                                </select>
                                <ChevronDown className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                            </div>
                            <div className="relative">
                                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="appearance-none bg-white/5 hover:bg-white/10 rounded-lg pl-4 pr-10 py-2.5 font-semibold focus:outline-none cursor-pointer">
                                    <option value="latest">Latest</option>
                                    <option value="oldest">Oldest</option>
                                    <option value="a-z">A-Z</option>
                                    <option value="z-a">Z-A</option>
                                </select>
                                <ChevronDown className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                            </div>
                            <div className="flex items-center bg-white/5 rounded-lg p-1">
                               <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white/20' : 'text-gray-400'} hover:text-white transition-colors`} aria-label="Grid View">
                                 <LayoutGrid size={20} />
                               </button>
                               <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white/20' : 'text-gray-400'} hover:text-white transition-colors`} aria-label="List View">
                                 <List size={20} />
                               </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 md:px-12">
                     {filteredAndSortedCharts.length > 0 ? (
                        viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {filteredAndSortedCharts.map(item => (
                                    <ChartCard key={item.id} chart={item} onChartSelect={onChartSelect} />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredAndSortedCharts.map(item => (
                                    <ChartListItem key={item.id} chart={item} onChartSelect={onChartSelect} />
                                ))}
                            </div>
                        )
                    ) : (
                         <p className="text-gray-400 text-center py-12 text-lg">No charts found. Try adjusting your search or filters.</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ChartsPage;
