
import React from 'react';
import Navbar from '../components/Navbar';
import { Page } from '../types';
import { User, Activity, ShieldCheck } from 'lucide-react';

interface ProfilePageProps {
    onLogout: () => void;
    onNavigate: (page: Page) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onLogout, onNavigate }) => {
    return (
        <div className="bg-[#050a14] min-h-screen text-white">
            <Navbar onLogout={onLogout} onNavigate={onNavigate} currentPage="profile" />
           
            <main className="py-8 pt-24">
                <div className="container mx-auto px-4 md:px-12">
                   <div className="max-w-4xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                            <div className="relative">
                                <img src="https://i.pravatar.cc/150?u=current-user" alt="User Avatar" className="w-32 h-32 rounded-full border-4 border-cyan-500" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-center md:text-left">Dr. Ankit</h1>
                                <p className="text-lg text-gray-400 text-center md:text-left">doctor@wealthcon.com</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                             <div>
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><Activity /> My Activity</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-white/5 p-4 rounded-lg">
                                        <p className="text-gray-400 text-sm">Courses Completed</p>
                                        <p className="text-3xl font-bold">12</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-lg">
                                        <p className="text-gray-400 text-sm">Notes Saved</p>
                                        <p className="text-3xl font-bold">5</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-lg">
                                        <p className="text-gray-400 text-sm">Charts Viewed</p>
                                        <p className="text-3xl font-bold">28</p>
                                    </div>
                                </div>
                            </div>
                            
                             <div>
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><ShieldCheck /> Account Details</h2>
                                <div className="bg-white/5 p-6 rounded-lg">
                                    <p className="text-gray-300">This is a placeholder for account details management.</p>
                                </div>
                            </div>
                        </div>

                   </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
