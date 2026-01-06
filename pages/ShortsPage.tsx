import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Short from '../components/Short';
import CommentsPanel from '../components/CommentsPanel';
import { shortsData } from '../data/mockData';
import { ShortItem, Page } from '../types';

interface ShortsPageProps {
    onLogout: () => void;
    onNavigate: (page: Page) => void;
}

const ShortsPage: React.FC<ShortsPageProps> = ({ onLogout, onNavigate }) => {
    const [activeShort, setActiveShort] = useState<ShortItem>(shortsData[0]);
    const [isCommentsPanelOpen, setIsCommentsPanelOpen] = useState(false);
    const shortRefs = useRef<(HTMLDivElement | null)[]>([]);

    const toggleCommentsPanel = () => {
        setIsCommentsPanelOpen(prev => !prev);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const shortId = entry.target.getAttribute('data-short-id');
                        const newActiveShort = shortsData.find(s => s.id === shortId);
                        if (newActiveShort) {
                            setActiveShort(newActiveShort);
                        }
                    }
                });
            },
            { threshold: 0.7 }
        );

        const currentRefs = shortRefs.current;
        currentRefs.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            currentRefs.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, []);

    return (
        <div className="bg-black h-screen w-screen overflow-hidden flex flex-col">
            <div className="flex-shrink-0">
                 <Navbar onLogout={onLogout} onNavigate={onNavigate} currentPage="shorts" />
            </div>
            <main className="flex-grow flex items-center justify-center h-full overflow-hidden pt-[60px]">
                <div className="flex items-center justify-center h-full">
                    {/* Video Scroller */}
                    <div className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide">
                        {shortsData.map((short, index) => (
                            <div
                                key={short.id}
                                // FIX: Changed the ref callback from an implicit return `() => value` to an explicit block `{...}`.
                                // The ref callback should not return a value, which was causing a type error.
                                ref={el => { shortRefs.current[index] = el; }}
                                data-short-id={short.id}
                                className="h-full w-full snap-start flex items-center justify-center relative"
                            >
                                <Short short={short} onToggleComments={toggleCommentsPanel} />
                            </div>
                        ))}
                    </div>

                    {/* Comments Panel Container */}
                    <div className={`flex-shrink-0 h-full overflow-hidden transition-all duration-500 ease-in-out ${isCommentsPanelOpen ? 'w-[420px] ml-8' : 'w-0'}`}>
                       {isCommentsPanelOpen && activeShort && <CommentsPanel short={activeShort} onClose={toggleCommentsPanel} />}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ShortsPage;
