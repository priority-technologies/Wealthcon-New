'use client';

import { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';

export default function ChannelsManagement() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('grid');
  const [showForm, setShowForm] = useState(false);
  const [editingChannel, setEditingChannel] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    educatorName: '',
    profilePicture: '',
  });

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/channels');
      setChannels(response.data.channels || []);
    } catch (error) {
      console.error('Error fetching channels:', error);
      alert('Failed to fetch channels');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingChannel) {
        await axios.put(`/api/admin/channels/${editingChannel._id}`, formData);
        alert('Channel updated successfully!');
      } else {
        await axios.post('/api/admin/channels', formData);
        alert('Channel created successfully!');
      }
      setFormData({ name: '', description: '', educatorName: '', profilePicture: '' });
      setEditingChannel(null);
      setShowForm(false);
      fetchChannels();
    } catch (error) {
      console.error('Error saving channel:', error);
      alert(error.response?.data?.error || 'Error saving channel');
    }
  };

  const handleEdit = (channel) => {
    setEditingChannel(channel);
    setFormData({
      name: channel.name,
      description: channel.description || '',
      educatorName: channel.educatorName || '',
      profilePicture: channel.profilePicture || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (channelId) => {
    if (confirm('Are you sure you want to delete this channel?')) {
      try {
        await axios.delete(`/api/admin/channels/${channelId}`);
        alert('Channel deleted successfully!');
        fetchChannels();
      } catch (error) {
        console.error('Error deleting channel:', error);
        alert(error.response?.data?.error || 'Error deleting channel');
      }
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '', educatorName: '', profilePicture: '' });
    setEditingChannel(null);
    setShowForm(false);
  };

  if (loading && channels.length === 0) {
    return <div className="text-center py-8">Loading channels...</div>;
  }

  return (
    <Fragment>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Channels Management</h1>
          <p className="text-sm text-gray-500">Manage your learning channels and educators</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            {view === 'grid' ? '📋 List' : '🔲 Grid'}
          </button>
          <button
            onClick={() => {
              handleCancel();
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            + Create Channel
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-base-200 p-6 rounded-lg mb-6 border-l-4 border-blue-600">
          <h2 className="text-xl font-bold mb-4">
            {editingChannel ? 'Edit Channel' : 'Create New Channel'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Channel Name *</label>
              <input
                type="text"
                placeholder="Enter channel name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded bg-white text-black focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                placeholder="Enter channel description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded bg-white text-black focus:outline-none focus:border-blue-500"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Educator Name</label>
              <input
                type="text"
                placeholder="Enter educator/trainer name"
                value={formData.educatorName}
                onChange={(e) => setFormData({ ...formData, educatorName: e.target.value })}
                className="w-full p-2 border rounded bg-white text-black focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Profile Picture URL</label>
              <input
                type="text"
                placeholder="Enter profile picture URL"
                value={formData.profilePicture}
                onChange={(e) => setFormData({ ...formData, profilePicture: e.target.value })}
                className="w-full p-2 border rounded bg-white text-black focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                {editingChannel ? 'Update' : 'Create'} Channel
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {channels.length === 0 ? (
        <div className="text-center py-12 bg-base-200 rounded">
          <p className="text-gray-500 text-lg">No channels created yet</p>
          <p className="text-gray-400 text-sm mt-2">Click &quot;Create Channel&quot; to get started</p>
        </div>
      ) : (
        <div
          className={
            view === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {channels.map((channel) => (
            <div
              key={channel._id}
              className={`bg-base-200 rounded-lg overflow-hidden hover:shadow-lg transition ${
                view === 'list' ? 'flex gap-4 p-4' : 'p-4'
              }`}
            >
              {channel.profilePicture && (
                <div
                  className={
                    view === 'grid'
                      ? 'w-full h-40 bg-gray-300 rounded-lg mb-4 overflow-hidden'
                      : 'w-20 h-20 bg-gray-300 rounded flex-shrink-0'
                  }
                >
                  <img
                    src={channel.profilePicture}
                    alt={channel.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-base-content">{channel.name}</h3>
                {channel.educatorName && (
                  <p className="text-sm text-gray-500 mt-1">👨‍🏫 {channel.educatorName}</p>
                )}
                {channel.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {channel.description}
                  </p>
                )}
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded">
                    📹 {channel.videoCount || 0} videos
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleEdit(channel)}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 text-sm rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(channel._id)}
                    className="flex-1 bg-red-600 text-white px-3 py-2 text-sm rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Fragment>
  );
}
