import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const type = searchParams.get("type");
  const match_id = searchParams.get("match_id");

  if (!type || !match_id) {
    return NextResponse.json(
      { error: "'type' and 'match_id' are required" },
      { status: 400 }
    );
  }

  let query = supabase
    .from("stats")
    .select(
      `
      id,
      type,
      match_id,
      team_id,
      player_name,
      player_number,
      time,
      team:team_id (
        id,
        name
      )
    `
    )
    .eq("match_id", match_id);

  if (type === "goal") {
    query = query.eq("type", "goal");
  } else if (type === "card") {
    query = query.in("type", ["yellow", "red"]);
  } else {
    return NextResponse.json(
      { error: "Invalid 'type'. Must be 'goal' or 'card'" },
      { status: 400 }
    );
  }

  const { data, error } = await query;

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data, { status: 200 });
}
