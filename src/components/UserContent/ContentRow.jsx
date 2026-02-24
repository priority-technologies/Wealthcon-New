'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import ContentSlider from './ContentSlider';
import ContentCard from './ContentCard';

const ContentRow = ({ title, items = [], seeAllLink = '#' }) => {
  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-4 px-4 md:px-12">
        <h2 className="text-white text-xl md:text-2xl font-bold">{title}</h2>
        <Link href={seeAllLink} className="group flex items-center text-sm font-semibold text-wc-cyan hover:text-white transition-colors">
          See All
          <ChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" size={20} />
        </Link>
      </div>
      <ContentSlider>
        {items.map((item) => (
          <Link key={item._id} href={`/videos/${item._id}`}>
            <ContentCard item={item} />
          </Link>
        ))}
      </ContentSlider>
    </div>
  );
};

export default ContentRow;
