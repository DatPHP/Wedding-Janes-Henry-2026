import { sql } from "@vercel/postgres";
import { writeFile } from "fs/promises";
import path from "path";

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
            return new Response("No file", { status: 400 });
        }

        // 🖼️ convert file
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 📁 đặt tên file
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.join(process.cwd(), "public/images", fileName);

        // 💾 lưu vào public/images
        await writeFile(filePath, buffer);

        const imageUrl = `/images/${fileName}`;

        // 🗄️ lưu DB
        await sql`
      INSERT INTO memories (image_name, image_url)
      VALUES (${fileName}, ${imageUrl})
    `;

        return Response.json({ success: true, imageUrl });
    } catch (err) {
        console.error(err);
        return new Response("Upload error", { status: 500 });
    }
}