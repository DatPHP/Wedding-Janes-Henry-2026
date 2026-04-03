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
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-center gap-2">
            <button
                onClick={togglePlay}
                className="relative group flex items-center justify-center"
                aria-label="Toggle background music"
            >
                {/* Vinyl Disc Styling */}
                <motion.div
                    animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                    transition={isPlaying ? { repeat: Infinity, duration: 4, ease: "linear" } : { duration: 0.5 }}
                    className={`w-14 h-14 bg-foreground rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.3)] border-2 border-accent/20 flex items-center justify-center relative overflow-hidden transition-all group-hover:scale-110`}
                >
                    {/* Vinyl grooves effect */}
                    <div className="absolute inset-0 border-[4px] border-white/5 rounded-full" />
                    <div className="absolute inset-2 border-[1px] border-white/5 rounded-full" />
                    <div className="absolute inset-4 border-[1px] border-white/5 rounded-full" />
                    
                    {/* Center Label */}
                    <div className="w-4 h-4 bg-accent rounded-full border-2 border-[#111111] z-10 flex items-center justify-center">
                        <div className="w-1 h-1 bg-white rounded-full" />
                    </div>
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
            
            {/* Minimal label (optional, can be removed for cleaner look) */}
            <span className="text-[10px] uppercase tracking-widest text-muted font-medium bg-white/50 backdrop-blur-sm px-2 py-0.5 rounded-full border border-black/5 opacity-0 group-hover:opacity-100 transition-opacity">
                {isPlaying ? "Playing" : "Music"}
            </span>
        </div>
    );
}
