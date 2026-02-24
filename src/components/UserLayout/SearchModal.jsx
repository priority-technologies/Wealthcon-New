'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, Video, FileText, BarChart2 } from 'lucide-react';
import Link from 'next/link';

const SearchModal = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState({ videos: [], notes: [], charts: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    if (searchTerm.trim().length > 2) {
      performSearch();
    } else {
      setResults({ videos: [], notes: [], charts: [] });
      setExpandedCategories({});
    }
  }, [searchTerm]);

  const performSearch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ search: searchTerm }),
      });
      const data = await response.json();
      setResults(data.data || { videos: [], notes: [], charts: [] });
      setExpandedCategories({});
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const getDisplayItems = (items, category) => {
    const isExpanded = expandedCategories[category];
    return isExpanded ? items : items.slice(0, 3);
  };

  const hasMoreItems = (items) => items.length > 3;

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
          <button
            onClick={onClose}
            className="absolute top-1/2 right-6 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X size={28} />
          </button>
        </div>

        <div className="mt-8 max-h-[60vh] overflow-y-auto pr-2">
          {searchTerm.trim() && (
            <div className="space-y-6">
              {results.videos.length > 0 && (
                <div>
                  <h3 className="text-gray-400 font-bold uppercase mb-3 flex items-center gap-2">
                    <Video size={16} /> Videos
                  </h3>
                  <div className="space-y-2">
                    {getDisplayItems(results.videos, 'videos').map((video) => (
                      <SearchResultItem key={video._id}>
                        <img
                          src={video.thumbnail || '/placeholder.png'}
                          alt={video.title}
                          className="w-20 h-12 object-cover rounded"
                        />
                        <span>{video.title}</span>
                      </SearchResultItem>
                    ))}
                  </div>
                  {hasMoreItems(results.videos) && (
                    <button
                      onClick={() => toggleCategory('videos')}
                      className="mt-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      {expandedCategories['videos'] ? 'Show Less' : `See More (${results.videos.length - 3} more)`}
                    </button>
                  )}
                </div>
              )}

              {results.notes.length > 0 && (
                <div>
                  <h3 className="text-gray-400 font-bold uppercase mb-3 flex items-center gap-2">
                    <FileText size={16} /> Notes
                  </h3>
                  <div className="space-y-2">
                    {getDisplayItems(results.notes, 'notes').map((note) => (
                      <SearchResultItem key={note._id}>
                        <img
                          src={note.thumbnail || '/placeholder.png'}
                          alt={note.title}
                          className="w-20 h-12 object-cover rounded"
                        />
                        <span>{note.title}</span>
                      </SearchResultItem>
                    ))}
                  </div>
                  {hasMoreItems(results.notes) && (
                    <button
                      onClick={() => toggleCategory('notes')}
                      className="mt-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      {expandedCategories['notes'] ? 'Show Less' : `See More (${results.notes.length - 3} more)`}
                    </button>
                  )}
                </div>
              )}

              {results.charts.length > 0 && (
                <div>
                  <h3 className="text-gray-400 font-bold uppercase mb-3 flex items-center gap-2">
                    <BarChart2 size={16} /> Charts
                  </h3>
                  <div className="space-y-2">
                    {getDisplayItems(results.charts, 'charts').map((chart) => (
                      <SearchResultItem key={chart._id}>
                        <img
                          src={chart.image || '/placeholder.png'}
                          alt={chart.title}
                          className="w-20 h-12 object-cover rounded"
                        />
                        <span>{chart.title}</span>
                      </SearchResultItem>
                    ))}
                  </div>
                  {hasMoreItems(results.charts) && (
                    <button
                      onClick={() => toggleCategory('charts')}
                      className="mt-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      {expandedCategories['charts'] ? 'Show Less' : `See More (${results.charts.length - 3} more)`}
                    </button>
                  )}
                </div>
              )}

              {results.videos.length === 0 && results.notes.length === 0 && results.charts.length === 0 && (
                <p className="text-center text-gray-400 mt-16">No results found for &quot;{searchTerm}&quot;</p>
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

const SearchResultItem = ({ children }) => (
  <div className="flex items-center gap-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors text-white">
    {children}
  </div>
);

export default SearchModal;
