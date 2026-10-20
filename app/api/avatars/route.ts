
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/avatars
 * Trả về avatar đang active.
 * - Query ?person=bride  → chỉ lấy avatar cô dâu
 * - Query ?person=groom  → chỉ lấy avatar chú rể
 * - Không có query      → trả về cả 2 (bride + groom active)
 */
export async function GET(req: NextRequest) {
    try {
        const person = req.nextUrl.searchParams.get("person");

        let result;

        if (person === "bride" || person === "groom") {
            result = await sql`
                SELECT
                    id,
                    person,
                    image_url,
                    file_path,
                    is_active,
                    created_at,
                    updated_at
                FROM avatars
                WHERE is_active = TRUE
                  AND person = ${person}
                ORDER BY updated_at DESC
                LIMIT 1
            `;
        } else {
            // Lấy cả 2 avatars đang active
            result = await sql`
                SELECT
                    id,
                    person,
                    image_url,
                    file_path,
                    is_active,
                    created_at,
                    updated_at
                FROM avatars
                WHERE is_active = TRUE
                ORDER BY person ASC
            `;
        }

        return NextResponse.json(result.rows, {
            headers: {
                "Cache-Control": "no-store",
            },
        });
    } catch (error) {
        console.error("Failed to fetch avatars:", error);

        return NextResponse.json(
            { error: "Could not fetch avatars" },
            { status: 500 }
        );
    }
}
