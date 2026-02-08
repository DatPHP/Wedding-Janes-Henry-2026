import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, phone, relationship, message, attendance } =
      await req.json();

    if (!name || !phone || !relationship || !attendance) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await sql`
      INSERT INTO wedding_guests
      (name, phone, relationship, message, attendance)
      VALUES
      (${name}, ${phone}, ${relationship}, ${message}, ${attendance})
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Database error" },
      { status: 500 }
    );
  }
}
