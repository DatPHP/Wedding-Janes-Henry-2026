"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Music } from "lucide-react";

export default function BackgroundMusic() {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // We use a beautiful but safe copyright-free or placeholder link for the demo
        audioRef.current = new Audio("https://cdn.pixabay.com/download/audio/2022/02/07/audio_104e1374a4.mp3?filename=piano-moment-9835.mp3");
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
            // Attempt to play
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => console.log("Audio play failed:", error));
            }
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <button
            onClick={togglePlay}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-accent/20 flex flex-col items-center justify-center text-accent hover:scale-110 hover:bg-white transition-all group"
            aria-label="Toggle background music"
        >
            <div className="absolute -top-1 -right-1">
                <Music size={14} className={`text-accent opacity-50 ${isPlaying ? 'animate-bounce' : ''}`} />
            </div>
            {isPlaying ? (
                <Pause size={20} className="fill-accent" />
            ) : (
                <Play size={20} className="fill-accent ml-1" />
            )}
        </button>
    );
}
