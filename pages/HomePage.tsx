import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ContentRow from '../components/ContentRow';
import { categories, featuredContent } from '../data/mockData';
import { ContentItem, Page, Category } from '../types';

interface HomePageProps {
    onLogout: () => void;
    onVideoSelect: (video: ContentItem) => void;
    onNavigate: (page: Page) => void;
    onCategorySelect: (category: Category) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onLogout, onVideoSelect, onNavigate, onCategorySelect }) => {
  return (
    <div className="bg-[#050a14] min-h-screen text-white">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentPage="home" />
      <main>
        <Hero item={featuredContent} onVideoSelect={onVideoSelect} />
        <div className="-mt-24 relative z-20">
            {categories.map(category => (
                <ContentRow key={category.id} category={category} onVideoSelect={onVideoSelect} onSeeAll={onCategorySelect} />
            ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage;