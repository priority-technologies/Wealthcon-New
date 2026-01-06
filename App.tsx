import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import VideoDetailPage from './pages/VideoDetailPage';
import VideosPage from './pages/VideosPage';
import ShortsPage from './pages/ShortsPage';
import NotesPage from './pages/NotesPage';
import NoteDetailPage from './pages/NoteDetailPage';
import ChartsPage from './pages/ChartsPage';
import ChartDetailPage from './pages/ChartDetailPage';
import DrRamsMessagesPage from './pages/DrRamsMessagesPage';
import AdminsUpdatePage from './pages/AdminsUpdatePage';
import MyListPage from './pages/MyListPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import CategoryPage from './pages/CategoryPage';
import FAQPage from './pages/FAQPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import HelpCenterPage from './pages/HelpCenterPage';
import Footer from './components/Footer';
import EducatorRegistrationModal from './components/EducatorRegistrationModal';
import { ContentItem, NoteItem, ChartItem, Page, Category } from './types';
import { contentData } from './data/mockData';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<ContentItem | null>(null);
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null);
  const [selectedChart, setSelectedChart] = useState<ChartItem | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };
  
  const handleLogout = () => {
    setSelectedVideo(null);
    setSelectedNote(null);
    setSelectedChart(null);
    setSelectedCategory(null);
    setCurrentPage('home');
    setIsLoggedIn(false);
  }

  const handleVideoSelect = (video: ContentItem) => {
    setSelectedVideo(video);
    setSelectedNote(null);
    setSelectedChart(null);
    setSelectedCategory(null);
  }

  const handleNoteSelect = (note: NoteItem) => {
    setSelectedNote(note);
    setSelectedVideo(null);
    setSelectedChart(null);
    setSelectedCategory(null);
  }
  
  const handleChartSelect = (chart: ChartItem) => {
    setSelectedChart(chart);
    setSelectedVideo(null);
    setSelectedNote(null);
    setSelectedCategory(null);
  }

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setSelectedVideo(null);
    setSelectedNote(null);
    setSelectedChart(null);
  }
  
  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    setSelectedVideo(null);
    setSelectedNote(null);
    setSelectedChart(null);
    setSelectedCategory(null);
    window.scrollTo(0, 0);
  }

  const handleBackToLibrary = () => {
    setSelectedVideo(null);
    setSelectedNote(null);
    setSelectedChart(null);
    setSelectedCategory(null);
  }

  const handleOpenRegistrationModal = () => setIsRegistrationModalOpen(true);
  const handleCloseRegistrationModal = () => setIsRegistrationModalOpen(false);
  
  const renderContent = () => {
    if (selectedVideo) {
      const relatedContent = contentData.filter(v => v.id !== selectedVideo.id);
      return <VideoDetailPage video={selectedVideo} relatedContent={relatedContent} onBack={handleBackToLibrary} onVideoSelect={handleVideoSelect} />
    }
    
    if (selectedNote) {
      return <NoteDetailPage note={selectedNote} onBack={handleBackToLibrary} />;
    }
    
    if (selectedChart) {
      return <ChartDetailPage chart={selectedChart} onBack={handleBackToLibrary} />;
    }
    
    if (selectedCategory) {
        return <CategoryPage category={selectedCategory} onBack={handleBackToLibrary} onVideoSelect={handleVideoSelect} onLogout={handleLogout} onNavigate={handleNavigate} />;
    }

    let pageComponent;
    switch(currentPage) {
        case 'home':
            pageComponent = <HomePage onLogout={handleLogout} onVideoSelect={handleVideoSelect} onNavigate={handleNavigate} onCategorySelect={handleCategorySelect} />; break;
        case 'videos':
            pageComponent = <VideosPage onLogout={handleLogout} onVideoSelect={handleVideoSelect} onNavigate={handleNavigate} />; break;
        case 'shorts':
            pageComponent = <ShortsPage onLogout={handleLogout} onNavigate={handleNavigate} />; break;
        case 'notes':
            pageComponent = <NotesPage onLogout={handleLogout} onNoteSelect={handleNoteSelect} onNavigate={handleNavigate} />; break;
        case 'charts':
            pageComponent = <ChartsPage onLogout={handleLogout} onChartSelect={handleChartSelect} onNavigate={handleNavigate} />; break;
        case 'dr-ram':
            pageComponent = <DrRamsMessagesPage onLogout={handleLogout} onNavigate={handleNavigate} />; break;
        case 'admin-update':
            pageComponent = <AdminsUpdatePage onLogout={handleLogout} onNavigate={handleNavigate} />; break;
        case 'my-list':
            pageComponent = <MyListPage onLogout={handleLogout} onNoteSelect={handleNoteSelect} onNavigate={handleNavigate} />; break;
        case 'profile':
            pageComponent = <ProfilePage onLogout={handleLogout} onNavigate={handleNavigate} />; break;
        case 'settings':
            pageComponent = <SettingsPage onLogout={handleLogout} onNavigate={handleNavigate} />; break;
        case 'faq':
            pageComponent = <FAQPage onLogout={handleLogout} onNavigate={handleNavigate} />; break;
        case 'privacy':
            pageComponent = <PrivacyPolicyPage onLogout={handleLogout} onNavigate={handleNavigate} />; break;
        case 'terms':
            pageComponent = <TermsPage onLogout={handleLogout} onNavigate={handleNavigate} />; break;
        case 'help':
            pageComponent = <HelpCenterPage onLogout={handleLogout} onNavigate={handleNavigate} />; break;
        default:
            pageComponent = <HomePage onLogout={handleLogout} onVideoSelect={handleVideoSelect} onNavigate={handleNavigate} onCategorySelect={handleCategorySelect} />;
    }

    // Shorts page is full-screen and immersive, so no footer.
    if (currentPage === 'shorts') {
        return pageComponent;
    }

    return (
        <>
            {pageComponent}
            <Footer onNavigate={handleNavigate} onOpenRegistrationModal={handleOpenRegistrationModal} />
        </>
    );
  }

  return (
    <>
      {isLoggedIn ? renderContent() : <LoginPage onLoginSuccess={handleLoginSuccess} />}
      {isRegistrationModalOpen && <EducatorRegistrationModal onClose={handleCloseRegistrationModal} />}
    </>
  );
};

export default App;