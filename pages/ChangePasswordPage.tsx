import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Page } from '../types';
import { Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

interface ChangePasswordPageProps {
    onLogout: () => void;
    onNavigate: (page: Page) => void;
}

const PasswordInput: React.FC<{
    id: string,
    label: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    isVisible: boolean,
    onToggleVisibility: () => void,
}> = ({ id, label, value, onChange, isVisible, onToggleVisibility }) => (
    <div className="relative">
        <input
            type={isVisible ? 'text' : 'password'}
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            className="w-full bg-white/5 border-2 border-white/20 rounded-lg px-4 py-3 text-white placeholder-transparent focus:outline-none focus:border-cyan-400 peer transition-colors"
            placeholder={label}
            required
        />
        <label
            htmlFor={id}
            className="absolute left-4 -top-2.5 text-sm text-white/70 bg-[#0c121e] px-1 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-cyan-400 transition-all"
        >
            {label}
        </label>
        <button
            type="button"
            onClick={onToggleVisibility}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-white/50 hover:text-white/80"
            aria-label={`Toggle ${label} visibility`}
        >
            {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
    </div>
);

const ChangePasswordPage: React.FC<ChangePasswordPageProps> = ({ onLogout, onNavigate }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword.length < 8) {
            setError('New password must be at least 8 characters long.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            return;
        }

        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            if (currentPassword === 'password123') { // Simulate correct current password
                 setSuccess('Password changed successfully!');
                 setCurrentPassword('');
                 setNewPassword('');
                 setConfirmPassword('');
            } else {
                setError('The current password you entered is incorrect.');
            }
        }, 1500);
    };

    return (
        <div className="bg-[#050a14] min-h-screen text-white">
            <Navbar onLogout={onLogout} onNavigate={onNavigate} currentPage="change-password" />
           
            <main className="py-8 pt-24">
                <div className="container mx-auto px-4 md:px-12">
                   <div className="max-w-md mx-auto">
                        <h1 className="text-4xl font-black mb-8 text-center">Change Password</h1>
                        
                        <div className="bg-[#0c121e] rounded-lg border border-white/10 p-8 shadow-2xl">
                            <form onSubmit={handleSubmit} className="space-y-6">
                               <PasswordInput 
                                    id="current-password"
                                    label="Current Password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    isVisible={showCurrent}
                                    onToggleVisibility={() => setShowCurrent(!showCurrent)}
                                />

                                <PasswordInput 
                                    id="new-password"
                                    label="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    isVisible={showNew}
                                    onToggleVisibility={() => setShowNew(!showNew)}
                                />
                                
                                 <PasswordInput 
                                    id="confirm-password"
                                    label="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    isVisible={showConfirm}
                                    onToggleVisibility={() => setShowConfirm(!showConfirm)}
                                />

                                {error && (
                                    <div className="flex items-center gap-3 text-red-400 bg-red-500/10 p-3 rounded-md">
                                        <XCircle size={20} />
                                        <p className="text-sm font-medium">{error}</p>
                                    </div>
                                )}
                                {success && (
                                    <div className="flex items-center gap-3 text-green-400 bg-green-500/10 p-3 rounded-md">
                                        <CheckCircle size={20} />
                                        <p className="text-sm font-medium">{success}</p>
                                    </div>
                                )}
                                
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full mt-4 bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 rounded-lg text-lg transition-all transform hover:scale-105 active:scale-100 disabled:bg-cyan-800 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Updating...
                                        </>
                                    ) : 'Update Password'}
                                </button>
                            </form>
                        </div>
                   </div>
                </div>
            </main>
        </div>
    );
};

export default ChangePasswordPage;