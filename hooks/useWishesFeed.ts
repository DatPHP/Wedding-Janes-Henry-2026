// src/hooks/useWishesFeed.ts
// Hook quản lý realtime feed + pagination + hearts

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { getSupabaseClient } from '@/lib/supabase'
import type { Wish } from '@/types/wishes'

const PAGE_SIZE = 15

interface UseWishesFeedReturn {
    wishes: Wish[]
    totalCount: number
    isLoading: boolean
    isLoadingMore: boolean
    hasMore: boolean
    newWishIds: Set<string>  // IDs của wish vừa arrive (để animate)
    loadMore: () => Promise<void>
    sendHeart: (id: string) => Promise<void>
}

export function useWishesFeed(): UseWishesFeedReturn {
    const [wishes, setWishes] = useState<Wish[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [page, setPage] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [newWishIds, setNewWishIds] = useState<Set<string>>(new Set())

    // Track hearts đã bấm (localStorage để persist trong session)
    const heartedRef = useRef<Set<string>>(new Set())

    // ──────────────────────────────────────────────
    // Initial fetch
    // ──────────────────────────────────────────────
    const fetchWishes = useCallback(async (pageNum = 1) => {
        try {
            const res = await fetch(`/api/wishes?page=${pageNum}&limit=${PAGE_SIZE}`)
            if (!res.ok) throw new Error('fetch failed')
            const json = await res.json()
            return json as { data: Wish[]; count: number }
        } catch (err) {
            console.error('[useWishesFeed] fetch error', err)
            return null
        }
    }, [])

    useEffect(() => {
        setIsLoading(true)
        fetchWishes(1).then((result) => {
            if (result) {
                setWishes(result.data)
                setTotalCount(result.count ?? 0)
            }
            setIsLoading(false)
        })
    }, [fetchWishes])

    // ──────────────────────────────────────────────
    // Load more (pagination)
    // ──────────────────────────────────────────────
    const loadMore = useCallback(async () => {
        if (isLoadingMore) return
        setIsLoadingMore(true)
        const nextPage = page + 1
        const result = await fetchWishes(nextPage)
        if (result) {
            setWishes((prev) => {
                // Dedupe bằng id
                const existingIds = new Set(prev.map((w) => w.id))
                const fresh = result.data.filter((w) => !existingIds.has(w.id))
                return [...prev, ...fresh]
            })
            setPage(nextPage)
        }
        setIsLoadingMore(false)
    }, [page, isLoadingMore, fetchWishes])

    // ──────────────────────────────────────────────
    // Supabase Realtime subscription
    // ──────────────────────────────────────────────
    useEffect(() => {
        const supabase = getSupabaseClient()

        const channel = supabase
            .channel('wishes-live')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'wishes',
                    filter: 'is_approved=eq.true',
                },
                (payload) => {
                    const newWish = payload.new as Wish
                    setWishes((prev) => {
                        // Không thêm nếu đã có (idempotent)
                        if (prev.find((w) => w.id === newWish.id)) return prev
                        // Pinned wishes vẫn ở trên
                        const pinned = prev.filter((w) => w.is_pinned)
                        const unpinned = prev.filter((w) => !w.is_pinned)
                        return [...pinned, newWish, ...unpinned]
                    })
                    setTotalCount((c) => c + 1)

                    // Đánh dấu "mới" trong 4 giây để animate
                    setNewWishIds((s) => new Set([...s, newWish.id]))
                    setTimeout(() => {
                        setNewWishIds((s) => {
                            const next = new Set(s)
                            next.delete(newWish.id)
                            return next
                        })
                    }, 4000)
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'wishes',
                },
                (payload) => {
                    const updated = payload.new as Wish
                    setWishes((prev) =>
                        prev.map((w) => (w.id === updated.id ? updated : w))
                    )
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'wishes',
                },
                (payload) => {
                    const deleted = payload.old as { id: string }
                    setWishes((prev) => prev.filter((w) => w.id !== deleted.id))
                    setTotalCount((c) => Math.max(0, c - 1))
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    // ──────────────────────────────────────────────
    // Heart (optimistic update)
    // ──────────────────────────────────────────────
    const sendHeart = useCallback(async (id: string) => {
        // 1 lần bấm / wish / session
        if (heartedRef.current.has(id)) return
        heartedRef.current.add(id)

        // Optimistic: tăng ngay trên UI
        setWishes((prev) =>
            prev.map((w) => (w.id === id ? { ...w, hearts: w.hearts + 1 } : w))
        )

        try {
            const res = await fetch(`/api/wishes/${id}/heart`, { method: 'POST' })
            if (!res.ok) throw new Error('heart failed')
        } catch {
            // Rollback nếu lỗi
            heartedRef.current.delete(id)
            setWishes((prev) =>
                prev.map((w) => (w.id === id ? { ...w, hearts: w.hearts - 1 } : w))
            )
        }
    }, [])

    const hasMore = wishes.filter((w) => !w.is_pinned).length < totalCount

    return {
        wishes,
        totalCount,
        isLoading,
        isLoadingMore,
        hasMore,
        newWishIds,
        loadMore,
        sendHeart,
    }
}