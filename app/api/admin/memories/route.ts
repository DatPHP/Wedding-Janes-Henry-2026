import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { del } from "@vercel/blob";
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// ─── Helper: check auth ───────────────────────────────────────────────────────
async function isAuthorized(): Promise<boolean> {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");
    return session?.value === "henry-janes-06122026";
}

// ─── POST: Issue client-upload token (file goes browser → Blob directly) ─────
export async function POST(request: Request): Promise<NextResponse> {
    const body = (await request.json()) as HandleUploadBody;

    try {
        const jsonResponse = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async (_pathname) => {
                if (!(await isAuthorized())) {
                    throw new Error("Unauthorized");
                }
                return {
                    allowedContentTypes: [
                        "image/jpeg",
                        "image/png",
                        "image/webp",
                        "image/gif",
                        "image/heic",
                        "image/heif",
                    ],
                };
            },
            onUploadCompleted: async ({ blob }) => {
                // Best-effort: also try to save from webhook (may not always fire locally)
                try {
                    const imageName = blob.pathname.split("/").pop() || blob.pathname;
                    await sql`
                        INSERT INTO memories (image_name, image_url)
                        VALUES (${imageName}, ${blob.url})
                    `;
                } catch (err) {
                    console.error("onUploadCompleted DB insert failed:", err);
                    // Don't throw — client will save via PUT as fallback
                }
            },
        });

        return NextResponse.json(jsonResponse);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 400 }
        );
    }
}

// ─── PUT: Client saves blob URL to DB after successful upload ─────────────────
// Called by the browser right after upload() resolves, as a reliable fallback.
export async function PUT(request: Request): Promise<NextResponse> {
    if (!(await isAuthorized())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { url, name } = await request.json();

        if (!url) {
            return NextResponse.json({ error: "Missing url" }, { status: 400 });
        }

        const imageName = name || url.split("/").pop() || "image";

        await sql`
            INSERT INTO memories (image_name, image_url)
            VALUES (${imageName}, ${url})
        `;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("PUT /api/admin/memories error:", error);
        return NextResponse.json({ error: "DB save failed" }, { status: 500 });
    }
}

// ─── DELETE: Remove a memory ──────────────────────────────────────────────────
export async function DELETE(req: Request) {
    if (!(await isAuthorized())) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();
        const { id, imageUrl } = body;

        if (!id || !imageUrl) {
            return new Response("Missing id or imageUrl", { status: 400 });
        }

        await del(imageUrl);

        await sql`
            DELETE FROM memories WHERE id = ${id}
        `;

        return Response.json({ success: true });
    } catch (error) {
        console.error("DELETE ERROR:", error);
        return new Response(
            JSON.stringify({ message: "Delete failed" }),
            { status: 500 }
        );
    }
}