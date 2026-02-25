'use client';

import React from 'react';
import Link from 'next/link';
import WealthconLogo from '@/components/Logo/WealthconLogo';

const Footer = ({ onOpenRegistrationModal }) => {
  return (
    <footer className="bg-[#0c121e] text-gray-400 border-t border-white/10">
      <div className="container mx-auto px-4 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3">
              <WealthconLogo size={64} />
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
