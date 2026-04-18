import { sql } from "@vercel/postgres";
import * as XLSX from "xlsx";

export async function GET() {
  // Auth is handled by middleware (admin_session cookie)
  const { rows } = await sql`
    SELECT
      name,
      phone,
      relationship,
      attendance,
      message,
      submitted_at
    FROM wedding_guests
    ORDER BY submitted_at DESC
  `;

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Guests");

  const buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });

  return new Response(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=wedding-guests.xlsx",
    },
  });
}
