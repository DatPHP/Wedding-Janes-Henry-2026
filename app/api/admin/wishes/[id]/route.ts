// src/app/api/admin/wishes/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import type { Wish } from '@/types/wishes'

export async function PATCH(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await props.params
        const body = (await req.json()) as Partial<Wish>
        const supabase = getSupabaseAdmin()

        // Phê duyệt hoặc Ghim lời chúc
        // @ts-ignore - Bỏ qua lỗi suy luận type của Supabase SDK
        const { data, error } = await supabase
            .from('wishes')
            .update({
                is_approved: body.is_approved,
                is_pinned: body.is_pinned,
            })
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('[Admin API PATCH]', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ data })
    } catch (err) {
        return NextResponse.json({ error: 'Invalid Request' }, { status: 400 })
    }
}

export async function DELETE(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await props.params
        const supabase = getSupabaseAdmin()

        const { error } = await supabase
            .from('wishes')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('[Admin API DELETE]', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (err) {
        return NextResponse.json({ error: 'Invalid Request' }, { status: 400 })
    }
}
