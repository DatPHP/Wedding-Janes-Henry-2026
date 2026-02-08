import { sql } from "@vercel/postgres";

export async function GET(req: Request) {
  const token = req.headers.get("authorization");

  if (token !== `Bearer ${process.env.ADMIN_TOKEN}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { rows } = await sql`
    SELECT *
    FROM wedding_forms
    ORDER BY submitted_at DESC
  `;

  return Response.json(rows);
}

