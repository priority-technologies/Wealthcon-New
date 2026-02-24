'use client';

import React, { useContext, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { UserContext } from '@/app/_context/User';

export default function UserLayout({ children }) {
  const { loading } = useContext(UserContext);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-wc-dark flex items-center justify-center">
        <div className="text-white text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wc-cyan"></div>
          </div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wc-dark text-white flex flex-col">
      <Navbar />
      <main className="flex-grow pt-[60px]">{children}</main>
      <Footer onOpenRegistrationModal={() => setIsRegistrationModalOpen(true)} />
    </div>
  );
}
