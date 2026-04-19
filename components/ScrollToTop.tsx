"use client";

import { useState, useEffect } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Cuộn lên đầu trang"
      className={`fixed bottom-8 right-6 z-50 group flex flex-col items-center gap-1 transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-8 pointer-events-none"
      }`}
    >
      {/* Main circle button */}
      <div className="relative w-14 h-14 rounded-full bg-white shadow-[0_6px_24px_rgba(255,133,161,0.35)] border border-accent/20 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:shadow-[0_8px_32px_rgba(255,133,161,0.55)] group-hover:scale-110 group-hover:border-accent/50">
        {/* Pink fill animation on hover */}
        <div className="absolute inset-0 bg-accent scale-0 group-hover:scale-100 rounded-full transition-transform duration-300 origin-bottom" />
        {/* Arrow icon */}
        <svg
          className="relative w-6 h-6 text-accent group-hover:text-white transition-colors duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </div>

      {/* Label */}
      <span className="text-[11px] font-medium tracking-wide text-accent/70 group-hover:text-accent transition-colors duration-200 whitespace-nowrap">
        Lên Đầu Trang
      </span>
    </button>
  );
}
