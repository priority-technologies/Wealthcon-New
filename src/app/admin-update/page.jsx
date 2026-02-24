'use client';

import React, { useEffect, useState } from 'react';

const AdminUpdatePage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/allAnnouncements');
      const data = await response.json();
      setAnnouncements(data.announcement || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-wc-dark flex items-center justify-center">
        <p className="text-white">Loading updates...</p>
      </div>
    );
  }

  return (
    <div className="bg-wc-dark min-h-screen text-white pt-8 pb-12">
      <div className="container mx-auto px-4 md:px-12">
        <h1 className="text-4xl font-black mb-8">Admin&apos;s Update</h1>
        <div className="max-w-2xl mx-auto space-y-6">
          {announcements.map((announcement) => (
            <div
              key={announcement._id}
              className="bg-wc-card p-6 rounded-lg hover:bg-white/10 transition-colors"
            >
              <h3 className="text-xl font-bold text-wc-cyan mb-2">{announcement.title}</h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-200 whitespace-pre-wrap">{announcement.description}</p>
              </div>
              {announcement.createdAt && (
                <p className="text-gray-500 text-sm mt-4">
                  {new Date(announcement.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
        {announcements.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No updates yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUpdatePage;
