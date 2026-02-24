'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/comments');
      setComments(response.data.comments || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError(err.response?.data?.error || 'Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (commentId) => {
    try {
      await axios.put('/api/admin/comments', {
        commentId,
        status: 'approved',
      });
      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      console.error('Error approving comment:', err);
      alert('Failed to approve comment');
    }
  };

  const handleReject = async (commentId) => {
    try {
      await axios.put('/api/admin/comments', {
        commentId,
        status: 'rejected',
      });
      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      console.error('Error rejecting comment:', err);
      alert('Failed to reject comment');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading comments...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Pending Comments</h1>
        <p className="text-gray-600">{comments.length} comments awaiting approval</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {comments.length === 0 ? (
        <div className="p-8 text-center bg-gray-50 rounded-lg">
          <p className="text-gray-600">No pending comments to review</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="bg-white border border-gray-200 rounded-lg p-6">
              {/* Video Info */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-600">
                  Video: <span className="font-semibold">{comment.videoId?.title || 'Unknown'}</span>
                </p>
              </div>

              {/* Main Comment */}
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-800">{comment.authorName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(comment.postedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 mt-2">{comment.commentText}</p>
                <div className="flex gap-2 text-xs text-gray-600 mt-2">
                  <span>👍 {comment.likes} likes</span>
                  {comment.replies?.length > 0 && (
                    <span>💬 {comment.replies.length} replies</span>
                  )}
                </div>
              </div>

              {/* Nested Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mb-4 pl-4 border-l-4 border-gray-300">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Replies:</p>
                  <div className="space-y-3">
                    {comment.replies.map((reply, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-semibold text-sm text-gray-800">{reply.authorName}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(reply.postedAt).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-gray-700 text-sm">{reply.replyText}</p>
                        <div className="flex gap-2 text-xs text-gray-600 mt-2">
                          <span>👍 {reply.likes} likes</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleApprove(comment._id)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors font-semibold text-sm"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(comment._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors font-semibold text-sm"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminComments;
