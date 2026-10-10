
import { NextRequest, NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const labelValue = formData.get("label");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { error: "Missing or empty file" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    const label =
      typeof labelValue === "string" && labelValue.trim()
        ? labelValue.trim()
        : file.name;

    // Upload image to Vercel Blob
    const blob = await put(
      `backgrounds/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`,
      file,
      {
        access: "public",
        addRandomSuffix: true,
      }
    );

    // Save metadata to Supabase database
    const { data, error } = await supabaseAdmin
      .from("backgrounds")
      .insert({
        label,
        file_path: blob.url,
        image_url: blob.url,
        is_active: false,
      })
      .select()
      .single();

    if (error) {
      // Roll back uploaded blob if database insert fails
      try {
        await del(blob.url);
      } catch (rollbackError) {
        console.error("Blob rollback failed:", rollbackError);
      }

      console.error("Background DB insert error:", error);

      return NextResponse.json(
        { error: error.message, stage: "database_insert" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Background upload error:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Upload failed",
        stage: "blob_upload_or_unexpected",
      },
      { status: 500 }
    );
  }
}
