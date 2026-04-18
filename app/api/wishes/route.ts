// app/api/wishes/route.ts
// GET /api/wishes — Public: returns guest messages from wedding_guests (Neon/Vercel Postgres)
// Only returns rows that have a non-empty message

import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const page  = Math.max(1, parseInt(searchParams.get('page')  ?? '1'))
    const limit = Math.min(100, parseInt(searchParams.get('limit') ?? '50'))
    const offset = (page - 1) * limit

    try {
        const { rows } = await sql`
            SELECT
                id,
                name,
                relationship,
                message,
                attendance,
                submitted_at AS created_at
            FROM wedding_guests
            WHERE message IS NOT NULL AND TRIM(message) <> ''
            ORDER BY submitted_at DESC
            LIMIT ${limit} OFFSET ${offset}
        `

        const { rows: countRows } = await sql`
            SELECT COUNT(*) AS total
            FROM wedding_guests
            WHERE message IS NOT NULL AND TRIM(message) <> ''
        `

        return NextResponse.json(
            { data: rows, count: parseInt(countRows[0].total) },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
                },
            }
        )
    } catch (err) {
        console.error('[GET /api/wishes]', err)
        return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
}