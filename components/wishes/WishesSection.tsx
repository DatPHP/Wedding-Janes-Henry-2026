// src/components/wishes/WishesSection.tsx
// Section hoàn chỉnh = Form (trái/trên) + Live Feed (phải/dưới)
// Đặt vào page.tsx: <WishesSection />

'use client'

import { useState } from 'react'
import { WishForm } from './WishForm'
import { WishesFeed } from './WishesFeed'

export function WishesSection() {
    const [formKey, setFormKey] = useState(0)  // reset form sau submit

    return (
        <section className="w-full bg-white dark:bg-neutral-950 py-20 px-4" id="wishes">
            <div className="max-w-6xl mx-auto">

                {/* Section heading */}
                <div className="text-center mb-12">
                    <p className="text-xs tracking-[3px] uppercase text-rose-400 mb-3">
                        ✦ Gửi lời chúc ✦
                    </p>
                    <h2 className="text-4xl font-serif text-neutral-900 dark:text-neutral-100 mb-4">
                        Chúng tôi trân trọng sự hiện diện của bạn
                    </h2>
                    <p className="text-neutral-500 max-w-lg mx-auto text-sm leading-relaxed">
                        Điền thông tin xác nhận tham dự và để lại lời chúc. Lời chúc của bạn sẽ
                        xuất hiện ngay lập tức trên trang này.
                    </p>
                </div>

                {/* 2-column layout on desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* Left: Form */}
                    <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-6 border
            border-neutral-100 dark:border-neutral-800">
                        <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-6">
                            Xác nhận tham dự & Gửi lời chúc
                        </h3>
                        <WishForm
                            key={formKey}
                            onSuccess={() => {
                                // Reset form sau 3 giây để có thể submit lại
                                setTimeout(() => setFormKey((k) => k + 1), 3000)
                            }}
                        />
                    </div>

                    {/* Right: Feed */}
                    <div>
                        <WishesFeed />
                    </div>

                </div>
            </div>
        </section>
    )
}

export default WishesSection
