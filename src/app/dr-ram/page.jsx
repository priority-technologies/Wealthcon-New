'use client';

import React, { useEffect, useState } from 'react';

const DrRamPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/messages');
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-wc-dark flex items-center justify-center">
        <p className="text-white">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="bg-wc-dark min-h-screen text-white pt-8 pb-12">
      <div className="container mx-auto px-4 md:px-12">
        <h1 className="text-4xl font-black mb-8">Dr. Ram&apos;s Message</h1>
        <div className="max-w-2xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message._id}
              className="bg-wc-card p-6 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-200 whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.createdAt && (
                <p className="text-gray-500 text-sm mt-4">
                  {new Date(message.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
        {messages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No messages yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DrRamPage;
