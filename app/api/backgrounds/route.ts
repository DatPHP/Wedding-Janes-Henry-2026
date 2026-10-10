import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const activeOnly = searchParams.get("active") === "true";

  try {
    let query = supabase.from("backgrounds").select("*");
    
    if (activeOnly) {
      query = query.eq("is_active", true).limit(1);
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Failed to fetch backgrounds:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
