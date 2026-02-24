
import React, { useState } from 'react';
import { NoteItem } from '../types';
import { ArrowLeft, Bookmark } from 'lucide-react';

interface NoteDetailPageProps {
  note: NoteItem;
  onBack: () => void;
}

const NoteDetailPage: React.FC<NoteDetailPageProps> = ({ note, onBack }) => {
  const [isSaved, setIsSaved] = useState(note.isSaved);

  const handleOpenDocument = () => {
    alert("This would open the document viewer for: " + note.documentUrl);
  };

  return (
    <div className="bg-[#050a14] min-h-screen text-white animate-fade-in">
       <div className="absolute top-0 left-0 right-0 z-10 p-4">
        <button onClick={onBack} className="flex items-center text-gray-200 hover:text-white bg-black/30 backdrop-blur-sm p-2 rounded-full transition-colors">
          <ArrowLeft size={20} />
          <span className="ml-2 hidden md:inline">Back to Notes</span>
        </button>
       </div>
      
      <div className="container mx-auto px-4 md:px-12 pt-20 pb-8">
        <div className="max-w-4xl mx-auto">
            {/* Clickable Thumbnail */}
            <div 
                className="group relative aspect-video w-full bg-black rounded-lg overflow-hidden shadow-2xl cursor-pointer mb-8"
                onClick={handleOpenDocument}
            >
                <img src={note.thumbnailUrl} alt={note.title} className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/60 flex items-center justify-center">
                    <span className="bg-black/50 text-white font-bold py-3 px-6 rounded-lg backdrop-blur-sm border border-white/20">
                        Click to Open Document
                    </span>
                </div>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <h1 className="text-3xl md:text-5xl font-black">{note.title}</h1>
                <button 
                    onClick={() => setIsSaved(!isSaved)}
                    className={`flex items-center shrink-0 ${isSaved ? 'bg-cyan-500 text-black' : 'bg-white/10 text-white'} hover:bg-white/20 px-4 py-2 rounded-lg transition-colors`}
                >
                    <Bookmark size={20} className="mr-2" fill={isSaved ? 'currentColor' : 'none'} /> 
                    {isSaved ? 'Saved' : 'Save'}
                </button>
            </div>

            {/* Divider */}
            <hr className="border-t-2 border-gray-800 my-6" />

            {/* Description */}
            <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
                <p dangerouslySetInnerHTML={{ __html: note.description }} />
            </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        .prose a {
            color: #22d3ee;
        }
        .prose a:hover {
            text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default NoteDetailPage;
