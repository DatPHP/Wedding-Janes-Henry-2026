"use client";

import { useState, useEffect } from "react";

const navLinks = [
  { label: "Greeting", href: "#greeting" },
  { label: "Countdown", href: "#countdown" },
  { label: "Memories", href: "#memories" },
  { label: "Our Love Journey", href: "#story" },
  { label: "Send Your Wishes", href: "#wishes" },
  { label: "Wedding Event", href: "#event" },
  { label: "Gift", href: "#gift" },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Highlight active section
      const sectionIds = navLinks.map((l) => l.href.replace("#", ""));
      let current = "";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 80) current = id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-[0_2px_20px_rgba(255,133,161,0.12)] border-b border-accent/10"
            : "bg-transparent"
        }`}
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-[60px]">
          {/* Brand */}
          <a
            href="#greeting"
            onClick={(e) => scrollTo(e, "#greeting")}
            className="font-script text-2xl text-accent leading-none select-none"
            aria-label="Back to top"
          >
            J & H
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => scrollTo(e, link.href)}
                    className={`relative px-3 py-2 text-sm font-medium rounded-full transition-all duration-200 group
                      ${isActive
                        ? "text-accent bg-accent/8"
                        : "text-black/70 hover:text-accent hover:bg-accent/5"
                      }`}
                  >
                    {link.label}
                    <span
                      className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] bg-accent rounded-full transition-all duration-300
                        ${isActive ? "w-4" : "w-0 group-hover:w-4"}`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-[5px] justify-center items-center w-10 h-10 rounded-full hover:bg-accent/10 transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span
              className={`block w-5 h-[1.5px] bg-accent rounded-full transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[6.5px]" : ""}`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-accent rounded-full transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-accent rounded-full transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`}
            />
          </button>
        </div>

        {/* Mobile dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-400 ease-in-out ${
            menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="bg-white/95 backdrop-blur-md border-t border-accent/10 px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => scrollTo(e, link.href)}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                      ${isActive
                        ? "text-accent bg-accent/8 font-semibold"
                        : "text-black/70 hover:text-accent hover:bg-accent/5"
                      }`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </>
  );
}
