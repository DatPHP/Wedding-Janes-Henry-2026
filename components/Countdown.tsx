"use client";

import { useEffect, useState } from "react";

const WEDDING_DATE = new Date("2026-12-06T00:00:00");

export default function Countdown() {
    const [timeLeft, setTimeLeft] = useState(getTimeLeft());

    function getTimeLeft() {
        const now = new Date().getTime();
        const distance = WEDDING_DATE.getTime() - now;

        if (distance <= 0) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
            };
        }

        return {
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor(
                (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            ),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000),
        };
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(getTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-24 bg-gradient-to-b from-background to-[#FFF5F5] text-center px-4">
            <h2 className="text-3xl md:text-5xl font-serif mb-16 text-black">
                Countdown To Our Big Day
            </h2>

            <div className="flex justify-center gap-4 md:gap-8 flex-wrap max-w-4xl mx-auto">
                {Object.entries(timeLeft).map(([label, value]) => (
                    <div
                        key={label}
                        className="w-24 h-28 md:w-32 md:h-36 bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center border border-accent/10 transition-transform duration-300 hover:-translate-y-2"
                    >
                        <span className="text-4xl md:text-5xl font-serif text-accent mb-2">
                            {value}
                        </span>
                        <span className="text-xs md:text-sm uppercase tracking-widest text-muted font-medium">
                            {label}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}
