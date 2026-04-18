// src/app/api/wishes/[id]/heart/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await props.params
        const supabase = getSupabaseAdmin()

        // Gọi RPC function đã định nghĩa trong database
        // @ts-ignore - Bỏ qua lỗi suy luận type nếu cache của trình soạn thảo chưa cập nhật
        const { error } = await supabase.rpc('increment_hearts', { wish_id: id })

        if (error) {
            console.error('[Heart API]', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('[Heart API Error]', err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
