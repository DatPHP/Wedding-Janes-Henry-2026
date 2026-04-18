// app/api/admin/wishes/route.ts
// GET /api/admin/wishes — Lấy TẤT CẢ lời chúc cho admin (kể cả chưa duyệt)

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(_req: NextRequest) {
    const supabase = getSupabaseAdmin()

    const { data, error, count } = await supabase
        .from('wishes')
        .select('*', { count: 'exact' })
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })

    if (error) {
        console.error('[GET /api/admin/wishes]', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data, count })
}
