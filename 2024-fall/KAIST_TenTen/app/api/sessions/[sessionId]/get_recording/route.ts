import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/component";

//const supabase = createClient();

import { createBrowserClient } from "@supabase/ssr";
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!,
  {
    global: {
      fetch: (url: any, options = {}) => {
        return fetch(url, { ...options, cache: "no-store" });
      },
    },
  }
);

export async function GET(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const { sessionId } = params;

  console.log("Fetching recording for session with ID:", sessionId);

  const { data, error } = await supabase
    .from("Recording")
    .select("id, s3_url, topic_status, stt_status, created_at")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false })
    .limit(2); // 가장 최신 2개만.

  if (error) {
    console.error("Error fetching recording:", error.message);
    return NextResponse.json({ error: "Recording not found" }, { status: 404 });
  }

  //캐싱 방지
  return NextResponse.json(data);
}
