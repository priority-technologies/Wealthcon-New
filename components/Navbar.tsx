import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, User, Briefcase, Lock, LogOut } from 'lucide-react';
import { Page, ContentItem, NoteItem, ChartItem } from '../types';
import SearchModal from './SearchModal';
import NotificationPanel from './NotificationPanel';

const WealthconLogoSmall = () => (
    <svg width="48" height="48" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
      <path d="M35 65 L5 20 L17.5 20 L35 45 L52.5 20 L65 20 Z" fill="#00AEEF" />
      <path d="M17.5 20 L35 45 L35 37.5 L22.5 20 Z" fill="rgba(0,0,0,0.2)" />
      <path d="M52.5 20 L35 45 L35 37.5 L47.5 20 Z" fill="rgba(255,255,255,0.2)" />
      <path d="M35 50 L31 57.5 H 39 Z" fill="#00AEEF" />
      <rect x="29" y="57.5" width="12" height="2" rx="1" fill="#00AEEF" />
      <path d="M35 47.5 L34 45 H 36 Z" fill="#050a14" />
    </svg>
  );

interface NavbarProps {
    onLogout: () => void;
    onNavigate: (page: Page) => void;
    currentPage: Page;
}

const NavLink: React.FC<{ page: Page; currentPage: Page; onNavigate: (page: Page) => void; children: React.ReactNode; className?: string }> = ({ page, currentPage, onNavigate, children, className }) => {
    const isActive = currentPage === page;
    return (
        <li>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate(page); }} 
               className={`hover:text-white transition-colors whitespace-nowrap ${isActive ? 'text-white font-bold' : 'text-gray-300'} ${className}`}>
                {children}
            </a>
        </li>
    )
}


const Navbar: React.FC<NavbarProps> = ({ onLogout, onNavigate, currentPage }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleItemSelect = (item: ContentItem | NoteItem | ChartItem) => {
      setIsSearchOpen(false);
      // This is a simplified navigation. In a real app with routing, this would be more robust.
      if ('durationMinutes' in item) { // It's a ContentItem (video)
          alert(`Selected video: ${item.title}. App-level navigation needed.`);
      } else if ('documentUrl' in item) { // It's a NoteItem
          onNavigate('notes');
           alert(`Selected note: ${item.title}. App-level navigation needed.`);
      } else { // It's a ChartItem
          onNavigate('charts');
           alert(`Selected chart: ${item.title}. App-level navigation needed.`);
      }
  }


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
            setIsNotificationsOpen(false);
        }
        if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
            setIsProfileOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050a14]/70 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 md:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-10">
            <WealthconLogoSmall />
            <ul className="hidden md:flex items-center space-x-8 text-white font-semibold text-lg">
              <NavLink page="home" currentPage={currentPage} onNavigate={onNavigate}>Home</NavLink>
              <NavLink page="videos" currentPage={currentPage} onNavigate={onNavigate}>Videos</NavLink>
              <NavLink page="shorts" currentPage={currentPage} onNavigate={onNavigate}>Shorts</NavLink>
              <NavLink page="notes" currentPage={currentPage} onNavigate={onNavigate}>Notes</NavLink>
              <NavLink page="charts" currentPage={currentPage} onNavigate={onNavigate}>Charts</NavLink>
              <NavLink page="dr-ram" currentPage={currentPage} onNavigate={onNavigate}>Dr. Ram's Message</NavLink>
              <NavLink page="admin-update" currentPage={currentPage} onNavigate={onNavigate}>Admin's Update</NavLink>
              <NavLink page="my-list" currentPage={currentPage} onNavigate={onNavigate}>My List</NavLink>
            </ul>
          </div>

          <div className="flex items-center space-x-8 text-white">
            <button onClick={() => setIsSearchOpen(true)} aria-label="Open search">
              <Search className="cursor-pointer hover:text-gray-300" size={24} />
            </button>
            
            <div className="relative" ref={notificationsRef}>
                <button onClick={() => setIsNotificationsOpen(prev => !prev)} className="relative" aria-label="Toggle notifications">
                    <Bell className="cursor-pointer hover:text-gray-300" size={24} />
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
              <button onClick={() => setIsProfileOpen(prev => !prev)} className="h-9 flex items-center" aria-label="Toggle profile menu">
                <User className="cursor-pointer hover:text-gray-300" size={24} />
              </button>
              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-black/80 backdrop-blur-md border border-white/10 rounded-md shadow-lg pt-2 pb-2 animate-fade-in-dropdown">
                    <div className="px-4 py-2 border-b border-white/10 mb-2">
                        <p className="font-bold text-white">Dr. Ankit</p>
                        <p className="text-sm text-gray-400">doctor@wealthcon.com</p>
                    </div>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('profile'); setIsProfileOpen(false); }} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-white/10 w-full"><Briefcase size={16} /> Profile</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('change-password'); setIsProfileOpen(false); }} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-white/10 w-full"><Lock size={16} /> Change Password</a>
                    <button onClick={() => { onLogout(); setIsProfileOpen(false); }} className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20"><LogOut size={16}/> Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} onItemSelect={handleItemSelect} />}
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