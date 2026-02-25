'use client';

import React, { useState, useEffect } from 'react';
import { Send, Loader } from 'lucide-react';
import Comment from './Comment';

export default function CommentsPanel({ videoId, userId, userRole }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/videos/${videoId}/comments`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      setComments(data.comments || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !userId) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/videos/${videoId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({ commentText: newComment }),
      });

      if (!response.ok) throw new Error('Failed to post comment');

      const data = await response.json();
      setComments([data.comment, ...comments]);
      setNewComment('');
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId) => {
    try {
      const response = await fetch(
        `/api/videos/${videoId}/comments/${commentId}/like`,
        {
          method: 'POST',
          headers: { 'x-user-id': userId },
        }
      );
      if (!response.ok) throw new Error('Failed to like comment');

      const data = await response.json();
      setComments(
        comments.map((c) =>
          c._id === commentId ? { ...c, likes: data.likes } : c
        )
      );
    } catch (err) {
      console.error('Error liking comment:', err);
    }
  };

  const handleReply = async (commentId, replyText) => {
    try {
      const response = await fetch(
        `/api/videos/${videoId}/comments/${commentId}/replies`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': userId,
          },
          body: JSON.stringify({ replyText }),
        }
      );

      if (!response.ok) throw new Error('Failed to add reply');

      const data = await response.json();
      setComments(
        comments.map((c) =>
          c._id === commentId
            ? { ...c, replies: [...(c.replies || []), data.reply] }
            : c
        )
      );
    } catch (err) {
      console.error('Error adding reply:', err);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const response = await fetch(
        `/api/videos/${videoId}/comments/${commentId}`,
        {
          method: 'DELETE',
          headers: { 'x-user-id': userId },
        }
      );

      if (!response.ok) throw new Error('Failed to delete comment');

      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const handleApprove = async (commentId) => {
    try {
      const response = await fetch(
        `/api/admin/comments/${commentId}/approve`,
        { method: 'PUT' }
      );

      if (!response.ok) throw new Error('Failed to approve comment');

      const data = await response.json();
      setComments(
        comments.map((c) =>
          c._id === commentId ? data.comment : c
        )
      );
    } catch (err) {
      console.error('Error approving comment:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleReject = async (commentId) => {
    try {
      const response = await fetch(
        `/api/admin/comments/${commentId}/reject`,
        { method: 'PUT' }
      );

      if (!response.ok) throw new Error('Failed to reject comment');

      const data = await response.json();
      setComments(
        comments.map((c) =>
          c._id === commentId ? data.comment : c
        )
      );
    } catch (err) {
      console.error('Error rejecting comment:', err);
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="bg-[#050a14] rounded-lg p-6 text-white">
      <h3 className="text-2xl font-bold mb-6">{comments.length} Comments</h3>

      {/* Comment Form */}
      {userId ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="flex gap-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 resize-none"
              rows={3}
              disabled={submitting}
            />
          </div>
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="mt-3 px-6 py-2 bg-cyan-500 text-black font-semibold rounded-lg hover:bg-cyan-600 disabled:opacity-50 flex items-center gap-2"
          >
            {submitting ? (
              <>
                <Loader size={18} className="animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send size={18} />
                Post Comment
              </>
            )}
          </button>
          {newComment.trim() && (
            <p className="text-xs text-gray-400 mt-2">
              ℹ️ Your comment will be reviewed by moderators before appearing
            </p>
          )}
        </form>
      ) : (
        <p className="text-center py-6 text-gray-400">
          Please log in to comment
        </p>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8 text-gray-400">
          Loading comments...
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-400">{error}</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onReply={handleReply}
              onDelete={handleDelete}
              userId={userId}
              videoId={videoId}
              userRole={userRole}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
      )}
    </div>
  );
}
