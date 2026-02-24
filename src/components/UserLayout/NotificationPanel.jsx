'use client';

import React, { useEffect, useState } from 'react';
import { Film, Radio, Bell } from 'lucide-react';
import Link from 'next/link';

const NotificationPanel = ({ onDismiss, setHasUnread }) => {
  const [notifications, setNotifications] = useState({ videos: [], notes: [], gallery: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      const data = await response.json();
      setNotifications(data || { videos: [], notes: [], gallery: [] });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAllAsRead = () => {
    setHasUnread(false);
    onDismiss();
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-black/80 backdrop-blur-md border border-white/10 rounded-md shadow-lg">
      <div className="p-3 border-b border-white/10 flex justify-between items-center">
        <h4 className="font-bold text-white">Notifications</h4>
        <button
          onClick={handleMarkAllAsRead}
          className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          Mark all as read
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto scrollbar-hide">
        {isLoading ? (
          <div className="p-4 text-center text-gray-400">Loading...</div>
        ) : notifications.videos.length === 0 && notifications.notes.length === 0 && notifications.gallery.length === 0 ? (
          <div className="p-4 text-center text-gray-400 text-sm">No notifications</div>
        ) : (
          <>
            {notifications.videos.map((item) => (
              <Link
                key={item._id}
                href={`/videos/${item._id}`}
                className="flex items-start gap-3 p-3 hover:bg-white/10 border-b border-white/5 transition-colors"
              >
                <Film className="text-cyan-400 mt-1 flex-shrink-0" size={20} />
                <div className="flex-1">
                  <p className="text-sm text-gray-200">{item.title}</p>
                  <p className="text-xs text-gray-400 mt-1">New video added</p>
                </div>
              </Link>
            ))}
            {notifications.notes.map((item) => (
              <Link
                key={item._id}
                href={`/notes/${item._id}`}
                className="flex items-start gap-3 p-3 hover:bg-white/10 border-b border-white/5 transition-colors"
              >
                <Radio className="text-cyan-400 mt-1 flex-shrink-0" size={20} />
                <div className="flex-1">
                  <p className="text-sm text-gray-200">{item.title}</p>
                  <p className="text-xs text-gray-400 mt-1">New note added</p>
                </div>
              </Link>
            ))}
            {notifications.gallery.map((item) => (
              <Link
                key={item._id}
                href={`/charts/${item._id}`}
                className="flex items-start gap-3 p-3 hover:bg-white/10 border-b border-white/5 transition-colors"
              >
                <Bell className="text-cyan-400 mt-1 flex-shrink-0" size={20} />
                <div className="flex-1">
                  <p className="text-sm text-gray-200">{item.title || 'New gallery item'}</p>
                  <p className="text-xs text-gray-400 mt-1">New chart added</p>
                </div>
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
