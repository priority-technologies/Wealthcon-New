'use client';

import React, { useEffect, useState } from 'react';

const ChartsPage = () => {
  const [charts, setCharts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCharts();
  }, []);

  const fetchCharts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/gallery');
      const data = await response.json();
      setCharts(data.gallery || []);
    } catch (error) {
      console.error('Error fetching charts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-wc-dark flex items-center justify-center">
        <p className="text-white">Loading charts...</p>
      </div>
    );
  }

  return (
    <div className="bg-wc-dark min-h-screen text-white pt-8 pb-12">
      <div className="container mx-auto px-4 md:px-12">
        <h1 className="text-4xl font-black mb-8">Charts & Analysis</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {charts.map((chart) => (
            <div key={chart._id} className="group rounded-lg overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform">
              <img
                src={chart.thumbnail || '/placeholder.png'}
                alt={chart.title}
                className="w-full aspect-square object-cover group-hover:opacity-80 transition-opacity"
              />
              <div className="p-4 bg-wc-card">
                <h3 className="text-white font-bold text-sm line-clamp-2">{chart.title}</h3>
              </div>
            </div>
          ))}
        </div>
        {charts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No charts available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartsPage;
