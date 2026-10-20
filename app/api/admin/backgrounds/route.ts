import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { del } from "@vercel/blob";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

// ─── Auth helper ─────────────────────────────────────────────────────────────
async function isAdmin(): Promise<boolean> {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");
    const expected = process.env.ADMIN_SECRET ?? "henry-janes-06122026";
    return session?.value === expected;
}

function jsonError(message: string, status: number) {
    return NextResponse.json({ error: message }, { status });
}

// ─── POST: Issue client-upload token (browser → Blob directly) ───────────────
export async function POST(request: Request): Promise<NextResponse> {
    const body = (await request.json()) as HandleUploadBody;

    try {
        const jsonResponse = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async (pathname) => {
                if (!(await isAdmin())) throw new Error("Unauthorized");

                if (!pathname.startsWith("backgrounds/")) {
                    throw new Error("Invalid upload path");
                }

                return {
                    allowedContentTypes: [
                        "image/jpeg",
                        "image/png",
                        "image/webp",
                    ],
                };
            },
            onUploadCompleted: async ({ blob, tokenPayload }) => {
                // Best-effort webhook save — client PUT is the reliable path
                try {
                    const { label } = JSON.parse(tokenPayload || "{}");
                    const bgLabel = label || blob.pathname.split("/").pop() || blob.pathname;
                    await sql`
                        INSERT INTO backgrounds (label, file_path, image_url, is_active)
                        VALUES (${bgLabel}, ${blob.pathname}, ${blob.url}, FALSE)
                    `;
                } catch (err) {
                    console.error("onUploadCompleted backgrounds DB insert failed:", err);
                }
            },
        });

        return NextResponse.json(jsonResponse);
    } catch (error) {
        return jsonError((error as Error).message, 400);
    }
}

// ─── PUT: Client saves blob URL to DB after successful upload ─────────────────
export async function PUT(request: NextRequest): Promise<NextResponse> {
    if (!(await isAdmin())) return jsonError("Unauthorized", 401);

    try {
        const { url, pathname, label } = await request.json();

        if (!url) return jsonError("Missing url", 400);

        const filePath = pathname || url;
        const bgLabel = label?.trim() || filePath.split("/").pop() || "background";

        // Check for duplicates from webhook
        const existing = await sql`SELECT id FROM backgrounds WHERE image_url = ${url} LIMIT 1`;
        if (existing.rows.length === 0) {
            await sql`
                INSERT INTO backgrounds (label, file_path, image_url, is_active)
                VALUES (${bgLabel}, ${filePath}, ${url}, FALSE)
            `;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("PUT /api/admin/backgrounds error:", error);
        return jsonError("DB save failed", 500);
    }
}

// ─── PATCH: Activate a background ────────────────────────────────────────────
export async function PATCH(req: NextRequest): Promise<NextResponse> {
    if (!(await isAdmin())) return jsonError("Unauthorized", 401);

    try {
        const body = await req.json();
        const id = body?.id;

        if (typeof id !== "string" || !id.trim()) {
            return jsonError("Missing background id", 400);
        }

        const target = await sql`SELECT id FROM backgrounds WHERE id = ${id} LIMIT 1`;
        if (target.rows.length === 0) return jsonError("Background not found", 404);

        await sql`
            UPDATE backgrounds SET is_active = FALSE, updated_at = NOW()
            WHERE is_active = TRUE AND id <> ${id}
        `;
        await sql`
            UPDATE backgrounds SET is_active = TRUE, updated_at = NOW()
            WHERE id = ${id}
        `;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Background activation failed:", error);
        return jsonError("Could not activate background", 500);
    }
}

// ─── DELETE: Remove a background ─────────────────────────────────────────────
export async function DELETE(req: NextRequest): Promise<NextResponse> {
    if (!(await isAdmin())) return jsonError("Unauthorized", 401);

    try {
        const body = await req.json();
        const id = body.id;

        if (typeof id !== "string") return jsonError("Missing background id", 400);

        const result = await sql`DELETE FROM backgrounds WHERE id = ${id} RETURNING image_url`;
        if (result.rows.length === 0) return jsonError("Background not found", 404);

        try {
            await del(result.rows[0].image_url);
        } catch (blobErr) {
            console.error("Blob cleanup failed:", blobErr);
            return NextResponse.json({ success: true, warning: "Record deleted, Blob cleanup failed" });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Background deletion failed:", error);
        return jsonError("Delete failed", 500);
    }
}

// ─── GET: List all backgrounds ────────────────────────────────────────────────
export async function GET(req: NextRequest): Promise<NextResponse> {
    if (!(await isAdmin())) return jsonError("Unauthorized", 401);

    try {
        const result = await sql`
            SELECT id, label, file_path, image_url, is_active, created_at
            FROM backgrounds
            ORDER BY created_at DESC
        `;
        return NextResponse.json(result.rows, {
            headers: { "Cache-Control": "no-store" },
        });
    } catch (error) {
        console.error("Failed to fetch backgrounds:", error);
        return jsonError("Could not fetch backgrounds", 500);
    }
}
