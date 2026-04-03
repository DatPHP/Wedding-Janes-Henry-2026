import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { z } from "zod";

const rsvpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().regex(/^0\d{9}$/, "Phone number must be 10 digits and begin with a zero."),
  relationship: z.string().min(1, "Relationship is required"),
  message: z.string().optional().default(""),
  attendance: z.string().min(1, "Attendance is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = rsvpSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, phone, relationship, message, attendance } = result.data;

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
