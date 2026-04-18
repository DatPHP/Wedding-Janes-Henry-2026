import { sql } from "@vercel/postgres";

export async function GET() {
  try {
    // Auth is handled by middleware (admin_session cookie)
    const { rows } = await sql`
      SELECT
        id,
        name,
        phone,
        relationship,
        message,
        attendance,
        submitted_at
      FROM wedding_guests
      ORDER BY submitted_at DESC
    `;

    return Response.json(rows);
  } catch (error) {
    console.error("Admin forms error:", error);
    return new Response("Server error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return new Response("Missing id", { status: 400 });

    await sql`DELETE FROM wedding_guests WHERE id = ${id}`;
    return Response.json({ success: true });
  } catch (error) {
    console.error("Admin forms DELETE error:", error);
    return new Response("Server error", { status: 500 });
  }
}

