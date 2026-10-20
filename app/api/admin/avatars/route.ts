
import { put, del } from "@vercel/blob";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function isAdmin(req: NextRequest) {
    const expected = process.env.ADMIN_SECRET;
    const actual = req.cookies.get("admin_session")?.value;
    return Boolean(expected && actual && actual === expected);
}

function jsonError(message: string, status: number) {
    return NextResponse.json({ error: message }, { status });
}

/**
 * POST /api/admin/avatars
 * Upload ảnh avatar lên Vercel Blob, lưu record vào DB.
 * Body: multipart/form-data
 *   - file: File
 *   - person: "bride" | "groom"
 */
export async function POST(req: NextRequest) {
    if (!isAdmin(req)) {
        return jsonError("Unauthorized", 401);
    }

    let uploadedUrl: string | undefined;

    try {
        const formData = await req.formData();
        const file = formData.get("file");
        const person = formData.get("person");

        if (!(file instanceof File) || file.size === 0) {
            return jsonError("Missing image file", 400);
        }

        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            return jsonError("Only JPEG, PNG, and WebP are allowed", 400);
        }

        if (file.size > 5 * 1024 * 1024) {
            return jsonError("Maximum file size is 5 MB", 400);
        }

        if (person !== "bride" && person !== "groom") {
            return jsonError("person must be 'bride' or 'groom'", 400);
        }

        const ext =
            file.type === "image/jpeg" ? "jpg" :
            file.type === "image/png"  ? "png" : "webp";

        const pathname = `avatars/${person}/${crypto.randomUUID()}.${ext}`;

        const blob = await put(pathname, file, {
            access: "public",
            addRandomSuffix: false,
            contentType: file.type,
        });

        uploadedUrl = blob.url;

        // Lưu vào DB (mặc định is_active = FALSE, cần PATCH để activate)
        const result = await sql`
            INSERT INTO avatars
                (person, file_path, image_url, is_active)
            VALUES
                (${person}, ${blob.pathname}, ${blob.url}, FALSE)
            RETURNING *
        `;

        return NextResponse.json(
            { success: true, data: result.rows[0] },
            { status: 201 }
        );
    } catch (error) {
        console.error("Avatar upload failed:", error);

        // Cleanup Blob nếu DB insert thất bại
        if (uploadedUrl) {
            try {
                await del(uploadedUrl);
            } catch (cleanupError) {
                console.error("Blob cleanup failed:", cleanupError);
            }
        }

        return jsonError("Upload failed", 500);
    }
}

/**
 * PATCH /api/admin/avatars
 * Set một avatar là active (đồng thời deactivate các ảnh cùng person).
 * Body: { id: number }
 */
export async function PATCH(req: NextRequest) {
    if (!isAdmin(req)) {
        return jsonError("Unauthorized", 401);
    }

    try {
        const body = await req.json();
        const id = body?.id;

        if (typeof id !== "number" && typeof id !== "string") {
            return jsonError("Missing avatar id", 400);
        }

        // Lấy person của avatar này
        const target = await sql`
            SELECT id, person
            FROM avatars
            WHERE id = ${id}
            LIMIT 1
        `;

        if (target.rows.length === 0) {
            return jsonError("Avatar not found", 404);
        }

        const person = target.rows[0].person;

        // Deactivate tất cả avatar cùng person
        await sql`
            UPDATE avatars
            SET is_active = FALSE,
                updated_at = NOW()
            WHERE person = ${person}
              AND is_active = TRUE
              AND id <> ${id}
        `;

        // Activate avatar được chọn
        await sql`
            UPDATE avatars
            SET is_active = TRUE,
                updated_at = NOW()
            WHERE id = ${id}
        `;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Avatar activation failed:", error);
        return jsonError("Could not activate avatar", 500);
    }
}

/**
 * DELETE /api/admin/avatars
 * Xóa avatar khỏi DB và Vercel Blob.
 * Body: { id: number }
 */
export async function DELETE(req: NextRequest) {
    if (!isAdmin(req)) {
        return jsonError("Unauthorized", 401);
    }

    try {
        const body = await req.json();
        const id = body?.id;

        if (typeof id !== "number" && typeof id !== "string") {
            return jsonError("Missing avatar id", 400);
        }

        const result = await sql`
            DELETE FROM avatars
            WHERE id = ${id}
            RETURNING image_url
        `;

        if (result.rows.length === 0) {
            return jsonError("Avatar not found", 404);
        }

        try {
            await del(result.rows[0].image_url);
        } catch (blobError) {
            console.error("Could not delete Blob image:", blobError);
            return NextResponse.json({
                success: true,
                warning: "Record deleted, but Blob cleanup failed",
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Avatar deletion failed:", error);
        return jsonError("Delete failed", 500);
    }
}

/**
 * GET /api/admin/avatars
 * Lấy tất cả avatars (cả active và inactive) để hiển thị trong admin panel.
 */
export async function GET(req: NextRequest) {
    if (!isAdmin(req)) {
        return jsonError("Unauthorized", 401);
    }

    try {
        const result = await sql`
            SELECT
                id,
                person,
                image_url,
                file_path,
                is_active,
                created_at,
                updated_at
            FROM avatars
            ORDER BY person ASC, created_at DESC
        `;

        return NextResponse.json(result.rows, {
            headers: { "Cache-Control": "no-store" },
        });
    } catch (error) {
        console.error("Failed to fetch avatars (admin):", error);
        return jsonError("Could not fetch avatars", 500);
    }
}
