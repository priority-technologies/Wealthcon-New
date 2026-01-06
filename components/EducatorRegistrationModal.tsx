import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle } from 'lucide-react';

interface EducatorRegistrationModalProps {
    onClose: () => void;
}

const EducatorRegistrationModal: React.FC<EducatorRegistrationModalProps> = ({ onClose }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
            setTimeout(() => {
                onClose();
            }, 3000); // Close modal after 3 seconds
        }, 1500);
    };

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-[#0c121e] border border-white/10 rounded-lg shadow-2xl w-full max-w-lg relative p-8 animate-slide-up"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <X size={24} />
                </button>
                
                {isSubmitted ? (
                    <div className="text-center py-8">
                        <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white">Application Submitted!</h2>
                        <p className="text-gray-300 mt-2">Thank you for your interest. Our team will review your application and get back to you shortly.</p>
                    </div>
                ) : (
                    <>
                        <h2 className="text-3xl font-bold text-white mb-2">Become an Educator</h2>
                        <p className="text-gray-400 mb-6">Share your expertise with our community of medical professionals.</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                             <div>
                                <label htmlFor="name" className="text-sm font-medium text-gray-300">Full Name</label>
                                <input type="text" id="name" required className="mt-1 w-full bg-white/5 p-2 rounded-md border border-white/20 focus:outline-none focus:border-cyan-400" />
                            </div>
                             <div>
                                <label htmlFor="email" className="text-sm font-medium text-gray-300">Email Address</label>
                                <input type="email" id="email" required className="mt-1 w-full bg-white/5 p-2 rounded-md border border-white/20 focus:outline-none focus:border-cyan-400" />
                            </div>
                             <div>
                                <label htmlFor="expertise" className="text-sm font-medium text-gray-300">Area of Expertise (e.g., Stocks, Real Estate)</label>
                                <input type="text" id="expertise" required className="mt-1 w-full bg-white/5 p-2 rounded-md border border-white/20 focus:outline-none focus:border-cyan-400" />
                            </div>
                             <div>
                                <label htmlFor="message" className="text-sm font-medium text-gray-300">Tell us about yourself</label>
                                <textarea id="message" rows={4} required className="mt-1 w-full bg-white/5 p-2 rounded-md border border-white/20 focus:outline-none focus:border-cyan-400"></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full mt-4 bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 rounded-lg text-lg transition-all transform hover:scale-105 active:scale-100 disabled:bg-cyan-800 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isSubmitting ? (
                                    <svg className="animate-spin h-5 w-5 mr-3 text-black" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : <Send size={20} className="mr-2" />}
                                Submit Application
                            </button>
                        </form>
                    </>
                )}
            </div>
             <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default EducatorRegistrationModal;