import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const BUCKET = "backgrounds";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    let label = formData.get("label") as string;

    if (!file) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }
    
    if (!label || label.trim() === "") {
        label = file.name;
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `images/${fileName}`;

    // Upload to Supabase Storage
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from(BUCKET)
      .getPublicUrl(filePath);

    // Save metadata to Database
    const { data: dbData, error: dbError } = await supabaseAdmin
      .from("backgrounds")
      .insert([
        {
          label: label,
          file_path: filePath,
          image_url: publicUrlData.publicUrl,
          is_active: false,
        },
      ])
      .select();

    if (dbError) {
      // Rollback upload if DB insert fails
      await supabaseAdmin.storage.from(BUCKET).remove([filePath]);
      throw dbError;
    }

    return NextResponse.json({ success: true, data: dbData[0] });
  } catch (error: any) {
    console.error("Admin upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
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
