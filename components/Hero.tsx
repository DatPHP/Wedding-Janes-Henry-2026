"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const petals = [
  { id: 1, left: "10%", delay: "0s", duration: "12s", scale: 1 },
  { id: 2, left: "25%", delay: "2s", duration: "14s", scale: 0.8 },
  { id: 3, left: "45%", delay: "4s", duration: "10s", scale: 1.2 },
  { id: 4, left: "65%", delay: "1s", duration: "15s", scale: 0.9 },
  { id: 5, left: "85%", delay: "5s", duration: "13s", scale: 1.1 },
  { id: 6, left: "15%", delay: "6s", duration: "16s", scale: 0.7 },
  { id: 7, left: "75%", delay: "3s", duration: "11s", scale: 1.3 },
  { id: 8, left: "35%", delay: "7s", duration: "14s", scale: 0.85 },
];

const PetalSVG = () => (
  <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="currentColor">
    <path d="M15,0 C10,-2 2,5 5,15 C8,25 15,30 20,25 C25,20 28,10 20,5 C15,0 15,0 15,0 Z" />
  </svg>
);

/* ─── Decorative SVG ornament ─────────────────────────────────────────────── */
function Ornament() {
  return (
    <svg
      viewBox="0 0 200 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-28 md:w-56 mx-auto opacity-60"
      aria-hidden="true"
    >
      <line x1="0" y1="10" x2="70" y2="10" stroke="#C9A96E" strokeWidth="0.8" />
      <circle cx="75" cy="10" r="2.5" fill="#C9A96E" />
      <path
        d="M85 10 Q90 4 95 10 Q100 16 105 10 Q110 4 115 10"
        stroke="#FF85A1"
        strokeWidth="1"
        fill="none"
      />
      <circle cx="125" cy="10" r="2.5" fill="#C9A96E" />
      <line x1="130" y1="10" x2="200" y2="10" stroke="#C9A96E" strokeWidth="0.8" />
    </svg>
  );
}

/* ─── Avatar medallion ─────────────────────────────────────────────────────── */
function AvatarMedallion({
  src,
  name,
  initial,
  side,
}: {
  src: string;
  name: string;
  initial: string;
  side: "left" | "right";
}) {
  return (
    <div
      className={`flex flex-col items-center gap-1 md:gap-3 ${
        side === "left" ? "md:items-end" : "md:items-start"
      }`}
    >
      {/* Layered ring frame */}
      <div className="relative group">
        {/* Outer glow ring (decorative, sits behind the image ring) */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "conic-gradient(from 0deg, #C9A96E 0%, #FF85A1 25%, #FFEBF0 50%, #FF85A1 75%, #C9A96E 100%)",
            padding: "3px",
            borderRadius: "9999px",
          }}
        />
        {/* Golden border ring with photo */}
        <div
          className="relative rounded-full overflow-hidden"
          style={{
            width: "clamp(72px, 14vw, 200px)",
            height: "clamp(72px, 14vw, 200px)",
            border: "2px solid #C9A96E",
            boxShadow:
              "0 0 0 4px #FFEBF0, 0 0 0 6px #C9A96E44, 0 8px 30px rgba(201,169,110,0.22)",
          }}
        >
          <Image
            src={src}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 80px, 200px"
          />
        </div>
        {/* Initial badge */}
        <div
          className="absolute -bottom-1 md:-bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 md:w-9 md:h-9 rounded-full flex items-center justify-center text-white font-serif text-[9px] md:text-lg font-light z-10"
          style={{
            background: "linear-gradient(135deg, #FF85A1 0%, #C9A96E 100%)",
            boxShadow: "0 2px 8px rgba(201,169,110,0.4)",
          }}
        >
          {initial}
        </div>
      </div>

      {/* Name */}
      <p
        className="font-serif text-[9px] md:text-xl mt-2 md:mt-4 tracking-wide"
        style={{ color: "#6B4226" }}
      >
        {name}
      </p>
    </div>
  );
}

