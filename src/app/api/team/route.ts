import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

// GET /api/team - Fetch all teams
export async function GET() {
  const { data, error } = await supabase.from("team").select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
