
import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ContentSliderProps {
    children: React.ReactNode;
    className?: string;
}

const ContentSlider: React.FC<ContentSliderProps> = ({ children, className }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);

    const checkScrollPosition = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setIsAtStart(scrollLeft === 0);
            setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 1); // -1 for precision issues
        }
    };

    useEffect(() => {
        const currentRef = scrollRef.current;
        if (currentRef) {
            checkScrollPosition();
            currentRef.addEventListener('scroll', checkScrollPosition);
            window.addEventListener('resize', checkScrollPosition);

            // Check position after children have likely rendered
            const timer = setTimeout(checkScrollPosition, 200);

            return () => {
                currentRef.removeEventListener('scroll', checkScrollPosition);
                window.removeEventListener('resize', checkScrollPosition);
                clearTimeout(timer);
            };
        }
    }, [children]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.8; // Scroll by 80% of the visible width
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="relative group">
            <div
                ref={scrollRef}
                className={`flex overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-12 ${className || 'space-x-4'}`}
            >
                {children}
                <div className="flex-shrink-0 w-8"></div>
            </div>
            
            {/* Left Arrow */}
            <button
                onClick={() => scroll('left')}
                className={`absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-[#050a14] to-transparent z-20 flex items-center justify-center
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isAtStart ? 'hidden' : ''}`}
            >
                <ChevronLeft size={40} className="text-white hover:scale-125 transition-transform" />
            </button>

            {/* Right Arrow */}
            <button
                onClick={() => scroll('right')}
                className={`absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-[#050a14] to-transparent z-20 flex items-center justify-center
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isAtEnd ? 'hidden' : ''}`}
            >
                <ChevronRight size={40} className="text-white hover:scale-125 transition-transform" />
            </button>
        </div>
    );
};

export default ContentSlider;
