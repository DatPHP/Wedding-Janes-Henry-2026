import { sql } from "@vercel/postgres";

export async function GET(req: Request) {
  try {
    // 1️⃣ Lấy Authorization header
    const authHeader = req.headers.get("authorization");

    // 2️⃣ Check token
    if (
      !authHeader ||
      authHeader !== `Bearer ${process.env.ADMIN_TOKEN}`
    ) {
      return new Response("Unauthorized", { status: 401 });
    }

    // 3️⃣ Query data
    const { rows } = await sql`
      SELECT
        id,
        name,
        phone,
        relationship,
        message,
        attendance,
        submitted_at
      FROM wedding_forms
      ORDER BY submitted_at DESC
    `;

    // 4️⃣ Return JSON
    return Response.json(rows);
  } catch (error) {
    console.error("Admin forms error:", error);
    return new Response("Server error", { status: 500 });
  }
}
