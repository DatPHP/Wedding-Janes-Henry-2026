// src/app/api/wishes/route.ts
// GET  /api/wishes        — lấy danh sách lời chúc đã duyệt
// POST /api/wishes        — submit lời chúc mới

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import type { WishFormData } from '@/types/wishes'

// ----------------------------------------------------------------
// GET — Lấy lời chúc (pinned trước, mới nhất sau)
// ----------------------------------------------------------------
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = parseInt(searchParams.get('limit') ?? '20')
    const from = (page - 1) * limit
    const to = from + limit - 1

    const supabase = getSupabaseAdmin()

    const { data, error, count } = await supabase
        .from('wishes')
        .select('*', { count: 'exact' })
        .eq('is_approved', true)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .range(from, to)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(
        { data, count },
        {
            headers: {
                // Cache ngắn để feed luôn fresh
                'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=10',
            },
        }
    )
}

// ----------------------------------------------------------------
// POST — Submit lời chúc mới
// ----------------------------------------------------------------
export async function POST(req: NextRequest) {
    let body: WishFormData

    try {
        body = await req.json()
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    // Validation
    const errors: string[] = []
    if (!body.name?.trim()) errors.push('Vui lòng nhập tên')
    if (!body.message?.trim()) errors.push('Vui lòng nhập lời chúc')
    if (body.message?.length > 500) errors.push('Lời chúc tối đa 500 ký tự')
    if (body.name?.length > 100) errors.push('Tên quá dài')
    const validRels = ['family', 'friend', 'relative', 'colleague', 'neighbor']
    if (!validRels.includes(body.relationship)) errors.push('Quan hệ không hợp lệ')

    if (errors.length > 0) {
        return NextResponse.json({ error: errors[0] }, { status: 422 })
    }

    // Rate limiting đơn giản — check IP (nâng cao hơn dùng Upstash Redis)
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
    // TODO: implement Redis rate limiting nếu cần

    const supabase = getSupabaseAdmin()

    const { data, error } = await (supabase
        .from('wishes') as any)
        .insert({
            name: body.name.trim(),
            email: body.email?.trim() || undefined,
            phone: body.phone?.trim() || undefined,
            relationship: body.relationship,
            attending: body.attending ?? true,
            guest_count: Math.min(Math.max(body.guest_count ?? 1, 1), 10),
            message: body.message.trim(),
        })
        .select()
        .single()

    if (error) {
        console.error('[wishes/POST]', error)
        return NextResponse.json({ error: 'Không thể gửi lời chúc. Vui lòng thử lại.' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
}