// src/components/wishes/AdminWishesClient.tsx

'use client'

import { useState } from 'react'
import type { Wish } from '@/types/wishes'
import { RELATIONSHIP_LABELS } from '@/types/wishes'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

export function AdminWishesClient({ initialWishes }: { initialWishes: Wish[] }) {
    const [wishes, setWishes] = useState<Wish[]>(initialWishes)

    async function handleToggle(id: string, updates: Partial<Wish>) {
        try {
            const res = await fetch(`/api/admin/wishes/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error ?? 'API failed')
            
            setWishes(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w))
        } catch (err: any) {
            alert('Lỗi: ' + err.message)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Bạn có chắc chắn muốn xóa lời chúc này?')) return
        try {
            const res = await fetch(`/api/admin/wishes/${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('API failed')
            setWishes(prev => prev.filter(w => w.id !== id))
        } catch (err) {
            alert('Không thể xóa lời chúc')
        }
    }

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-neutral-50 dark:bg-neutral-800 text-neutral-500 uppercase text-[10px] font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Người gửi</th>
                            <th className="px-6 py-4">Lời chúc</th>
                            <th className="px-6 py-4">RSVP</th>
                            <th className="px-6 py-4">Tương tác</th>
                            <th className="px-6 py-4">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                        {wishes.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                                    Chưa có lời chúc nào được gửi đến.
                                </td>
                            </tr>
                        )}
                        {wishes.map((wish) => (
                            <tr key={wish.id} className={`hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors ${wish.is_pinned ? 'bg-amber-50/30' : ''}`}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium text-neutral-900 dark:text-neutral-100">{wish.name}</div>
                                    <div className="text-[11px] text-neutral-500">{RELATIONSHIP_LABELS[wish.relationship]}</div>
                                    <div className="text-[10px] text-neutral-400 mt-0.5">
                                        {format(new Date(wish.created_at), 'dd/MM/yyyy HH:mm', { locale: vi })}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="max-w-xs md:max-w-md line-clamp-2 text-neutral-600 dark:text-neutral-400 text-[13px]">
                                        {wish.message}
                                    </p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {wish.attending ? (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-medium border border-green-200">
                                            ✓ {wish.guest_count} khách
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 text-[10px] font-medium border border-neutral-200">
                                            Vắng mặt
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5 text-rose-500 font-medium">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                        </svg>
                                        <span className="text-xs">{wish.hearts}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleToggle(wish.id, { is_approved: !wish.is_approved })}
                                            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                                                wish.is_approved 
                                                ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100' 
                                                : 'bg-neutral-50 border-neutral-200 text-neutral-500 hover:bg-neutral-100'
                                            }`}
                                            title={wish.is_approved ? 'Gỡ duyệt' : 'Duyệt hiển thị'}
                                        >
                                            {wish.is_approved ? 'Duyệt' : 'Chờ'}
                                        </button>
                                        <button
                                            onClick={() => handleToggle(wish.id, { is_pinned: !wish.is_pinned })}
                                            className={`p-1.5 rounded-lg border transition-all ${
                                                wish.is_pinned 
                                                ? 'bg-amber-50 border-amber-200 text-amber-500' 
                                                : 'bg-neutral-50 border-neutral-200 text-neutral-400 hover:bg-neutral-100'
                                            }`}
                                            title={wish.is_pinned ? 'Gỡ ghim' : 'Ghim lên đầu'}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(wish.id)}
                                            className="p-1.5 rounded-lg border border-neutral-200 text-neutral-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all"
                                            title="Xóa lời chúc"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
