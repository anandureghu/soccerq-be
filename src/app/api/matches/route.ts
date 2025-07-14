import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// GET /api/match
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const distinct = searchParams.get("distinct");
  const date = searchParams.get("date");
  const sort = searchParams.get("sort") || "asc";

  if (distinct === "1") {
    // Return distinct match datetimes only
    const { data, error } = await supabase
      .from("match")
      .select("datetime")
      .order("datetime", { ascending: sort === "asc" });

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    const uniqueDates = [
      ...new Set(data.map((item) => item.datetime.split("T")[0])),
    ];
    return NextResponse.json(uniqueDates, { status: 200 });
  }

  if (date) {
    const { data, error } = await supabase
      .from("match")
      .select(
        `
        id, datetime, court, goal_team1, goal_team2,
        team1:team1 (id, name),
        team2:team2 (id, name)
      `
      )
      .gte("datetime", `${date}T00:00:00`)
      .lt("datetime", `${date}T23:59:59`)
      .order("datetime", { ascending: sort === "asc" });

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data, { status: 200 });
  }

  return NextResponse.json({ error: "Invalid query" }, { status: 400 });
}

// POST /api/match
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { datetime, court, team1, team2 } = body;

  if (!datetime || !court || !team1 || !team2)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const { data, error } = await supabase.from("match").insert([
    {
      datetime,
      court,
      team1,
      team2,
    },
  ]);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data, { status: 201 });
}
