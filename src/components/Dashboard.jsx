'use client';

import React, { useState, useEffect } from 'react';

export default function Dashboard({ filter }) {
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalUsers: 0,
    totalComments: 0,
    totalChannels: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, [filter]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      // Fetch dashboard stats from API
      const response = await fetch('/api/admin/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Videos Card */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Total Videos</p>
            <h3 className="text-3xl font-bold mt-2">{stats.totalVideos}</h3>
          </div>
          <div className="text-5xl opacity-20">📹</div>
        </div>
      </div>

      {/* Total Users Card */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Total Users</p>
            <h3 className="text-3xl font-bold mt-2">{stats.totalUsers}</h3>
          </div>
          <div className="text-5xl opacity-20">👥</div>
        </div>
      </div>

      {/* Total Comments Card */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Total Comments</p>
            <h3 className="text-3xl font-bold mt-2">{stats.totalComments}</h3>
          </div>
          <div className="text-5xl opacity-20">💬</div>
        </div>
      </div>

      {/* Total Channels Card */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Total Channels</p>
            <h3 className="text-3xl font-bold mt-2">{stats.totalChannels}</h3>
          </div>
          <div className="text-5xl opacity-20">📺</div>
        </div>
      </div>
    </div>
  );
}
