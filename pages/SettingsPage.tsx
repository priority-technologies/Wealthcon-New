
import React from 'react';
import Navbar from '../components/Navbar';
import { Page } from '../types';
import { User, Bell, Lock } from 'lucide-react';

interface SettingsPageProps {
    onLogout: () => void;
    onNavigate: (page: Page) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onLogout, onNavigate }) => {
    return (
        <div className="bg-[#050a14] min-h-screen text-white">
            <Navbar onLogout={onLogout} onNavigate={onNavigate} currentPage="settings" />
           
            <main className="py-8 pt-24">
                <div className="container mx-auto px-4 md:px-12">
                   <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl font-black mb-8">Settings</h1>
                        
                        <div className="bg-white/5 rounded-lg border border-white/10">
                            {/* Account Section */}
                            <div className="p-6 border-b border-white/10">
                                <h2 className="text-xl font-bold flex items-center gap-3"><User /> Account</h2>
                                <p className="text-gray-400 mt-2">Manage your account details, email, and password.</p>
                                <button className="mt-4 bg-cyan-500 text-black font-bold px-5 py-2 rounded-md text-sm hover:bg-cyan-600 transition-colors">Edit Profile</button>
                            </div>

                             {/* Notifications Section */}
                            <div className="p-6 border-b border-white/10">
                                <h2 className="text-xl font-bold flex items-center gap-3"><Bell /> Notifications</h2>
                                <p className="text-gray-400 mt-2">Control how you receive notifications from the platform.</p>
                                 <div className="mt-4 space-y-2">
                                    <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" className="accent-cyan-500 w-5 h-5" defaultChecked /> Email Notifications</label>
                                    <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" className="accent-cyan-500 w-5 h-5" /> Push Notifications</label>
                                </div>
                            </div>

                             {/* Privacy Section */}
                            <div className="p-6">
                                <h2 className="text-xl font-bold flex items-center gap-3"><Lock /> Privacy</h2>
                                <p className="text-gray-400 mt-2">Manage your privacy settings and data.</p>
                                <button className="mt-4 bg-white/10 text-white font-bold px-5 py-2 rounded-md text-sm hover:bg-white/20 transition-colors">Manage Data</button>
                            </div>
                        </div>
                   </div>
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;
