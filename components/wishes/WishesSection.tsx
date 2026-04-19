// components/wishes/WishesSection.tsx
// Section = RSVP form (left) + scrolling guest wishes (right)
// Data source: wedding_guests table via Neon/Vercel Postgres

'use client'

import RsvpForm from '@/components/RsvpForm'
import { WishesFeed } from './WishesFeed'

export function WishesSection() {
    return (
        <section className="w-full bg-white dark:bg-neutral-950 py-20 px-4" id="wishes">
            <div className="max-w-6xl mx-auto">

                {/* Section heading */}
                <div className="text-center mb-12">
                    <p className="text-xs tracking-[3px] uppercase text-rose-400 mb-3">
                        ✦ RSVP & Lời chúc ✦
                    </p>
                    <h2 className="text-4xl font-serif text-neutral-900 dark:text-neutral-100 mb-4">
                        Xác nhận & Gửi lời chúc
                    </h2>
                    <p className="text-neutral-500 max-w-lg mx-auto text-sm leading-relaxed">
                        Vui lòng xác nhận tham dự và để lại lời chúc đến Janes & Henry.
                    </p>
                </div>

                {/* 2-column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* Left: RSVP form (existing, unchanged) */}
                    <div>
                        <RsvpForm />
                    </div>

                    {/* Right: Live scrolling wishes */}
                    <div className="pt-0 lg:pt-3">
                        <WishesFeed />
                    </div>

                </div>
            </div>
        </section>
    )
}

export default WishesSection
