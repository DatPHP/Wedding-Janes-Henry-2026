// middleware.ts

import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/admin/login', '/api/admin/login']

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    // Allow public auth paths through without any check
    if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
        return NextResponse.next()
    }

    // Protect /admin pages — check for session cookie
    if (pathname.startsWith('/admin')) {
        const token = req.cookies.get('admin_session')?.value
        const expected = process.env.ADMIN_SECRET

        if (!token || token !== expected) {
            const loginUrl = req.nextUrl.clone()
            loginUrl.pathname = '/admin/login'
            return NextResponse.redirect(loginUrl)
        }
    }

    // Protect /api/admin routes — return 401 JSON (no redirect for APIs)
    if (pathname.startsWith('/api/admin')) {
        const token = req.cookies.get('admin_session')?.value
        const expected = process.env.ADMIN_SECRET

        if (!token || token !== expected) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
}
