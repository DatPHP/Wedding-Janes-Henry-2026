import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { del } from "@vercel/blob";
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// ─── POST: Client-side upload token handler ───────────────────────────────────
// File goes DIRECTLY from browser → Vercel Blob (bypasses serverless payload limit).
// This route only issues a short-lived token and handles the completion webhook.
export async function POST(request: Request): Promise<NextResponse> {
    const body = (await request.json()) as HandleUploadBody;

    try {
        const jsonResponse = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async (pathname) => {
                // Verify admin session cookie
                const cookieStore = await cookies();
                const session = cookieStore.get("admin_session");
                if (!session || session.value !== "henry-janes-06122026") {
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
                    // Pass the original filename via tokenPayload so the webhook can save it
                    tokenPayload: JSON.stringify({ pathname }),
                };
            },
            onUploadCompleted: async ({ blob, tokenPayload }) => {
                // This webhook fires after the direct upload finishes.
                // Save the blob URL to Postgres here.
                try {
                    const { pathname } = JSON.parse(tokenPayload || "{}");
                    const imageName = pathname?.split("/").pop() || blob.pathname;

                    await sql`
                        INSERT INTO memories (image_name, image_url)
                        VALUES (${imageName}, ${blob.url})
                    `;
                } catch (err) {
                    console.error("DB insert failed after upload:", err);
                    throw new Error("Could not save to database");
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

// ─── DELETE: Remove a memory ──────────────────────────────────────────────────
export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const { id, imageUrl } = body;

        if (!id || !imageUrl) {
            return new Response("Missing id or imageUrl", { status: 400 });
        }

        // 1. Delete from Vercel Blob
        await del(imageUrl);

        // 2. Delete from Postgres
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