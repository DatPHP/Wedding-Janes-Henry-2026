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
                "Ngày": 0,
                "Giờ": 0,
                "Phút": 0,
                "Giây": 0,
            };
        }

        return {
            "Ngày": Math.floor(distance / (1000 * 60 * 60 * 24)),
            "Giờ": Math.floor(
                (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            ),
            "Phút": Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            "Giây": Math.floor((distance % (1000 * 60)) / 1000),
        };
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(getTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-24 md:py-32 bg-gradient-to-b from-background via-[#FFF9FA] to-[#FFF5F5] text-center px-4 relative overflow-hidden">
            {/* Background decorative blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-100/30 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10">
                <p className="text-xs tracking-[4px] uppercase text-rose-400 mb-4 font-medium">
                    Save The Date
                </p>
                <h2 className="text-4xl md:text-5xl font-serif mb-16 text-black tracking-wide">
                    Đếm Ngược Tới Ngày Trọng Đại
                </h2>

                <div className="flex justify-center gap-3 md:gap-8 flex-wrap max-w-4xl mx-auto">
                    {Object.entries(timeLeft).map(([label, value]) => (
                        <div
                            key={label}
                            className="w-22 h-26 md:w-36 md:h-40 glass rounded-[32px] md:rounded-[40px] shadow-[0_20px_50px_rgba(255,133,161,0.08)] flex flex-col items-center justify-center transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_30px_60px_rgba(255,133,161,0.15)] group"
                        >
                            <span className="text-4xl md:text-6xl font-serif text-accent mb-1 md:mb-2 transition-transform duration-500 group-hover:scale-110">
                                {value}
                            </span>
                            <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-neutral-400 font-semibold">
                                {label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
