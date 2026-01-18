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
        <section className="py-20 bg-rose-50 text-center">
            <h2 className="text-3xl font-serif mb-10">
                Counting Down To Our Big Day
            </h2>

            <div className="flex justify-center gap-6 flex-wrap">
                {Object.entries(timeLeft).map(([label, value]) => (
                    <div
                        key={label}
                        className="w-24 h-24 bg-white rounded-2xl shadow-md flex flex-col items-center justify-center"
                    >
                        <span className="text-3xl font-bold text-rose-600">
                            {value}
                        </span>
                        <span className="text-sm uppercase tracking-wide">
                            {label}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}
