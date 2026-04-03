import { put, del } from "@vercel/blob";
import { sql } from "@vercel/postgres";

export async function POST(req: Request) {
    try {
        // 🔐 Auth
        const auth = req.headers.get("authorization");
        if (auth !== `Bearer ${process.env.ADMIN_TOKEN}`) {
            return new Response("Unauthorized", { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return new Response("No file uploaded", { status: 400 });
        }

        // 🚀 Upload lên Vercel Blob
        const blob = await put(file.name, file, {
            access: "public",
        });

        // 👉 blob.url là CDN URL
        const imageUrl = blob.url;

        // 🗄️ Lưu vào Postgres (Neon)
        await sql`
      INSERT INTO memories (image_name, image_url)
      VALUES (${file.name}, ${imageUrl})
    `;

        return Response.json({
            success: true,
            url: imageUrl,
        });
    } catch (error) {
        console.error("UPLOAD ERROR:", error);
        return new Response(
            JSON.stringify({ message: "Upload failed" }),
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const auth = req.headers.get("authorization");
        if (auth !== `Bearer ${process.env.ADMIN_TOKEN}`) {
            return new Response("Unauthorized", { status: 401 });
        }

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