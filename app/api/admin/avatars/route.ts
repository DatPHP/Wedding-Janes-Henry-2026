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

                // Validate person from pathname prefix (avatars/bride/... or avatars/groom/...)
                const person = pathname.startsWith("avatars/bride/") ? "bride"
                    : pathname.startsWith("avatars/groom/") ? "groom"
                    : null;

                if (!person) throw new Error("Invalid upload path");

                return {
                    allowedContentTypes: [
                        "image/jpeg",
                        "image/png",
                        "image/webp",
                    ],
                    tokenPayload: JSON.stringify({ person }),
                };
            },
            onUploadCompleted: async ({ blob, tokenPayload }) => {
                // Best-effort webhook save (may not always fire — client PUT is the reliable path)
                try {
                    const { person } = JSON.parse(tokenPayload || "{}");
                    if (person) {
                        await sql`
                            INSERT INTO avatars (person, file_path, image_url, is_active)
                            VALUES (${person}, ${blob.pathname}, ${blob.url}, FALSE)
                        `;
                    }
                } catch (err) {
                    console.error("onUploadCompleted avatar DB insert failed:", err);
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
        const { url, pathname, person } = await request.json();

        if (!url || !person || (person !== "bride" && person !== "groom")) {
            return jsonError("Missing url or invalid person", 400);
        }

        const filePath = pathname || url.split("/").pop() || url;

        // Upsert: nếu webhook đã lưu rồi thì skip (dùng image_url để detect duplicate)
        const existing = await sql`SELECT id FROM avatars WHERE image_url = ${url} LIMIT 1`;
        if (existing.rows.length === 0) {
            await sql`
                INSERT INTO avatars (person, file_path, image_url, is_active)
                VALUES (${person}, ${filePath}, ${url}, FALSE)
            `;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("PUT /api/admin/avatars error:", error);
        return jsonError("DB save failed", 500);
    }
}

// ─── PATCH: Activate an avatar ────────────────────────────────────────────────
export async function PATCH(req: NextRequest): Promise<NextResponse> {
    if (!(await isAdmin())) return jsonError("Unauthorized", 401);

    try {
        const body = await req.json();
        const id = body?.id;

        if (typeof id !== "number" && typeof id !== "string") {
            return jsonError("Missing avatar id", 400);
        }

        const target = await sql`SELECT id, person FROM avatars WHERE id = ${id} LIMIT 1`;
        if (target.rows.length === 0) return jsonError("Avatar not found", 404);

        const person = target.rows[0].person;

        await sql`
            UPDATE avatars SET is_active = FALSE, updated_at = NOW()
            WHERE person = ${person} AND is_active = TRUE AND id <> ${id}
        `;
        await sql`
            UPDATE avatars SET is_active = TRUE, updated_at = NOW()
            WHERE id = ${id}
        `;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Avatar activation failed:", error);
        return jsonError("Could not activate avatar", 500);
    }
}

// ─── DELETE: Remove an avatar ─────────────────────────────────────────────────
export async function DELETE(req: NextRequest): Promise<NextResponse> {
    if (!(await isAdmin())) return jsonError("Unauthorized", 401);

    try {
        const body = await req.json();
        const id = body?.id;

        if (typeof id !== "number" && typeof id !== "string") {
            return jsonError("Missing avatar id", 400);
        }

        const result = await sql`DELETE FROM avatars WHERE id = ${id} RETURNING image_url`;
        if (result.rows.length === 0) return jsonError("Avatar not found", 404);

        try {
            await del(result.rows[0].image_url);
        } catch (blobErr) {
            console.error("Blob cleanup failed:", blobErr);
            return NextResponse.json({ success: true, warning: "Record deleted, Blob cleanup failed" });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Avatar deletion failed:", error);
        return jsonError("Delete failed", 500);
    }
}

// ─── GET: List all avatars ────────────────────────────────────────────────────
export async function GET(req: NextRequest): Promise<NextResponse> {
    if (!(await isAdmin())) return jsonError("Unauthorized", 401);

    try {
        const result = await sql`
            SELECT id, person, image_url, file_path, is_active, created_at, updated_at
            FROM avatars
            ORDER BY person ASC, created_at DESC
        `;
        return NextResponse.json(result.rows, {
            headers: { "Cache-Control": "no-store" },
        });
    } catch (error) {
        console.error("Failed to fetch avatars:", error);
        return jsonError("Could not fetch avatars", 500);
    }
}
