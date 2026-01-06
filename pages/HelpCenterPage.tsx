import React from 'react';
import Navbar from '../components/Navbar';
import { Page } from '../types';
import { User, DollarSign, Monitor, LifeBuoy, Send } from 'lucide-react';

interface HelpCenterPageProps {
    onLogout: () => void;
    onNavigate: (page: Page) => void;
}

const HelpCenterPage: React.FC<HelpCenterPageProps> = ({ onLogout, onNavigate }) => {
    return (
        <div className="bg-[#050a14] min-h-screen text-white">
            <Navbar onLogout={onLogout} onNavigate={onNavigate} currentPage="help" />
            <main className="py-8 pt-24">
                <div className="container mx-auto px-4 md:px-12">
                    <div className="max-w-5xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-black text-center mb-4">Help Center</h1>
                        <p className="text-xl text-gray-400 text-center mb-12">How can we help you today?</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center mb-16">
                            <div className="bg-white/5 p-6 rounded-lg hover:bg-white/10 transition-colors">
                                <User size={40} className="mx-auto text-cyan-400 mb-3" />
                                <h3 className="text-xl font-bold">Account</h3>
                                <p className="text-sm text-gray-400 mt-1">Manage your profile and settings.</p>
                            </div>
                            <div className="bg-white/5 p-6 rounded-lg hover:bg-white/10 transition-colors">
                                <DollarSign size={40} className="mx-auto text-cyan-400 mb-3" />
                                <h3 className="text-xl font-bold">Billing</h3>
                                <p className="text-sm text-gray-400 mt-1">Subscription and payment queries.</p>
                            </div>
                             <div className="bg-white/5 p-6 rounded-lg hover:bg-white/10 transition-colors">
                                <Monitor size={40} className="mx-auto text-cyan-400 mb-3" />
                                <h3 className="text-xl font-bold">Technical</h3>
                                <p className="text-sm text-gray-400 mt-1">Video playback or access issues.</p>
                            </div>
                             <div className="bg-white/5 p-6 rounded-lg hover:bg-white/10 transition-colors">
                                <LifeBuoy size={40} className="mx-auto text-cyan-400 mb-3" />
                                <h3 className="text-xl font-bold">General</h3>
                                <p className="text-sm text-gray-400 mt-1">Other questions about the platform.</p>
                            </div>
                        </div>

                        <div className="bg-white/5 p-8 rounded-lg border border-white/10">
                            <h2 className="text-2xl font-bold text-center">Still need help?</h2>
                            <p className="text-gray-400 text-center mt-2 mb-6">Contact our support team directly.</p>
                             <form className="max-w-xl mx-auto space-y-4">
                                <div>
                                    <label htmlFor="help-email" className="text-sm font-medium text-gray-300">Your Email</label>
                                    <input type="email" id="help-email" required className="mt-1 w-full bg-white/5 p-2 rounded-md border border-white/20 focus:outline-none focus:border-cyan-400" />
                                </div>
                                 <div>
                                    <label htmlFor="help-subject" className="text-sm font-medium text-gray-300">Subject</label>
                                    <input type="text" id="help-subject" required className="mt-1 w-full bg-white/5 p-2 rounded-md border border-white/20 focus:outline-none focus:border-cyan-400" />
                                </div>
                                <div>
                                    <label htmlFor="help-message" className="text-sm font-medium text-gray-300">How can we help?</label>
                                    <textarea id="help-message" rows={5} required className="mt-1 w-full bg-white/5 p-2 rounded-md border border-white/20 focus:outline-none focus:border-cyan-400"></textarea>
                                </div>
                                <button type="submit" className="w-full mt-4 bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 rounded-lg text-lg transition-colors flex items-center justify-center">
                                    <Send size={20} className="mr-2"/> Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HelpCenterPage;