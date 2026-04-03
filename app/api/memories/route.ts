import { sql } from "@vercel/postgres";

export async function GET() {
    try {
        const { rows } = await sql`
      SELECT id, image_name, image_url
      FROM memories
      ORDER BY created_at DESC
    `;

        return Response.json(rows);
    } catch (err) {
        return new Response("Error", { status: 500 });
    }
}