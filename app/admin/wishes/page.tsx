// src/app/admin/wishes/page.tsx

import { getSupabaseAdmin } from '@/lib/supabase'
import { AdminWishesClient } from '@/components/wishes/AdminWishesClient'
import type { Wish } from '@/types/wishes'

export const dynamic = 'force-dynamic'

export default async function AdminWishesPage() {
    const supabase = getSupabaseAdmin()
    
    // Lấy tất cả lời chúc (không lọc is_approved) để quản trị
    const { data, error } = await supabase
        .from('wishes')
        .select('*')
        .order('created_at', { ascending: false })

    const wishes = data as Wish[] | null

    if (error) {
        return (
            <div className="p-8 text-center bg-red-50 text-red-600 rounded-xl border border-red-100">
                <p className="font-semibold">Lỗi cơ sở dữ liệu</p>
                <p className="text-sm">{error.message}</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-black p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-rose-500">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                            </span>
                            <h1 className="text-2xl font-serif font-bold text-neutral-900 dark:text-neutral-100">
                                Quản lý lời chúc & RSVP
                            </h1>
                        </div>
                        <p className="text-neutral-500 text-sm">
                            Hệ thống quản trị lời chúc và danh sách khách mời tham dự đám cưới.
                        </p>
                    </div>
                    
                    <div className="flex gap-4 text-sm">
                        <div className="bg-white dark:bg-neutral-900 px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm">
                            <span className="text-neutral-400">Tổng số:</span>
                            <span className="ml-2 font-bold text-neutral-900 dark:text-neutral-100">{wishes?.length || 0}</span>
                        </div>
                        <div className="bg-white dark:bg-neutral-900 px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm">
                            <span className="text-neutral-400">Tham dự:</span>
                            <span className="ml-2 font-bold text-green-600">
                                {wishes?.filter(w => w.attending).length || 0}
                            </span>
                        </div>
                    </div>
                </header>

                <AdminWishesClient initialWishes={wishes || []} />
            </div>
        </div>
    )
}
