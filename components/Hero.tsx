import Image from "next/image";

/* ─── Decorative SVG ornament ─────────────────────────────────────────────── */
function Ornament() {
  return (
    <svg
      viewBox="0 0 200 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-40 md:w-56 mx-auto opacity-60"
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
      className={`flex flex-col items-center gap-3 ${
        side === "left" ? "md:items-end" : "md:items-start"
      }`}
    >
      {/* Layered ring frame */}
      <div className="relative group">
        {/* Outer glow ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, #C9A96E 0%, #FF85A1 25%, #FFEBF0 50%, #FF85A1 75%, #C9A96E 100%)",
            padding: "3px",
            borderRadius: "9999px",
          }}
        />
        {/* Golden border ring */}
        <div
          className="relative rounded-full overflow-hidden"
          style={{
            width: "clamp(140px, 18vw, 200px)",
            height: "clamp(140px, 18vw, 200px)",
            border: "3px solid #C9A96E",
            boxShadow:
              "0 0 0 5px #FFEBF0, 0 0 0 7px #C9A96E44, 0 12px 40px rgba(201,169,110,0.25)",
          }}
        >
          <Image
            src={src}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 140px, 200px"
          />
        </div>
        {/* Initial badge */}
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full flex items-center justify-center text-white font-serif text-lg font-light z-10"
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
        className="font-serif text-lg md:text-xl mt-4 tracking-wide"
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
      className="min-h-screen flex flex-col items-center justify-center text-center px-4 md:px-6 pt-20 pb-10 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #FFF5F7 0%, #FFFFFF 40%, #FFFBF0 70%, #FFF0F5 100%)",
      }}
    >
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
        className="uppercase tracking-[0.35em] text-xs md:text-sm font-medium mb-8"
        style={{ color: "#C9A96E", letterSpacing: "0.35em" }}
      >
        We Are Getting Married
      </p>

      {/* ── Three-column hero: avatar | title | avatar ── */}
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-6 md:gap-10">
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
        <div className="flex flex-col items-center text-center px-2 md:px-6">
          <Ornament />

          <h1
            className="font-serif font-light mt-4 mb-3 leading-tight"
            style={{
              fontSize: "clamp(2.6rem, 6vw, 5.5rem)",
              color: "#3B1C2C",
              letterSpacing: "0.02em",
            }}
          >
            Janes &amp; Henry
          </h1>

          {/* Script quote */}
          <p
            className="font-script leading-snug mb-4"
            style={{
              fontSize: "clamp(1.3rem, 2.8vw, 2rem)",
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
            className="font-serif italic mt-5"
            style={{ fontSize: "clamp(1rem, 2vw, 1.35rem)", color: "#6B4226", opacity: 0.85 }}
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
      <div className="mt-14 w-full max-w-md mx-auto mb-8">
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
      <div className="animate-bounce mt-4 mb-2" style={{ color: "#FF85A1" }}>
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
