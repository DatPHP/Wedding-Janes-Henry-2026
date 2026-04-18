// components/wishes/WishesFeed.tsx
// Live feed hiển thị dạng marquee cuộn vô hạn, tự động phát

'use client'

import { useRef, useEffect, useState } from 'react'
import { useWishesFeed } from '@/hooks/useWishesFeed'
import { RELATIONSHIP_LABELS, RELATIONSHIP_COLORS } from '@/types/wishes'
import type { Wish } from '@/types/wishes'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

// ── Avatar helpers ──────────────────────────────────────────────
function getAvatarColor(name: string) {
    const colors = [
        { bg: '#FEE2E2', text: '#991B1B' },
        { bg: '#DBEAFE', text: '#1E40AF' },
        { bg: '#D1FAE5', text: '#065F46' },
        { bg: '#FEF3C7', text: '#92400E' },
        { bg: '#EDE9FE', text: '#5B21B6' },
        { bg: '#FCE7F3', text: '#9D174D' },
        { bg: '#FFEDD5', text: '#9A3412' },
        { bg: '#E0F2FE', text: '#075985' },
    ]
    const idx = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length
    return colors[idx]
}

function getInitials(name: string) {
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function formatTime(iso: string) {
    try {
        return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: vi })
    } catch {
        return ''
    }
}

// ── Single card ─────────────────────────────────────────────────
function WishCard({ wish, isNew = false }: { wish: Wish; isNew?: boolean }) {
    const relColor = RELATIONSHIP_COLORS[wish.relationship]
    const avatar = getAvatarColor(wish.name)
    const initials = getInitials(wish.name)

    return (
        <div
            className={[
                'relative flex gap-3 px-5 py-4 rounded-2xl border',
                'bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm',
                wish.is_pinned
                    ? 'border-amber-200 dark:border-amber-800 shadow-amber-50'
                    : 'border-neutral-100 dark:border-neutral-800',
                'shadow-sm',
                isNew ? 'ring-2 ring-rose-300 ring-offset-1' : '',
            ].join(' ')}
        >
            {/* Pin badge */}
            {wish.is_pinned && (
                <span className="absolute top-2 right-2 text-amber-400 text-[10px]">📌</span>
            )}

            {/* Avatar */}
            <div
                className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-semibold select-none"
                style={{ background: avatar.bg, color: avatar.text }}
            >
                {initials}
            </div>

            {/* Body */}
            <div className="flex-1 min-w-0">
                {/* Meta */}
                <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[13px] font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                        {wish.name}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${relColor.bg} ${relColor.text}`}>
                        {RELATIONSHIP_LABELS[wish.relationship]}
                    </span>
                    {wish.attending ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700">
                            ✓ Tham dự
                        </span>
                    ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-neutral-100 text-neutral-500">
                            Vắng
                        </span>
                    )}
                    <span className="text-[11px] text-neutral-400 ml-auto flex-shrink-0">
                        {formatTime(wish.created_at)}
                    </span>
                </div>

                {/* Message */}
                <p className="text-[13px] text-neutral-600 dark:text-neutral-300 leading-relaxed line-clamp-3">
                    {wish.message}
                </p>

                {/* Hearts */}
                {wish.hearts > 0 && (
                    <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-rose-400">
                        ♥ {wish.hearts}
                    </span>
                )}
            </div>
        </div>
    )
}

// ── Skeleton ────────────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div className="flex gap-3 px-5 py-4 rounded-2xl border border-neutral-100 bg-white/80 dark:bg-neutral-900/80 shadow-sm animate-pulse">
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
    )
}

// ── Main Marquee Feed ───────────────────────────────────────────
export function WishesFeed() {
    const { wishes, totalCount, isLoading, newWishIds } = useWishesFeed()
    const trackRef = useRef<HTMLDivElement>(null)
    const [paused, setPaused] = useState(false)

    // Dynamically set duration based on number of cards (more cards = slower)
    useEffect(() => {
        if (trackRef.current) {
            const duration = Math.max(20, wishes.length * 3)
            trackRef.current.style.setProperty('--marquee-duration', `${duration}s`)
        }
    }, [wishes.length])

    // Duplicate wishes list so the loop is seamless (list + list doubled)
    const doubled = [...wishes, ...wishes]

    return (
        <div className="w-full flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {/* Live dot */}
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Lời chúc trực tiếp
                    </span>
                </div>
                {totalCount > 0 && (
                    <span className="text-xs text-neutral-400">{totalCount} lời chúc</span>
                )}
            </div>

            {/* Marquee container */}
            <div
                className="relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30"
                style={{ height: '480px' }}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                onTouchStart={() => setPaused(true)}
                onTouchEnd={() => setPaused(false)}
            >
                {/* Top fade */}
                <div className="pointer-events-none absolute top-0 left-0 right-0 h-12 z-10 bg-gradient-to-b from-neutral-50 dark:from-neutral-950 to-transparent" />
                {/* Bottom fade */}
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 z-10 bg-gradient-to-t from-neutral-50 dark:from-neutral-950 to-transparent" />

                {isLoading ? (
                    <div className="p-4 space-y-3">
                        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : wishes.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-neutral-400">
                        <div className="text-4xl mb-3">💌</div>
                        <p className="text-sm">Chưa có lời chúc nào. Hãy là người đầu tiên!</p>
                    </div>
                ) : (
                    <div
                        ref={trackRef}
                        className="animate-scroll-up p-4 space-y-3"
                        style={{
                            animationPlayState: paused ? 'paused' : 'running',
                        }}
                    >
                        {doubled.map((wish, idx) => (
                            <WishCard
                                key={`${wish.id}-${idx}`}
                                wish={wish}
                                isNew={newWishIds.has(wish.id) && idx < wishes.length}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Hint */}
            <p className="text-center text-[11px] text-neutral-400">
                Di chuột vào để tạm dừng · Cuộn lặp vô hạn
            </p>
        </div>
    )
}
