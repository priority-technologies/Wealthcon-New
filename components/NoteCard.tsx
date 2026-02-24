
import React from 'react';
import { NoteItem } from '../types';
import { FileText } from 'lucide-react';

interface NoteCardProps {
  note: NoteItem;
  onNoteSelect: (note: NoteItem) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onNoteSelect }) => {
    return (
        <div 
            onClick={() => onNoteSelect(note)}
            className="group relative flex-shrink-0 w-full rounded-lg overflow-hidden shadow-lg cursor-pointer transition-transform duration-300 ease-in-out transform hover:-translate-y-2"
        >
            <div className="relative aspect-video bg-gray-800">
                <img src={note.thumbnailUrl} alt={note.title} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black/50 rounded-full p-3 backdrop-blur-sm">
                        <FileText size={32} className="text-white" />
                    </div>
                </div>
            </div>
            
            <div className="p-4 bg-[#101622]">
                <p className="text-xs text-gray-400 font-semibold uppercase">{note.category}</p>
                <h3 className="text-white font-bold text-lg mt-1 truncate">{note.title}</h3>
            </div>
        </div>
    );
};

export default NoteCard;
