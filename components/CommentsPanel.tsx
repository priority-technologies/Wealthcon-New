
import React, { useState, useEffect } from 'react';
import { ShortItem, Comment as CommentType, Reply } from '../types';
import { Send, X } from 'lucide-react';
import Comment from './Comment';

interface CommentsPanelProps {
    short: ShortItem;
    onClose: () => void;
}

const CommentsPanel: React.FC<CommentsPanelProps> = ({ short, onClose }) => {
    const [comments, setComments] = useState<CommentType[]>(short.comments);
    const [newComment, setNewComment] = useState('');

    // Update comments when the short prop changes
    useEffect(() => {
        setComments(short.comments);
    }, [short]);

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim() === '') return;
        
        const newCommentObj: CommentType = {
            id: `new-comment-${Date.now()}`,
            author: 'You',
            avatarUrl: 'https://i.pravatar.cc/150?u=current-user',
            text: newComment,
            likes: 0,
            timestamp: new Date().toISOString(),
            replies: []
        };
        
        setComments([newCommentObj, ...comments]);
        setNewComment('');
    }

    const handleAddReply = (commentId: string, replyText: string) => {
        const newReply: Reply = {
            id: `new-reply-${Date.now()}`,
            author: 'You',
            avatarUrl: 'https://i.pravatar.cc/150?u=current-user',
            text: replyText,
            likes: 0,
            timestamp: new Date().toISOString(),
        };

        setComments(currentComments =>
            currentComments.map(comment => {
                if (comment.id === commentId) {
                    return { ...comment, replies: [...comment.replies, newReply] };
                }
                return comment;
            })
        );
    };

    return (
        <div className="h-full bg-[#121212] text-white p-4 flex flex-col rounded-lg">
            <div className="flex-shrink-0 flex justify-between items-center border-b border-gray-700 pb-3 mb-3">
                <h3 className="font-bold text-lg">{comments.length} Comments</h3>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10">
                    <X size={24} />
                </button>
            </div>
            
            <div className="flex-grow overflow-y-auto pr-2 scrollbar-hide">
                {comments.map(comment => (
                    <Comment key={comment.id} comment={comment} onAddReply={handleAddReply} />
                ))}
            </div>

            <div className="flex-shrink-0 pt-3 border-t border-gray-700">
                <form onSubmit={handleAddComment} className="flex items-center space-x-2">
                     <img src="https://i.pravatar.cc/150?u=current-user" alt="Your avatar" className="w-9 h-9 rounded-full"/>
                     <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-grow bg-gray-700/50 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm"
                    />
                    <button type="submit" className="p-2 rounded-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600" disabled={!newComment.trim()}>
                        <Send size={20} className="text-black" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CommentsPanel;
