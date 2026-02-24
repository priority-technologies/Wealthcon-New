'use client';

import React from 'react';
import Link from 'next/link';

const WealthconLogoSmall = () => (
  <svg width="40" height="40" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
    <path d="M35 65 L5 20 L17.5 20 L35 45 L52.5 20 L65 20 Z" fill="#00AEEF" />
    <path d="M17.5 20 L35 45 L35 37.5 L22.5 20 Z" fill="rgba(0,0,0,0.2)" />
    <path d="M52.5 20 L35 45 L35 37.5 L47.5 20 Z" fill="rgba(255,255,255,0.2)" />
    <path d="M35 50 L31 57.5 H 39 Z" fill="#00AEEF" />
    <rect x="29" y="57.5" width="12" height="2" rx="1" fill="#00AEEF" />
    <path d="M35 47.5 L34 45 H 36 Z" fill="#050a14" />
  </svg>
);

const Footer = ({ onOpenRegistrationModal }) => {
  return (
    <footer className="bg-[#0c121e] text-gray-400 border-t border-white/10">
      <div className="container mx-auto px-4 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3">
              <WealthconLogoSmall />
              <span className="text-white text-2xl font-bold">WEALTHCON</span>
            </div>
            <p className="mt-4 text-sm">Financial Education Platform for Doctors, by Doctors.</p>
          </div>

          <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold text-white mb-3">Company</h4>
              <ul>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li className="mt-2">
                  <Link href="#" className="hover:text-white transition-colors">
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Legal</h4>
              <ul>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
                <li className="mt-2">
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Get Involved</h4>
              <ul>
                <li>
                  <button
                    onClick={onOpenRegistrationModal}
                    className="text-left hover:text-white transition-colors"
                  >
                    Register as an Educator
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Wealthcon. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
