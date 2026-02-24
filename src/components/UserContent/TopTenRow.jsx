'use client';

import React from 'react';
import Link from 'next/link';
import ContentSlider from './ContentSlider';
import TopTenCard from './TopTenCard';

const TopTenRow = ({ items = [] }) => {
  return (
    <div className="space-y-6">
      <div className="container mx-auto px-4 md:px-12">
        <h2 className="text-2xl font-bold">Top 10 Most Viewed</h2>
      </div>
      <ContentSlider className="space-x-12">
        {items.slice(0, 10).map((item, index) => (
          <Link key={item._id} href={`/videos/${item._id}`}>
            <TopTenCard item={item} rank={index + 1} />
          </Link>
        ))}
      </ContentSlider>
    </div>
  );
};

export default TopTenRow;
