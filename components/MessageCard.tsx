
import React from 'react';
import { MessageItem } from '../types';
import { educators } from '../data/mockData';

interface MessageCardProps {
    message: MessageItem;
    index: number;
}

const MessageCard: React.FC<MessageCardProps> = ({ message, index }) => {
    const author = educators.find(e => e.id === message.authorId);

    const formattedDate = new Date(message.timestamp).toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });

    return (
        <div 
            className="flex items-start space-x-4 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <img src={author?.avatarUrl} alt={author?.name} className="w-10 h-10 rounded-full flex-shrink-0 mt-1" />
            <div className="flex-1 bg-gray-800/50 p-4 rounded-lg border border-cyan-500/30 shadow-sm">
                <div 
                    className="prose prose-sm prose-invert max-w-none text-gray-200"
                    dangerouslySetInnerHTML={{ __html: message.content }}
                />
                <p className="text-right text-xs text-gray-400 mt-4">{formattedDate}</p>
            </div>
            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.5s ease-out forwards;
                    opacity: 0;
                }
                .prose a {
                    color: #22d3ee;
                }
                .prose a:hover {
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
};

export default MessageCard;
