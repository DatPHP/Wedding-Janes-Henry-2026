// src/components/wishes/WishCard.tsx

'use client'

import { useState, useCallback } from 'react'
import type { Wish } from '@/types/wishes'
import { RELATIONSHIP_LABELS, RELATIONSHIP_COLORS } from '@/types/wishes'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

interface WishCardProps {
    wish: Wish
    isNew?: boolean   // true = show entrance animation
    onHeart: (id: string) => void
}

// Màu avatar từ tên (deterministic)
function getAvatarColor(name: string): { bg: string; text: string } {
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

function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function formatTime(iso: string): string {
    try {
        return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: vi })
    } catch {
        return ''
    }
}

export function WishCard({ wish, isNew = false, onHeart }: WishCardProps) {
    const [hearted, setHearted] = useState(false)
    const [heartAnim, setHeartAnim] = useState(false)

    const relColor = RELATIONSHIP_COLORS[wish.relationship]
    const avatar = getAvatarColor(wish.name)
    const initials = getInitials(wish.name)

    const handleHeart = useCallback(() => {
        if (hearted) return
        setHearted(true)
        setHeartAnim(true)
        onHeart(wish.id)
        setTimeout(() => setHeartAnim(false), 600)
    }, [hearted, onHeart, wish.id])

    return (
        <div
            className={[
                'group relative flex gap-3 px-4 py-4',
                'border-b border-neutral-100 dark:border-neutral-800',
                'transition-colors duration-150',
                'hover:bg-neutral-50 dark:hover:bg-neutral-900/50',
                isNew ? 'animate-wish-enter' : '',
                wish.is_pinned ? 'bg-amber-50/40 dark:bg-amber-950/20' : '',
            ].join(' ')}
        >
            {/* Pin indicator */}
            {wish.is_pinned && (
                <div className="absolute right-3 top-3 flex items-center gap-1 text-amber-500 text-[10px] font-medium">
                    <PinIcon />
                </div>
            )}

            {/* New badge */}
            {isNew && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-rose-400 rounded-r animate-fade-out" />
            )}

            {/* Avatar */}
            <div
                className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-medium select-none"
                style={{ background: avatar.bg, color: avatar.text }}
            >
                {initials}
            </div>

            {/* Body */}
            <div className="flex-1 min-w-0">
                {/* Meta row */}
                <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[13px] font-medium text-neutral-900 dark:text-neutral-100 truncate">
                        {wish.name}
                    </span>

                    <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium
              ${relColor.bg} ${relColor.text}`}
                    >
                        {RELATIONSHIP_LABELS[wish.relationship]}
                    </span>

                    {wish.attending ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700">
                            ✓ Tham dự
                        </span>
                    ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-neutral-100 text-neutral-500">
                            Vắng mặt
                        </span>
                    )}

                    <span className="text-[11px] text-neutral-400 ml-auto flex-shrink-0">
                        {formatTime(wish.created_at)}
                    </span>
                </div>

                {/* Message */}
                <p className="text-[13px] text-neutral-600 dark:text-neutral-300 leading-relaxed break-words">
                    {wish.message}
                </p>

                {/* Heart button */}
                <button
                    onClick={handleHeart}
                    disabled={hearted}
                    className={[
                        'mt-2 flex items-center gap-1.5 text-[12px] transition-all duration-150',
                        hearted
                            ? 'text-rose-500 cursor-default'
                            : 'text-neutral-400 hover:text-rose-400 cursor-pointer',
                        heartAnim ? 'scale-125' : 'scale-100',
                    ].join(' ')}
                    aria-label="Thả tim"
                >
                    <HeartIcon filled={hearted} />
                    <span>{wish.hearts}</span>
                </button>
            </div>
        </div>
    )
}

// ── Icons ──────────────────────────────────────────
function HeartIcon({ filled }: { filled: boolean }) {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
    )
}

function PinIcon() {
    return (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
    )
}
