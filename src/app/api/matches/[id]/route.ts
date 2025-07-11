import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// GET /api/matches/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;

  const { data, error } = await supabase
    .from("match")
    .select(
      `
      *,
      team1:team1 (id, name),
      team2:team2 (id, name)
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

// PATCH /api/matches/[id]?action=start|end
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  if (!["start", "end"].includes(action || "")) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const field = action === "start" ? "started_at" : "ended_at";

  const { error } = await supabase
    .from("match")
    .update({ [field]: new Date().toISOString() })
    .eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(
    { message: `Match ${action} time updated.` },
    { status: 200 }
  );
}
