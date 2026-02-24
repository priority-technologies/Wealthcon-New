import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Page } from '../types';
import { ChevronDown } from 'lucide-react';

interface FAQPageProps {
    onLogout: () => void;
    onNavigate: (page: Page) => void;
}

const faqData = [
    {
        question: 'What is Wealthcon?',
        answer: 'Wealthcon is an exclusive financial education platform designed specifically for medical professionals. Our motto is "For Doctors, By Doctors." We provide curated courses, notes, and resources to help doctors achieve financial independence.'
    },
    {
        question: 'Who can join Wealthcon?',
        answer: 'Our platform is tailored for medical professionals, including doctors, dentists, and medical students. The content is designed to address the unique financial challenges and opportunities faced by those in the medical field.'
    },
    {
        question: 'How do I access the courses?',
        answer: 'Once you are logged in, you can access all our content through the "Videos", "Notes", and "Charts" sections. Content is organized by category, and you can use the search and filter functions to find topics relevant to you.'
    },
    {
        question: 'Is there a mobile app?',
        answer: 'Currently, Wealthcon is accessible through our web platform on any device. We are actively working on developing dedicated mobile apps for iOS and Android to provide an even better on-the-go experience.'
    },
    {
        question: 'How can I become an educator on the platform?',
        answer: 'We are always looking for experts to contribute. If you are a medical professional with expertise in finance, you can apply by clicking the "Register as a Senior Guide/Educator" link in the footer of our website.'
    }
];

const FAQItem: React.FC<{ q: string, a: string }> = ({ q, a }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-white/10">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left py-5 px-6"
            >
                <h3 className="text-lg font-semibold text-white">{q}</h3>
                <ChevronDown className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} size={24} />
            </button>
            <div
                className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                     <p className="pb-5 px-6 text-gray-300">{a}</p>
                </div>
            </div>
        </div>
    );
};

const FAQPage: React.FC<FAQPageProps> = ({ onLogout, onNavigate }) => {
    return (
        <div className="bg-[#050a14] min-h-screen text-white">
            <Navbar onLogout={onLogout} onNavigate={onNavigate} currentPage="faq" />
            <main className="py-8 pt-24">
                <div className="container mx-auto px-4 md:px-12">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-black text-center mb-4">Frequently Asked Questions</h1>
                        <p className="text-xl text-gray-400 text-center mb-12">Find answers to the most common questions about Wealthcon.</p>
                        
                        <div className="bg-white/5 rounded-lg border border-white/10">
                            {faqData.map((faq, index) => (
                                <FAQItem key={index} q={faq.question} a={faq.answer} />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FAQPage;