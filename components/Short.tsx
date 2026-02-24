
import React, { useState, useRef, useEffect } from 'react';
import { ShortItem, Educator } from '../types';
import { educators } from '../data/mockData';
import { Heart, MessageCircle, Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface ShortProps {
    short: ShortItem;
    onToggleComments: () => void;
}

const Short: React.FC<ShortProps> = ({ short, onToggleComments }) => {
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(short.likes);

    const videoRef = useRef<HTMLVideoElement>(null);
    const educator = educators.find(e => e.id === short.educatorId);

    const handleVideoPress = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                videoRef.current.play();
                setIsPlaying(true);
            }
        }
    };
    
    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikes(prev => isLiked ? prev - 1 : prev + 1);
    }
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    videoRef.current?.play();
                    setIsPlaying(true);
                } else {
                    videoRef.current?.pause();
                    setIsPlaying(false);
                }
            },
            { threshold: 0.5 }
        );

        const currentVideoRef = videoRef.current;
        if (currentVideoRef) {
            observer.observe(currentVideoRef);
        }

        return () => {
            if (currentVideoRef) {
                observer.unobserve(currentVideoRef);
            }
        };
    }, []);


    return (
        <div className="relative h-full w-full max-w-[420px] bg-black rounded-xl overflow-hidden">
            <video
                ref={videoRef}
                onClick={handleVideoPress}
                className="w-full h-full object-cover"
                loop
                playsInline
                autoPlay
                muted={isMuted}
                src={short.videoUrl}
                poster={short.posterUrl}
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>

            <div className="absolute top-4 right-4 text-white z-10">
                 <button onClick={() => setIsMuted(!isMuted)} className="p-2 bg-black/40 rounded-full">
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <div className="flex items-end">
                     <div className="flex-grow">
                        <div className="flex items-center space-x-2">
                           <img src={educator?.avatarUrl} alt={educator?.name} className="w-10 h-10 rounded-full border-2 border-white" />
                           <h3 className="font-bold text-lg drop-shadow-lg">{educator?.name}</h3>
                        </div>
                        <p className="mt-2 text-sm line-clamp-2 drop-shadow-lg">{short.description}</p>
                    </div>
                    <div className="flex flex-col items-center space-y-5 pl-4">
                        <div className="flex flex-col items-center">
                            <button onClick={handleLike} className="p-2">
                                <Heart size={32} fill={isLiked ? '#ef4444' : 'none'} className={isLiked ? 'text-red-500' : 'text-white'} />
                            </button>
                            <span className="text-sm font-semibold drop-shadow-lg">{likes.toLocaleString()}</span>
                        </div>
                        <button onClick={onToggleComments} className="flex flex-col items-center">
                            <MessageCircle size={32} />
                            <span className="text-sm font-semibold drop-shadow-lg">{short.commentsCount}</span>
                        </button>
                    </div>
                </div>
            </div>
            
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                    <Play size={80} className="text-white/70 drop-shadow-xl" />
                </div>
            )}
        </div>
    );
};

export default Short;