
import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, Video, FileText, BarChart2 } from 'lucide-react';
import { contentData, notesData, chartsData } from '../data/mockData';
import { ContentItem, NoteItem, ChartItem } from '../types';

interface SearchModalProps {
    onClose: () => void;
    onItemSelect: (item: ContentItem | NoteItem | ChartItem) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ onClose, onItemSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const searchResults = useMemo(() => {
        if (!searchTerm.trim()) {
            return { videos: [], notes: [], charts: [] };
        }
        const lowercasedTerm = searchTerm.toLowerCase();
        
        const videos = contentData.filter(item => item.title.toLowerCase().includes(lowercasedTerm));
        const notes = notesData.filter(item => item.title.toLowerCase().includes(lowercasedTerm));
        const charts = chartsData.filter(item => item.title.toLowerCase().includes(lowercasedTerm));

        return { videos, notes, charts };
    }, [searchTerm]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex justify-center p-4 pt-[15vh] animate-fade-in">
            <div className="w-full max-w-2xl">
                <div className="relative">
                    <Search className="absolute top-1/2 left-6 -translate-y-1/2 text-gray-400" size={24} />
                    <input
                        type="text"
                        placeholder="Search for videos, notes, charts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                        className="w-full bg-white/10 border-2 border-white/20 rounded-full pl-16 pr-16 py-4 text-white text-lg placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                     <button onClick={onClose} className="absolute top-1/2 right-6 -translate-y-1/2 text-gray-400 hover:text-white">
                        <X size={28} />
                    </button>
                </div>

                <div className="mt-8 max-h-[60vh] overflow-y-auto pr-2">
                    {searchTerm.trim() && (
                        <div className="space-y-6">
                            {searchResults.videos.length > 0 && (
                                <div>
                                    <h3 className="text-gray-400 font-bold uppercase mb-3 flex items-center gap-2"><Video size={16}/> Videos</h3>
                                    <div className="space-y-2">
                                        {searchResults.videos.map(item => (
                                            <SearchResultItem key={item.id} onClick={() => onItemSelect(item)}>
                                                <img src={item.thumbnailUrl} alt={item.title} className="w-20 h-12 object-cover rounded"/>
                                                <span>{item.title}</span>
                                            </SearchResultItem>
                                        ))}
                                    </div>
                                </div>
                            )}
                             {searchResults.notes.length > 0 && (
                                <div>
                                    <h3 className="text-gray-400 font-bold uppercase mb-3 flex items-center gap-2"><FileText size={16}/> Notes</h3>
                                    <div className="space-y-2">
                                        {searchResults.notes.map(item => (
                                           <SearchResultItem key={item.id} onClick={() => onItemSelect(item)}>
                                                <img src={item.thumbnailUrl} alt={item.title} className="w-20 h-12 object-cover rounded"/>
                                                <span>{item.title}</span>
                                            </SearchResultItem>
                                        ))}
                                    </div>
                                </div>
                            )}
                             {searchResults.charts.length > 0 && (
                                <div>
                                    <h3 className="text-gray-400 font-bold uppercase mb-3 flex items-center gap-2"><BarChart2 size={16}/> Charts</h3>
                                    <div className="space-y-2">
                                        {searchResults.charts.map(item => (
                                           <SearchResultItem key={item.id} onClick={() => onItemSelect(item)}>
                                                <img src={item.imageUrl} alt={item.title} className="w-20 h-12 object-cover rounded"/>
                                                <span>{item.title}</span>
                                            </SearchResultItem>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {searchResults.videos.length === 0 && searchResults.notes.length === 0 && searchResults.charts.length === 0 && (
                                <p className="text-center text-gray-400 mt-16">No results found for "{searchTerm}"</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

const SearchResultItem: React.FC<{onClick: () => void, children: React.ReactNode}> = ({onClick, children}) => (
    <div onClick={onClick} className="flex items-center gap-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors text-white">
        {children}
    </div>
)

export default SearchModal;
