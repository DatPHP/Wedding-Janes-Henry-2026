// app/api/admin/login/route.ts

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const { password } = await req.json()

        if (!password || password !== process.env.ADMIN_SECRET) {
            return NextResponse.json({ message: 'Mật khẩu không đúng.' }, { status: 401 })
        }

        // Set a secure, HttpOnly session cookie
        const res = NextResponse.json({ success: true })
        res.cookies.set('admin_session', process.env.ADMIN_SECRET!, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        })
        return res
    } catch {
        return NextResponse.json({ message: 'Invalid request' }, { status: 400 })
    }
}

export async function DELETE() {
    // Logout: clear the session cookie
    const res = NextResponse.json({ success: true })
    res.cookies.set('admin_session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
    })
    return res
}