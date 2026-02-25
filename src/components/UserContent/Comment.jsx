'use client';

import React, { useState } from 'react';
import { Heart, MessageCircle, Trash2, Check, X } from 'lucide-react';

export default function Comment({
  comment,
  onLike,
  onReply,
  onDelete,
  userId,
  videoId,
  userRole,
  onApprove,
  onReject
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasLiked = comment.likedBy?.some(id => id === userId);

  const handleLike = async () => {
    if (onLike) {
      await onLike(comment._id);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setIsSubmitting(true);
    try {
      await onReply(comment._id, replyText);
      setReplyText('');
      setShowReplyForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Delete this comment?')) {
      await onDelete(comment._id);
    }
  };

  const handleApprove = async () => {
    if (onApprove) {
      await onApprove(comment._id);
    }
  };

  const handleReject = async () => {
    if (onReject) {
      await onReject(comment._id);
    }
  };

  const canDelete = userId === comment.userId?._id || userId === comment.userId;
  const isAdmin = userRole === 'admin' || userRole === 'superAdmin';

  return (
    <div className="mb-4">
      {/* Main Comment */}
      <div className="flex gap-3 p-3 bg-white/5 rounded-lg">
        <img
          src={comment.authorAvatar || 'https://i.pravatar.cc/150?u=default'}
          alt={comment.authorName}
          className="w-10 h-10 rounded-full flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-semibold text-white">{comment.authorName}</span>
            {comment.status === 'pending' && (
              <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">
                Pending approval
              </span>
            )}
            {comment.status === 'approved' && (
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                Approved
              </span>
            )}
            {comment.status === 'rejected' && (
              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
                Rejected
              </span>
            )}

            {/* Admin approval/rejection buttons */}
            {isAdmin && comment.status === 'pending' && (
              <div className="flex gap-2 ml-auto">
                <button
                  onClick={handleApprove}
                  className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded text-xs transition-colors"
                >
                  <Check size={14} />
                  Approve
                </button>
                <button
                  onClick={handleReject}
                  className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded text-xs transition-colors"
                >
                  <X size={14} />
                  Reject
                </button>
              </div>
            )}
          </div>

          <p className="text-gray-300 text-sm break-words">{comment.commentText}</p>

          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 hover:text-white transition-colors ${
                hasLiked ? 'text-red-500' : ''
              }`}
            >
              <Heart size={16} fill={hasLiked ? 'currentColor' : 'none'} />
              {comment.likes || 0}
            </button>

            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <MessageCircle size={16} />
              Reply
            </button>

            {canDelete && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-1 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <form onSubmit={handleReplySubmit} className="mt-3 ml-13">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting || !replyText.trim()}
              className="px-4 py-2 bg-cyan-500 text-black font-semibold text-sm rounded hover:bg-cyan-600 disabled:opacity-50"
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      )}

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 ml-3 pl-3 border-l border-gray-600">
          {comment.replies.map((reply) => (
            <div key={reply._id} className="mb-3 flex gap-3">
              <img
                src={reply.authorAvatar || 'https://i.pravatar.cc/150?u=default'}
                alt={reply.authorName}
                className="w-8 h-8 rounded-full flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white text-sm">{reply.authorName}</span>
                </div>

                <p className="text-gray-300 text-sm break-words">{reply.replyText}</p>

                <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                  <button className="flex items-center gap-1 hover:text-white transition-colors">
                    <Heart size={14} />
                    {reply.likes || 0}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
