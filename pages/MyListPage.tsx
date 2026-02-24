
import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import { NoteItem, Page } from '../types';
import { notesData } from '../data/mockData';
import { LayoutGrid, List, Search, ChevronDown } from 'lucide-react';
import NoteCard from '../components/NoteCard';
import NoteListItem from '../components/NoteListItem';

type ViewMode = 'grid' | 'list';

interface MyListPageProps {
    onLogout: () => void;
    onNoteSelect: (note: NoteItem) => void;
    onNavigate: (page: Page) => void;
}

const MyListPage: React.FC<MyListPageProps> = ({ onLogout, onNoteSelect, onNavigate }) => {
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('latest');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const savedNotes = useMemo(() => notesData.filter(note => note.isSaved), []);
    const categories = useMemo(() => ['all', ...Array.from(new Set(savedNotes.map(n => n.category)))], [savedNotes]);

    const filteredAndSortedNotes = useMemo(() => {
        let notes = [...savedNotes];

        if (categoryFilter !== 'all') {
            notes = notes.filter(note => note.category === categoryFilter);
        }

        if (searchTerm) {
            notes = notes.filter(note =>
                note.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        switch (sortOrder) {
            case 'latest':
                notes.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
                break;
            case 'oldest':
                notes.sort((a, b) => new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime());
                break;
            case 'a-z':
                notes.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'z-a':
                notes.sort((a, b) => b.title.localeCompare(a.title));
                break;
        }

        return notes;
    }, [searchTerm, sortOrder, categoryFilter, savedNotes]);

    return (
        <div className="bg-[#050a14] min-h-screen text-white">
            <Navbar onLogout={onLogout} onNavigate={onNavigate} currentPage="my-list" />
           
            <main className="py-8 pt-24">
                <div className="container mx-auto px-4 md:px-12">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                       <h1 className="text-3xl md:text-4xl font-black">My List</h1>
                        <div className="flex items-center space-x-2 md:space-x-4">
                           <div className="relative w-full md:w-auto">
                                <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text" placeholder="Search my list..." value={searchTerm}
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
                    {filteredAndSortedNotes.length > 0 ? (
                        viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {filteredAndSortedNotes.map(item => (
                                    <NoteCard key={item.id} note={item} onNoteSelect={onNoteSelect} />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredAndSortedNotes.map(item => (
                                    <NoteListItem key={item.id} note={item} onNoteSelect={onNoteSelect} />
                                ))}
                            </div>
                        )
                    ) : (
                         <p className="text-gray-400 text-center py-12 text-lg">Your list is empty. Save notes to see them here.</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default MyListPage;
