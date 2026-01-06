
import React, { useState } from 'react';
import { Comment as CommentType, Reply } from '../types';
import { Heart, MessageSquare, Send } from 'lucide-react';

interface CommentProps {
    comment: CommentType;
    onAddReply: (commentId: string, replyText: string) => void;
}

const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m";
    return Math.floor(seconds) + "s";
}


const Comment: React.FC<CommentProps> = ({ comment, onAddReply }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(comment.likes);
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState('');

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikes(prev => isLiked ? prev - 1 : prev + 1);
    }
    
    const handleReplySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (replyText.trim()) {
            onAddReply(comment.id, replyText);
            setReplyText('');
            setShowReplyInput(false);
        }
    };


    return (
        <div className="flex items-start space-x-3 my-4">
            <img src={comment.avatarUrl} alt={comment.author} className="w-9 h-9 rounded-full" />
            <div className="flex-1">
                <div>
                    <span className="font-semibold text-sm mr-2">{comment.author}</span>
                    <span className="text-gray-400 text-xs">{timeAgo(comment.timestamp)}</span>
                </div>
                <p className="text-sm text-gray-200 mt-1">{comment.text}</p>
                <div className="flex items-center space-x-4 mt-2 text-gray-400">
                    <button onClick={handleLike} className="flex items-center space-x-1 text-xs hover:text-white">
                         <Heart size={14} fill={isLiked ? '#ef4444' : 'none'} className={isLiked ? 'text-red-500' : ''}/>
                        <span>{likes > 0 ? likes.toLocaleString() : ''}</span>
                    </button>
                    <button onClick={() => setShowReplyInput(!showReplyInput)} className="flex items-center space-x-1 text-xs hover:text-white">
                        <MessageSquare size={14} />
                        <span>Reply</span>
                    </button>
                </div>
                
                {showReplyInput && (
                     <form onSubmit={handleReplySubmit} className="flex items-center space-x-2 mt-3">
                         <img src="https://i.pravatar.cc/150?u=current-user" alt="Your avatar" className="w-8 h-8 rounded-full"/>
                         <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`Replying to ${comment.author}...`}
                            className="flex-grow bg-gray-800/80 rounded-full px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm"
                            autoFocus
                        />
                        <button type="submit" className="p-2 rounded-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600" disabled={!replyText.trim()}>
                            <Send size={16} className="text-black" />
                        </button>
                    </form>
                )}

                {comment.replies.length > 0 && (
                    <div className="mt-3 pl-4 border-l-2 border-gray-800">
                        {comment.replies.map(reply => <ReplyComponent key={reply.id} reply={reply} />)}
                    </div>
                )}
            </div>
        </div>
    )
}

const ReplyComponent: React.FC<{ reply: Reply }> = ({ reply }) => {
     const [isLiked, setIsLiked] = useState(false);
     const [likes, setLikes] = useState(reply.likes);

     const handleLike = () => {
        setIsLiked(!isLiked);
        setLikes(prev => isLiked ? prev - 1 : prev + 1);
    }
    
    return (
        <div className="flex items-start space-x-3 my-3">
            <img src={reply.avatarUrl} alt={reply.author} className="w-8 h-8 rounded-full" />
            <div className="flex-1">
                 <div>
                    <span className="font-semibold text-xs mr-2">{reply.author}</span>
                    <span className="text-gray-500 text-xs">{timeAgo(reply.timestamp)}</span>
                </div>
                <p className="text-sm text-gray-300 mt-1">{reply.text}</p>
                 <div className="flex items-center space-x-4 mt-2 text-gray-500">
                    <button onClick={handleLike} className="flex items-center space-x-1 text-xs hover:text-white">
                         <Heart size={12} fill={isLiked ? '#ef4444' : 'none'} className={isLiked ? 'text-red-500' : ''} />
                        <span>{likes > 0 ? likes.toLocaleString() : ''}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Comment;
