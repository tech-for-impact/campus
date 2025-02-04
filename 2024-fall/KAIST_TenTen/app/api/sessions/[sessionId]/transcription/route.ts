import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/component";

const supabase = createClient();

// GET: Get transcription data from Utterance table
export async function GET(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const { sessionId } = params;

  // Fetch recording_ids for the session
  const { data: recordingIds, error } = await supabase
    .from("Recording")
    .select("id")
    .eq("session_id", sessionId);

  if (error) {
    console.error("Failed to fetch recording_id", error);
    return NextResponse.json(
      { error: "Failed to fetch recording_id" },
      { status: 500 }
    );
  }

  const utterancesByRecording: Record<string, any[]> = {};
  // Fetch utterances for each recording
  for (const { id: recordingId } of recordingIds) {
    const { data: utterances, error } = await supabase
      .from("Utterance")
      .select()
      .eq("recording_id", recordingId)
      .order("sequence_num", { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch transcription" },
        { status: 500 }
      );
    }

    utterancesByRecording[recordingId] = utterances || [];
  }

  return NextResponse.json(utterancesByRecording);
}
