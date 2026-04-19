// components/wishes/WishesSection.tsx
// Section = RSVP form (left) + scrolling guest wishes (right)
// Data source: wedding_guests table via Neon/Vercel Postgres

'use client'

import RsvpForm from '@/components/RsvpForm'
import { WishesFeed } from './WishesFeed'

export function WishesSection() {
    return (
        <section className="w-full bg-gradient-to-b from-[#FFF5F5] to-white py-24 md:py-32 px-4 relative overflow-hidden" id="wishes">
            {/* Decorative background element */}
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-100/40 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">

                {/* Section heading */}
                <div className="text-center mb-16">
                    <p className="text-xs tracking-[5px] uppercase text-rose-400 mb-4 font-medium">
                        ✦ Guestbook ✦
                    </p>
                    <h2 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-6 tracking-wide">
                        Lời Chúc & Xác Nhận
                    </h2>
                    <p className="text-neutral-500 max-w-lg mx-auto text-sm md:text-base leading-relaxed italic opacity-80">
                        "Những lời chúc tốt đẹp là món quà vô giá nhất trong ngày trọng đại của chúng mình."
                    </p>
                </div>

                {/* 2-column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

                    {/* Left: RSVP form (existing, unchanged) */}
                    <div className="glass p-1 rounded-[40px] shadow-[0_30px_60px_-15px_rgba(255,133,161,0.15)] transition-transform duration-500 hover:scale-[1.01]">
                        <RsvpForm />
                    </div>

                    {/* Right: Live scrolling wishes */}
                    <div className="pt-0 lg:mt-8">
                        <WishesFeed />
                    </div>

                </div>
            </div>
        </section>
    )
}

export default WishesSection
