"use client";

import { useState, useRef, useEffect } from "react";
import { Music, Disc } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BackgroundMusic() {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Updated to leduong.mp3 as requested
        audioRef.current = new Audio("/musics/leduong.mp3");
        audioRef.current.loop = true;
        audioRef.current.volume = 0.5;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => console.log("Audio play failed:", error));
            }
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="fixed bottom-8 left-6 z-[100] flex flex-col items-center gap-2">
            <button
                onClick={togglePlay}
                className="relative group flex items-center justify-center"
                aria-label="Toggle background music"
            >
                {/* Vinyl Disc / Player Button Styling */}
                <motion.div
                    animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                    transition={isPlaying ? { repeat: Infinity, duration: 4, ease: "linear" } : { duration: 0.5 }}
                    className={`w-12 h-12 md:w-14 md:h-14 bg-white/80 backdrop-blur-md rounded-full shadow-[0_10px_30px_rgba(255,133,161,0.25)] border border-white/40 flex items-center justify-center relative overflow-hidden transition-all group-hover:shadow-[0_15px_40px_rgba(255,133,161,0.4)] group-hover:scale-110 text-accent group-active:scale-95`}
                >
                    {/* Play/Pause Icon instead of just grooves */}
                    <div className="z-10 flex items-center justify-center">
                        {isPlaying ? (
                            <Music size={20} className="md:w-6 md:h-6 animate-pulse" />
                        ) : (
                            <Disc size={22} className="md:w-7 md:h-7 text-accent/80" />
                        )}
                    </div>
                    {/* Inner gold ring */}
                    <div className="absolute inset-[3px] border border-accent/10 rounded-full" />
                </motion.div>

                {/* Floating Note indicator when playing */}
                <AnimatePresence>
                    {isPlaying && (
                        <motion.div 
                            initial={{ y: 0, opacity: 0 }}
                            animate={{ y: -20, opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                            className="absolute -top-4 right-0 pointer-events-none"
                        >
                            <Music size={14} className="text-accent" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </button>
            
            <span className="text-[11px] uppercase tracking-wide text-accent/70 group-hover:text-accent font-medium bg-white/50 backdrop-blur-sm px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                {isPlaying ? "Đang Phát" : "Phát Nhạc"}
            </span>
        </div>
    );
}
