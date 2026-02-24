
import React from 'react';
import { Film, Radio, BellRing } from 'lucide-react';

interface NotificationPanelProps {
    onDismiss: () => void;
    setHasUnread: (hasUnread: boolean) => void;
}

const notifications = [
    { id: 1, icon: Film, text: 'New Course Added: "Advanced Tax Strategies"', time: '2h ago' },
    { id: 2, icon: Radio, text: 'Live Q&A with Dr. Ram starting in 15 minutes.', time: '1d ago' },
    { id: 3, icon: BellRing, text: 'Your "Retirement Checklist" has a new update.', time: '3d ago' },
];

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onDismiss, setHasUnread }) => {
    
    const handleMarkAsRead = () => {
        setHasUnread(false);
        // Here you would also update the state of notifications in a real app
        onDismiss();
    };

    return (
        <div className="absolute top-full right-0 mt-2 w-80 bg-black/80 backdrop-blur-md border border-white/10 rounded-md shadow-lg text-white">
            <div className="p-3 border-b border-white/10 flex justify-between items-center">
                <h4 className="font-bold">Notifications</h4>
                <button onClick={handleMarkAsRead} className="text-xs text-cyan-400 hover:underline">Mark all as read</button>
            </div>
            <div className="max-h-80 overflow-y-auto">
                {notifications.map(n => (
                    <div key={n.id} className="flex items-start gap-3 p-3 hover:bg-white/10 border-b border-white/5">
                        <n.icon className="text-cyan-400 mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-sm">{n.text}</p>
                            <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationPanel;
