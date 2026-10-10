
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

// Upload image
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return jsonError("Unauthorized", 401);
  }

  let uploadedUrl: string | undefined;

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const rawLabel = formData.get("label");

    if (!(file instanceof File) || file.size === 0) {
      return jsonError("Missing image file", 400);
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      return jsonError("Only JPEG, PNG, and WebP are allowed", 400);
    }

    if (file.size > 5 * 1024 * 1024) {
      return jsonError("Maximum file size is 5 MB", 400);
    }

    const label =
      typeof rawLabel === "string" && rawLabel.trim()
        ? rawLabel.trim()
        : file.name;

    const ext =
      file.type === "image/jpeg" ? "jpg" :
      file.type === "image/png" ? "png" : "webp";

    const pathname = `backgrounds/${crypto.randomUUID()}.${ext}`;

    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type,
    });

    uploadedUrl = blob.url;

    const result = await sql`
      INSERT INTO backgrounds
        (label, file_path, image_url, is_active)
      VALUES
        (${label}, ${blob.pathname}, ${blob.url}, FALSE)
      RETURNING *
    `;

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Background upload failed:", error);

    // Best-effort cleanup if the database insert failed.
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

// Select one active background

export async function PATCH(req: NextRequest) {
    if (!isAdmin(req)) {
        return jsonError("Unauthorized", 401);
    }

    try {
        const body = await req.json();
        const id = body?.id;

        if (typeof id !== "string" || !id.trim()) {
            return jsonError("Missing background id", 400);
        }

        // Xác nhận ảnh tồn tại trước khi cập nhật.
        const target = await sql`
            SELECT id
            FROM backgrounds
            WHERE id = ${id}
            LIMIT 1
        `;

        if (target.rows.length === 0) {
            return jsonError("Background not found", 404);
        }

        // Tắt ảnh đang hoạt động.
        await sql`
            UPDATE backgrounds
            SET is_active = FALSE,
                updated_at = NOW()
            WHERE is_active = TRUE
              AND id <> ${id}
        `;

        // Bật ảnh được chọn.
        await sql`
            UPDATE backgrounds
            SET is_active = TRUE,
                updated_at = NOW()
            WHERE id = ${id}
        `;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Background activation failed:", error);
        return jsonError("Could not activate background", 500);
    }
}


// Delete image
export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) {
    return jsonError("Unauthorized", 401);
  }

  try {
    const body = await req.json();
    const id = body.id;

    if (typeof id !== "string") {
      return jsonError("Missing background id", 400);
    }

    const result = await sql`
      DELETE FROM backgrounds
      WHERE id = ${id}
      RETURNING image_url
    `;

    if (result.rows.length === 0) {
      return jsonError("Background not found", 404);
    }

    try {
      await del(result.rows[0].image_url);
    } catch (blobError) {
      // DB record has already been removed; log for manual cleanup.
      console.error("Could not delete Blob image:", blobError);
      return NextResponse.json({
        success: true,
        warning: "Record deleted, but Blob cleanup failed",
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Background deletion failed:", error);
    return jsonError("Delete failed", 500);
  }
}
