'use client';

import React, { useEffect, useState } from 'react';
import Hero from '@/components/UserContent/Hero';
import ContentRow from '@/components/UserContent/ContentRow';

function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/videos/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

  if (error) {
    return (
      <div className="min-h-screen bg-wc-dark flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl font-bold">Error loading content</p>
          <p className="text-gray-400 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-wc-dark min-h-screen text-white">
      <main>
        {data?.featured && <Hero item={data.featured} />}
        <div className="-mt-24 relative z-20">
          {data?.categories?.map((category) => (
            <ContentRow
              key={category.id}
              title={category.title}
              items={category.videos}
              seeAllLink={`/videos?category=${category.id}`}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Home;