/* ─── Hero section ─────────────────────────────────────────────────────────── */
export default function Hero() {
  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center text-center px-2 md:px-6 pt-20 pb-10 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #FFF5F7 0%, #FFFFFF 40%, #FFFBF0 70%, #FFF0F5 100%)",
      }}
    >
      <style>{`
        @keyframes floatPetal {
          0% { transform: translateY(-10vh) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translateY(110vh) translateX(40px) rotate(360deg); opacity: 0; }
        }
        .petal-wrapper {
          position: absolute;
          top: -10%;
          animation: floatPetal linear infinite;
          opacity: 0;
          pointer-events: none;
          z-index: 10;
        }
      `}</style>
      
      {/* ── Petals layer ── */}
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="petal-wrapper w-3 h-3 md:w-5 md:h-5 text-rose-300 drop-shadow-sm"
          style={{
            left: petal.left,
            animationDuration: petal.duration,
            animationDelay: petal.delay,
            transform: `scale(${petal.scale})`,
          }}
        >
          <PetalSVG />
        </div>
      ))}

      {/* Subtle background petal blobs */}
      <div
        className="absolute top-10 left-[-80px] w-72 h-72 rounded-full opacity-[0.07] pointer-events-none"
        style={{ background: "#FF85A1", filter: "blur(60px)" }}
      />
      <div
        className="absolute bottom-20 right-[-60px] w-64 h-64 rounded-full opacity-[0.06] pointer-events-none"
        style={{ background: "#C9A96E", filter: "blur(60px)" }}
      />

      {/* ── "We are getting married" label ── */}
      <p
        className="uppercase tracking-[0.25em] md:tracking-[0.35em] text-[10px] md:text-sm font-medium mb-6 md:mb-8"
        style={{ color: "#C9A96E" }}
      >
        We Are Getting Married
      </p>

      {/* ── Three-column hero: avatar | title | avatar (always 3 cols) ── */}
      <div className="w-full max-w-5xl mx-auto grid grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-10">
        {/* Left — Janes */}
        <div className="flex justify-center md:justify-end">
          <AvatarMedallion
            src="/images/avatar/Janes_avatar.jpg"
            name="Janes"
            initial="J"
            side="left"
          />
        </div>

        {/* Center — text content */}
        <div className="flex flex-col items-center text-center px-1 md:px-6">
          <Ornament />

          <h1
            className="font-serif font-light mt-2 md:mt-4 mb-2 md:mb-3 leading-tight flex justify-center items-center gap-3 md:gap-4 flex-wrap"
            style={{
              fontSize: "clamp(1.6rem, 6vw, 5.5rem)",
              color: "#3B1C2C",
              letterSpacing: "0.02em",
            }}
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="inline-block"
            >
              Janes
            </motion.span>
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="inline-block text-[0.8em]"
            >
              &amp;
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="inline-block"
            >
              Henry
            </motion.span>
          </h1>

          {/* Script quote */}
          <p
            className="font-script leading-snug mb-3 md:mb-4"
            style={{
              fontSize: "clamp(0.9rem, 2.8vw, 2rem)",
              color: "#FF85A1",
              opacity: 0.9,
            }}
          >
            &ldquo;Two souls with but a single thought,
            <br />
            two hearts that beat as one.&rdquo;
          </p>

          <Ornament />

          {/* Date */}
          <p
            className="font-serif italic mt-3 md:mt-5"
            style={{
              fontSize: "clamp(0.75rem, 2vw, 1.35rem)",
              color: "#6B4226",
              opacity: 0.85,
            }}
          >
            December 06, 2026
          </p>
        </div>

        {/* Right — Henry */}
        <div className="flex justify-center md:justify-start">
          <AvatarMedallion
            src="/images/avatar/Henry_avatar.jpg"
            name="Henry"
            initial="H"
            side="right"
          />
        </div>
      </div>

      {/* ── Couple photo below ── */}
      <div className="mt-10 md:mt-14 w-full max-w-md mx-auto mb-6 md:mb-8">
        <div
          className="rounded-[28px] overflow-hidden"
          style={{
            boxShadow:
              "0 4px 6px rgba(201,169,110,0.15), 0 20px 60px rgba(255,133,161,0.22)",
            border: "2px solid rgba(201,169,110,0.25)",
          }}
        >
          <Image
            src="/images/couple-1.jpg"
            alt="Janes &amp; Henry — Together"
            width={800}
            height={1000}
            className="w-full object-cover"
            priority
          />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="animate-bounce mt-2 mb-2" style={{ color: "#FF85A1" }}>
        <svg
          className="w-6 h-6 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
