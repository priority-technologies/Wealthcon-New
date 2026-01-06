
import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import { Page } from '../types';
import { drRamsMessages } from '../data/mockData';
import MessageCard from '../components/MessageCard';
import { Search } from 'lucide-react';

interface DrRamsMessagesPageProps {
    onLogout: () => void;
    onNavigate: (page: Page) => void;
}

const DrRamsMessagesPage: React.FC<DrRamsMessagesPageProps> = ({ onLogout, onNavigate }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredMessages = useMemo(() => {
        let messages = [...drRamsMessages].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        if (searchTerm) {
            messages = messages.filter(msg =>
                msg.content.toLowerCase().replace(/<[^>]*>?/gm, '').includes(searchTerm.toLowerCase())
            );
        }
        return messages;
    }, [searchTerm]);

    return (
        <div className="bg-[#050a14] min-h-screen text-white">
            <Navbar onLogout={onLogout} onNavigate={onNavigate} currentPage="dr-ram" />
           
            <main className="py-8 pt-24">
                <div className="container mx-auto px-4 md:px-12">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                       <h1 className="text-3xl md:text-4xl font-black">Dr. Ram's Messages</h1>
                        <div className="relative w-full md:w-auto md:max-w-xs">
                            <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text" placeholder="Search messages..." value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/5 border-2 border-transparent focus:border-cyan-400 rounded-lg pl-12 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-6">
                        {filteredMessages.length > 0 ? (
                            filteredMessages.map((message, index) => (
                                <MessageCard key={message.id} message={message} index={index} />
                            ))
                        ) : (
                            <p className="text-gray-400 text-center py-12 text-lg">No messages found.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DrRamsMessagesPage;
