"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart, Gift, MapPin, CalendarCheck, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";

const menuItems = [
  { id: "wishes", label: "Lời Chúc", icon: Heart, href: "#wishes", color: "text-rose-500" },
  { id: "event", label: "Sự Kiện", icon: MapPin, href: "#event", color: "text-blue-500" },
  { id: "gift", label: "Mừng Cưới", icon: Gift, href: "#gift", color: "text-amber-500" },
  { id: "rsvp", label: "Xác Nhận", icon: CalendarCheck, href: "#wishes", color: "text-emerald-500" },
];

export default function FloatingActionMenu() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-[90] flex flex-col gap-4 pointer-events-none">
      <AnimatePresence>
        {isVisible && (
          <div className="flex flex-col gap-3 pointer-events-auto">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 50, opacity: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
                className="relative flex items-center justify-end group"
              >
                {/* Tooltip Label */}
                <AnimatePresence>
                  {(hoveredId === item.id) && (
                    <motion.span
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="absolute right-14 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium shadow-lg border border-accent/10 text-neutral-800 whitespace-nowrap shadow-rose-200/20"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Icon Button */}
                <button
                  onClick={() => scrollTo(item.href)}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`w-11 h-11 md:w-12 md:h-12 rounded-full glass flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group-hover:shadow-[0_8px_20px_-4px_rgba(255,133,161,0.3)] group-hover:border-accent/40 ${item.color}`}
                  aria-label={item.label}
                >
                  <item.icon size={20} className="md:w-6 md:h-6" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
