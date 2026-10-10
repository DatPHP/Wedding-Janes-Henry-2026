import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const BUCKET = "backgrounds";


export async function POST(req: NextRequest) {
  let uploadedPath: string | null = null;

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const rawLabel = formData.get("label");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { error: "File không hợp lệ hoặc file rỗng." },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File phải có định dạng hình ảnh." },
        { status: 400 }
      );
    }

    const label =
      typeof rawLabel === "string" && rawLabel.trim()
        ? rawLabel.trim()
        : file.name;

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const filePath = `images/${fileName}`;

    // Step 1: Upload to Supabase Storage
    const buffer = Buffer.from(await file.arrayBuffer());

    const { data: uploaded, error: uploadError } =
      await supabaseAdmin.storage
        .from(BUCKET)
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

    if (uploadError) {
      console.error("[Background Upload][Storage]", uploadError);

      return NextResponse.json(
        {
          error: uploadError.message,
          stage: "storage_upload",
        },
        { status: 500 }
      );
    }

    uploadedPath = uploaded.path;

    // Step 2: Generate public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(BUCKET)
      .getPublicUrl(uploaded.path);

    // Step 3: Insert database record
    const { data, error: dbError } = await supabaseAdmin
      .from("backgrounds")
      .insert({
        label,
        file_path: uploaded.path,
        image_url: urlData.publicUrl,
        is_active: false,
      })
      .select()
      .single();

    if (dbError) {
      console.error("[Background Upload][Database]", dbError);

      // Roll back Storage if database insert fails
      const { error: cleanupError } = await supabaseAdmin.storage
        .from(BUCKET)
        .remove([uploaded.path]);

      if (cleanupError) {
        console.error("[Background Upload][Rollback]", cleanupError);
      }

      uploadedPath = null;

      return NextResponse.json(
        {
          error: dbError.message,
          code: dbError.code,
          stage: "database_insert",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("[Background Upload][Unexpected]", error);

    // Best-effort cleanup for unexpected errors after upload
    if (uploadedPath) {
      const { error: cleanupError } = await supabaseAdmin.storage
        .from(BUCKET)
        .remove([uploadedPath]);

      if (cleanupError) {
        console.error("[Background Upload][Rollback]", cleanupError);
      }
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Lỗi không xác định khi upload hình nền.",
        stage: "unexpected",
      },
      { status: 500 }
    );
  }
}


export async function DELETE(req: NextRequest) {
  try {
    const { id, filePath } = await req.json();

    if (!id || !filePath) {
      return NextResponse.json({ error: "Missing id or filePath" }, { status: 400 });
    }

    // Delete from Database
    const { error: dbError } = await supabaseAdmin
      .from("backgrounds")
      .delete()
      .eq("id", id);

    if (dbError) throw dbError;

    // Delete from Storage
    const { error: storageError } = await supabaseAdmin.storage
      .from(BUCKET)
      .remove([filePath]);

    if (storageError) {
      console.warn("Storage deletion failed, but DB record removed:", storageError);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    // Set all to false first
    const { error: resetError } = await supabaseAdmin
      .from("backgrounds")
      .update({ is_active: false })
      .neq("id", id); // update everything not equal to id

    if (resetError) throw resetError;

    // Set target to true
    const { error: updateError } = await supabaseAdmin
      .from("backgrounds")
      .update({ is_active: true })
      .eq("id", id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin patch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
