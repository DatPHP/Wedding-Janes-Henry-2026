
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const activeOnly =
            req.nextUrl.searchParams.get("active") === "true";

        if (activeOnly) {
            const result = await sql`
                SELECT
                    id,
                    label,
                    image_url,
                    file_path,
                    is_active,
                    created_at,
                    updated_at
                FROM backgrounds
                WHERE is_active = TRUE
                ORDER BY updated_at DESC
                LIMIT 1
            `;

            // Luôn trả về array để tương thích với Hero.tsx.
            return NextResponse.json(result.rows, {
                headers: {
                    "Cache-Control": "no-store",
                },
            });
        }

        const result = await sql`
            SELECT
                id,
                label,
                file_path,
                image_url,
                is_active,
                created_at,
                updated_at
            FROM backgrounds
            ORDER BY created_at DESC
        `;

        return NextResponse.json(result.rows, {
            headers: {
                "Cache-Control": "no-store",
            },
        });
    } catch (error) {
        console.error("Failed to fetch backgrounds:", error);

        return NextResponse.json(
            { error: "Could not fetch backgrounds" },
            { status: 500 }
        );
    }
}
