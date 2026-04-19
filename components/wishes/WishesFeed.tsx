// components/wishes/WishesFeed.tsx
// Auto-scrolling marquee of guest messages from wedding_guests (Neon DB)
// No Supabase — pure fetch from /api/wishes

'use client'

import { useState, useEffect, useCallback } from 'react'

// ── Types matching wedding_guests columns ────────────────────────
interface GuestMessage {
    id: string
    name: string
    relationship: string
    message: string
    attendance: string
    created_at: string
}

// ── Relationship label map ────────────────────────────────────────
const REL_LABELS: Record<string, string> = {
    Family:    'Gia đình',
    Friend:    'Bạn bè',
    Relative:  'Họ hàng',
    Colleague: 'Đồng nghiệp',
    Neighbor:  'Hàng xóm',
}

const REL_COLORS: Record<string, { bg: string; text: string }> = {
    Family:    { bg: 'bg-indigo-100',  text: 'text-indigo-700'  },
    Friend:    { bg: 'bg-rose-100',    text: 'text-rose-700'    },
    Relative:  { bg: 'bg-amber-100',   text: 'text-amber-700'   },
    Colleague: { bg: 'bg-teal-100',    text: 'text-teal-700'    },
    Neighbor:  { bg: 'bg-neutral-100', text: 'text-neutral-600' },
}

function getRelColor(rel: string) {
    return REL_COLORS[rel] ?? { bg: 'bg-neutral-100', text: 'text-neutral-600' }
}

// ── Avatar helpers ───────────────────────────────────────────────
const AVATAR_COLORS = [
    { bg: '#FEE2E2', text: '#991B1B' },
    { bg: '#DBEAFE', text: '#1E40AF' },
    { bg: '#D1FAE5', text: '#065F46' },
    { bg: '#FEF3C7', text: '#92400E' },
    { bg: '#EDE9FE', text: '#5B21B6' },
    { bg: '#FCE7F3', text: '#9D174D' },
    { bg: '#FFEDD5', text: '#9A3412' },
    { bg: '#E0F2FE', text: '#075985' },
]

function getAvatarColor(name: string) {
    const idx = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_COLORS.length
    return AVATAR_COLORS[idx]
}

function getInitials(name: string) {
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// ── Single card ──────────────────────────────────────────────────
function WishCard({ guest }: { guest: GuestMessage }) {
    const avatar = getAvatarColor(guest.name)
    const relColor = getRelColor(guest.relationship)
    const label = REL_LABELS[guest.relationship] ?? guest.relationship
    const attending = guest.attendance === 'attend'

    return (
        <div className="flex gap-3 px-5 py-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
            {/* Avatar */}
            <div
                className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-semibold select-none"
                style={{ background: avatar.bg, color: avatar.text }}
            >
                {getInitials(guest.name)}
            </div>

            {/* Body */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="text-[13px] font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                        {guest.name}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${relColor.bg} ${relColor.text}`}>
                        {label}
                    </span>
                    {attending
                        ? <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">✓ Tham dự</span>
                        : <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 font-medium">Vắng</span>
                    }
                </div>
                <p className="text-[13px] text-neutral-600 dark:text-neutral-300 leading-relaxed line-clamp-3">
                    {guest.message}
                </p>
            </div>
        </div>
    )
}

// ── Skeleton ─────────────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div className="flex gap-3 px-5 py-4 rounded-2xl border border-neutral-100 bg-white shadow-sm animate-pulse">
            <div className="w-9 h-9 rounded-full bg-neutral-200 flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                    <div className="h-3.5 w-24 bg-neutral-200 rounded" />
                    <div className="h-3.5 w-14 bg-neutral-100 rounded-full" />
                </div>
                <div className="h-3 w-full bg-neutral-100 rounded" />
                <div className="h-3 w-3/4 bg-neutral-100 rounded" />
            </div>
        </div>
    )
}

// ── Main component ────────────────────────────────────────────────
export function WishesFeed() {
    const [guests, setGuests] = useState<GuestMessage[]>([])
    const [loading, setLoading] = useState(true)
    const [paused, setPaused] = useState(false)

    const fetchGuests = useCallback(async () => {
        try {
            const res = await fetch('/api/wishes?limit=100')
            if (!res.ok) throw new Error('fetch failed')
            const json = await res.json()
            setGuests((json.data as GuestMessage[]) ?? [])
        } catch (err) {
            console.error('[WishesFeed] fetch error', err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchGuests() }, [fetchGuests])

    const duration = Math.max(20, guests.length * 4)
    const doubled  = [...guests, ...guests]

    return (
        <div className="w-full h-full flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                    </span>
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Lời chúc từ khách mời
                    </span>
                </div>
                {guests.length > 0 && (
                    <span className="text-xs text-neutral-400">{guests.length} lời chúc</span>
                )}
            </div>

            {/* Viewport */}
            <div
                className="relative overflow-hidden flex-1 rounded-2xl border border-neutral-200 dark:border-neutral-800"
                style={{ minHeight: '480px' }}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                onTouchStart={() => setPaused(true)}
                onTouchEnd={() => setPaused(false)}
            >
                {/* Edge fades */}
                <div className="pointer-events-none absolute top-0 inset-x-0 h-14 z-10"
                     style={{ background: 'linear-gradient(to bottom, white, transparent)' }} />
                <div className="pointer-events-none absolute bottom-0 inset-x-0 h-14 z-10"
                     style={{ background: 'linear-gradient(to top, white, transparent)' }} />

                {loading ? (
                    <div className="p-4 space-y-3">
                        {[0,1,2,3].map(i => <SkeletonCard key={i} />)}
                    </div>
                ) : guests.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-neutral-400">
                        <div className="text-4xl mb-3">💌</div>
                        <p className="text-sm">Chưa có lời chúc nào.</p>
                    </div>
                ) : (
                    <div
                        className="p-4 space-y-3 animate-scroll-up"
                        style={{
                            '--marquee-duration': `${duration}s`,
                            animationPlayState: paused ? 'paused' : 'running',
                        } as React.CSSProperties}
                    >
                        {doubled.map((g, idx) => (
                            <WishCard key={`${g.id}-${idx}`} guest={g} />
                        ))}
                    </div>
                )}
            </div>

            <p className="text-center text-[11px] text-neutral-400">
                Di chuột vào để tạm dừng · Cuộn lặp vô hạn
            </p>
        </div>
    )
}
