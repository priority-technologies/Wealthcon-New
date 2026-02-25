'use client';

import React, { useState, useEffect, useRef, useContext } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Bell, User, Lock, LogOut, Settings } from 'lucide-react';
import SearchModal from './SearchModal';
import NotificationPanel from './NotificationPanel';
import { UserContext } from '@/app/_context/User';
import WealthconLogo from '@/components/Logo/WealthconLogo';

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { userDetails } = useContext(UserContext);

  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'GET' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (route) => pathname === route;
  const getLinkClass = (route) =>
    `hover:text-white transition-colors whitespace-nowrap ${isActive(route) ? 'text-white font-bold' : 'text-gray-300'}`;

  const navItems = [
    { label: 'Home', href: '/home' },
    { label: 'Videos', href: '/videos' },
    { label: 'Dr. Ram\'s Message', href: '/dr-ram' },
    { label: 'Admin\'s Update', href: '/admin-update' },
    { label: 'My List', href: '/my-list' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050a14]/70 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 md:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-10">
            <Link href="/home" className="hover:opacity-80 transition-opacity">
              <WealthconLogo size={72} />
            </Link>
            <ul className="hidden md:flex items-center space-x-8 text-white font-semibold text-lg">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={getLinkClass(item.href)}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center space-x-8 text-white">
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open search"
              className="hover:text-gray-300 transition-colors"
            >
              <Search className="cursor-pointer" size={24} />
            </button>

            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative hover:text-gray-300 transition-colors"
                aria-label="Toggle notifications"
              >
                <Bell className="cursor-pointer" size={24} />
                {hasUnread && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                  </span>
                )}
              </button>
              {isNotificationsOpen && (
                <div className="absolute top-full right-0 mt-2 animate-fade-in-dropdown">
                  <NotificationPanel onDismiss={() => setIsNotificationsOpen(false)} setHasUnread={setHasUnread} />
                </div>
              )}
            </div>

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="h-9 flex items-center hover:text-gray-300 transition-colors"
                aria-label="Toggle profile menu"
              >
                <User className="cursor-pointer" size={24} />
              </button>
              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-black/80 backdrop-blur-md border border-white/10 rounded-md shadow-lg pt-2 pb-2 animate-fade-in-dropdown">
                  <div className="px-4 py-2 border-b border-white/10 mb-2">
                    <p className="font-bold text-white">{userDetails?.username || 'User'}</p>
                    <p className="text-sm text-gray-400">{userDetails?.email || ''}</p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-white/10 w-full block"
                  >
                    <User size={16} /> Profile
                  </Link>
                  <Link
                    href="/change-password"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-white/10 w-full block"
                  >
                    <Lock size={16} /> Change Password
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setIsProfileOpen(false); }}
                    className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20"
                  >
                    <LogOut size={16}/> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
      <style>{`
        @keyframes fadeInDropdown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-dropdown {
          animation: fadeInDropdown 0.2s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default Navbar;
