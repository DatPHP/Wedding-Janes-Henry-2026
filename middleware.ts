// middleware.ts

import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
    // Chỉ bảo vệ các route bắt đầu bằng /admin hoặc /api/admin
    // (Bỏ qua /app/api/admin nếu dùng cấu trúc App Router, quan trọng là pathname)
    if (req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname.startsWith('/api/admin')) {
        const auth = req.headers.get('authorization')
        
        // Basic Auth: admin:ADMIN_SECRET
        const expected = 'Basic ' + Buffer.from(
            `admin:${process.env.ADMIN_SECRET}`
        ).toString('base64')

        if (auth !== expected) {
            return new NextResponse('Unauthorized', {
                status: 401,
                headers: { 'WWW-Authenticate': 'Basic realm="Admin"' },
            })
        }
    }
    
    return NextResponse.next()
}

export const config = {
    // Matcher cho tất cả các sub-paths
    matcher: ['/admin/:path*', '/api/admin/:path*'],
}
