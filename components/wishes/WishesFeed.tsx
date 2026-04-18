// src/components/wishes/WishesFeed.tsx
// Component chính — Live feed với realtime Supabase

'use client'

import { useRef, useEffect } from 'react'
import { useWishesFeed } from '@/hooks/useWishesFeed'
import { WishCard } from './WishCard'

export function WishesFeed() {
    const {
        wishes,
        totalCount,
        isLoading,
        isLoadingMore,
        hasMore,
        newWishIds,
        loadMore,
        sendHeart,
    } = useWishesFeed()

    // Auto scroll to top khi có wish mới
    const topRef = useRef<HTMLDivElement>(null)
    const prevCountRef = useRef(0)
    useEffect(() => {
        if (totalCount > prevCountRef.current && prevCountRef.current > 0) {
            topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
        prevCountRef.current = totalCount
    }, [totalCount])

    return (
        <section className="w-full max-w-2xl mx-auto px-4 py-16" id="wishes">
            {/* Header */}
            <div className="text-center mb-10">
                <p className="text-xs tracking-[3px] uppercase text-rose-400 mb-2">
                    ✦ Lời chúc ✦
                </p>
                <h2 className="text-3xl font-serif text-neutral-900 dark:text-neutral-100 mb-3">
                    Gửi lời chúc đến chúng tôi
                </h2>
                <p className="text-sm text-neutral-500 max-w-md mx-auto">
                    Lời chúc của bạn sẽ xuất hiện ngay bên dưới và được lưu giữ mãi mãi.
                </p>
            </div>

            {/* Feed container */}
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">

                {/* Feed header */}
                <div className="flex items-center justify-between px-4 py-3
          bg-neutral-50 dark:bg-neutral-900
          border-b border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center gap-2">
                        <LiveDot />
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Lời chúc trực tiếp
                        </span>
                    </div>
                    <span className="text-xs text-neutral-400">
                        {totalCount > 0 ? `${totalCount} lời chúc` : ''}
                    </span>
                </div>

                {/* Scroll anchor (top) */}
                <div ref={topRef} />

                {/* Content */}
                {isLoading ? (
                    <SkeletonList />
                ) : wishes.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div>
                        {wishes.map((wish) => (
                            <WishCard
                                key={wish.id}
                                wish={wish}
                                isNew={newWishIds.has(wish.id)}
                                onHeart={sendHeart}
                            />
                        ))}

                        {/* Load more */}
                        {hasMore && (
                            <div className="px-4 py-3 border-t border-neutral-100 dark:border-neutral-800">
                                <button
                                    onClick={loadMore}
                                    disabled={isLoadingMore}
                                    className="w-full text-sm text-neutral-500 hover:text-neutral-700
                    dark:hover:text-neutral-300 transition-colors py-1
                    disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoadingMore ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Spinner /> Đang tải...
                                        </span>
                                    ) : (
                                        'Xem thêm lời chúc'
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    )
}

// ── Sub-components ─────────────────────────────────────────────

function LiveDot() {
    return (
        <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
    )
}

function SkeletonList() {
    return (
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3 px-4 py-4 animate-pulse">
                    <div className="w-9 h-9 rounded-full bg-neutral-200 dark:bg-neutral-700 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                        <div className="flex gap-2">
                            <div className="h-3.5 w-24 bg-neutral-200 dark:bg-neutral-700 rounded" />
                            <div className="h-3.5 w-14 bg-neutral-100 dark:bg-neutral-800 rounded-full" />
                        </div>
                        <div className="h-3 w-full bg-neutral-100 dark:bg-neutral-800 rounded" />
                        <div className="h-3 w-3/4 bg-neutral-100 dark:bg-neutral-800 rounded" />
                    </div>
                </div>
            ))}
        </div>
    )
}

function EmptyState() {
    return (
        <div className="py-16 text-center text-neutral-400">
            <div className="text-3xl mb-3">💌</div>
            <p className="text-sm">Chưa có lời chúc nào. Hãy là người đầu tiên!</p>
        </div>
    )
}

function Spinner() {
    return (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    )
}
