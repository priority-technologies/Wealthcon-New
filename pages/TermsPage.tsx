import React from 'react';
import Navbar from '../components/Navbar';
import { Page } from '../types';

interface TermsPageProps {
    onLogout: () => void;
    onNavigate: (page: Page) => void;
}

const TermsPage: React.FC<TermsPageProps> = ({ onLogout, onNavigate }) => {
    return (
        <div className="bg-[#050a14] min-h-screen text-white">
            <Navbar onLogout={onLogout} onNavigate={onNavigate} currentPage="terms" />
            <main className="py-8 pt-24">
                <div className="container mx-auto px-4 md:px-12">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-black mb-8">Terms and Conditions</h1>
                        <div className="prose prose-lg prose-invert max-w-none text-gray-300">
                            <p>Last Updated: October 26, 2023</p>
                            <p>Please read these Terms and Conditions ("Terms", "Terms and Conditions") carefully before using the Wealthcon platform operated by us.</p>

                            <h2>1. Acceptance of Terms</h2>
                            <p>By accessing and using our platform, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>
                            
                            <h2>2. Content</h2>
                            <p>Our platform provides educational content for informational purposes only. It is not intended as financial, investment, or legal advice. You should consult with a professional for advice tailored to your individual circumstances.</p>

                            <h2>3. User Accounts</h2>
                            <p>When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service.</p>

                            <h2>4. Intellectual Property</h2>
                            <p>The platform and its original content, features, and functionality are and will remain the exclusive property of Wealthcon and its licensors. The content is protected by copyright, trademark, and other laws of both India and foreign countries.</p>
                            
                            <h2>5. Termination</h2>
                            <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TermsPage;