'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ContentSlider = ({ children, className = '' }) => {
  const scrollRef = useRef(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setIsAtStart(scrollLeft === 0);
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const scroller = scrollRef.current;
    if (scroller) {
      scroller.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        scroller.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
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
        className={`flex overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-12 ${className}`}
      >
        {children}
        <div className="flex-shrink-0 w-8"></div>
      </div>

      {!isAtStart && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-wc-dark to-transparent z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
        >
          <ChevronLeft className="text-white" size={40} />
        </button>
      )}

      {!isAtEnd && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-wc-dark to-transparent z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
        >
          <ChevronRight className="text-white" size={40} />
        </button>
      )}
    </div>
  );
};

export default ContentSlider;
