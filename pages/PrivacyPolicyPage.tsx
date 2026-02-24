import React from 'react';
import Navbar from '../components/Navbar';
import { Page } from '../types';

interface PrivacyPolicyPageProps {
    onLogout: () => void;
    onNavigate: (page: Page) => void;
}

const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onLogout, onNavigate }) => {
    return (
        <div className="bg-[#050a14] min-h-screen text-white">
            <Navbar onLogout={onLogout} onNavigate={onNavigate} currentPage="privacy" />
            <main className="py-8 pt-24">
                <div className="container mx-auto px-4 md:px-12">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-black mb-8">Privacy Policy</h1>
                        <div className="prose prose-lg prose-invert max-w-none text-gray-300">
                            <p>Last Updated: October 26, 2023</p>
                            <p>Wealthcon ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.</p>

                            <h2>1. Information We Collect</h2>
                            <p>We may collect personal information that you provide to us directly, such as your name, email address, professional credentials, and payment information when you register for an account.</p>
                            
                            <h2>2. How We Use Your Information</h2>
                            <p>We use the information we collect to:</p>
                            <ul>
                                <li>Provide, operate, and maintain our platform.</li>
                                <li>Improve, personalize, and expand our services.</li>
                                <li>Process your transactions.</li>
                                <li>Communicate with you, including for customer service and to provide you with updates and other information relating to the platform.</li>
                            </ul>

                            <h2>3. Sharing Your Information</h2>
                            <p>We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.</p>

                            <h2>4. Data Security</h2>
                            <p>We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information.</p>
                            
                            <h2>5. Your Rights</h2>
                            <p>You have the right to access, update, or delete the information we have on you. Whenever made possible, you can access, update, or request deletion of your Personal Data directly within your account settings section.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PrivacyPolicyPage;