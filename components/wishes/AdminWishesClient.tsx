// components/wishes/AdminWishesClient.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Wish } from '@/types/wishes'
import { RELATIONSHIP_LABELS } from '@/types/wishes'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Loader2, RefreshCw } from 'lucide-react'
import { toast } from 'react-toastify'

interface Props {
    /** Optional: pass pre-fetched list (SSR). If omitted, fetches itself. */
    initialWishes?: Wish[]
}

export function AdminWishesClient({ initialWishes }: Props) {
    const [wishes, setWishes] = useState<Wish[]>(initialWishes ?? [])
    const [loading, setLoading] = useState(!initialWishes)
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    // Self-fetch if no initialWishes given (client-side usage)
    const fetchWishes = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/wishes')
            if (!res.ok) throw new Error('Fetch failed')
            const json = await res.json()
            setWishes(json.data ?? [])
        } catch {
            toast.error('Không thể tải danh sách lời chúc')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (!initialWishes) fetchWishes()
    }, [initialWishes, fetchWishes])

    async function handleToggle(id: string, updates: Partial<Wish>) {
        setActionLoading(id)
        try {
            const res = await fetch(`/api/admin/wishes/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error ?? 'API failed')
            setWishes(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w))
            toast.success('Đã cập nhật')
        } catch (err: any) {
            toast.error('Lỗi: ' + err.message)
        } finally {
            setActionLoading(null)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Bạn có chắc chắn muốn xóa lời chúc này?')) return
        setActionLoading(id)
        try {
            const res = await fetch(`/api/admin/wishes/${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('API failed')
            setWishes(prev => prev.filter(w => w.id !== id))
            toast.success('Đã xóa lời chúc')
        } catch {
            toast.error('Không thể xóa lời chúc')
        } finally {
            setActionLoading(null)
        }
    }

    const approved = wishes.filter(w => w.is_approved).length
    const pending = wishes.filter(w => !w.is_approved).length

    return (
        <div>
            {/* Stats + Refresh */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex gap-3 text-sm">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                        ✓ Đã duyệt: {approved}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                        ⏳ Chờ duyệt: {pending}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200 font-medium">
                        Tổng: {wishes.length}
                    </span>
                </div>
                <button
                    onClick={fetchWishes}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-500 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                    Làm mới
                </button>
            </div>

            {loading ? (
                <div className="py-20 flex justify-center items-center text-neutral-400">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-neutral-200">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead className="bg-neutral-50 text-neutral-500 uppercase text-[10px] font-bold tracking-wider">
                            <tr>
                                <th className="px-5 py-3">Người gửi</th>
                                <th className="px-5 py-3">Lời chúc</th>
                                <th className="px-5 py-3">RSVP</th>
                                <th className="px-5 py-3">♥</th>
                                <th className="px-5 py-3">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {wishes.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-neutral-400">
                                        💌 Chưa có lời chúc nào
                                    </td>
                                </tr>
                            ) : (
                                wishes.map((wish) => {
                                    const isBusy = actionLoading === wish.id
                                    return (
                                        <tr
                                            key={wish.id}
                                            className={`transition-colors hover:bg-neutral-50 ${wish.is_pinned ? 'bg-amber-50/40' : ''} ${!wish.is_approved ? 'opacity-60' : ''}`}
                                        >
                                            <td className="px-5 py-3 whitespace-nowrap">
                                                <div className="font-medium text-neutral-900">{wish.name}</div>
                                                <div className="text-[11px] text-neutral-400">{RELATIONSHIP_LABELS[wish.relationship]}</div>
                                                <div className="text-[10px] text-neutral-400">
                                                    {format(new Date(wish.created_at), 'dd/MM HH:mm', { locale: vi })}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 max-w-xs">
                                                <p className="line-clamp-2 text-neutral-600 text-[13px]">{wish.message}</p>
                                            </td>
                                            <td className="px-5 py-3 whitespace-nowrap">
                                                {wish.attending ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-medium border border-green-200">
                                                        ✓ {wish.guest_count} khách
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 text-[10px] font-medium border border-neutral-200">
                                                        Vắng
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3 text-rose-500 font-medium text-sm">
                                                ♥ {wish.hearts}
                                            </td>
                                            <td className="px-5 py-3 whitespace-nowrap">
                                                <div className="flex gap-1.5 items-center">
                                                    {/* Approve / Unapprove */}
                                                    <button
                                                        onClick={() => handleToggle(wish.id, { is_approved: !wish.is_approved })}
                                                        disabled={isBusy}
                                                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all disabled:opacity-50 ${
                                                            wish.is_approved
                                                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                                                                : 'bg-neutral-50 border-neutral-200 text-neutral-500 hover:bg-neutral-100'
                                                        }`}
                                                        title={wish.is_approved ? 'Gỡ duyệt' : 'Duyệt hiển thị'}
                                                    >
                                                        {wish.is_approved ? '✓ Duyệt' : '⏳ Chờ'}
                                                    </button>

                                                    {/* Pin / Unpin */}
                                                    <button
                                                        onClick={() => handleToggle(wish.id, { is_pinned: !wish.is_pinned })}
                                                        disabled={isBusy}
                                                        className={`p-1.5 rounded-lg border transition-all disabled:opacity-50 ${
                                                            wish.is_pinned
                                                                ? 'bg-amber-50 border-amber-200 text-amber-500'
                                                                : 'bg-neutral-50 border-neutral-200 text-neutral-400 hover:bg-neutral-100'
                                                        }`}
                                                        title={wish.is_pinned ? 'Gỡ ghim' : 'Ghim lên đầu'}
                                                    >
                                                        📌
                                                    </button>

                                                    {/* Delete */}
                                                    <button
                                                        onClick={() => handleDelete(wish.id)}
                                                        disabled={isBusy}
                                                        className="p-1.5 rounded-lg border border-neutral-200 text-neutral-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all disabled:opacity-50"
                                                        title="Xóa lời chúc"
                                                    >
                                                        {isBusy ? (
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        ) : (
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
