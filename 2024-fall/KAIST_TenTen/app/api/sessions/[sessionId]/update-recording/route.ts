import { NextRequest, NextResponse } from "next/server";
import { S3Client } from "@aws-sdk/client-s3";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

const s3Client = new S3Client({
  region: process.env.MY_AWS_REGION,
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const { sessionId } = params;

  console.log("Session ID received:", sessionId);

  try {
    // Step 1: Parse request body
    let fileUrl: string | undefined;
    try {
      const body = await req.json();
      fileUrl = body?.fileUrl;
      console.log("File URL received:", fileUrl);
    } catch (error) {
      console.error("Failed to parse JSON body:", error);
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    // Step 2: Validate fileUrl
    if (!fileUrl) {
      console.error("Validation failed: File URL is missing");
      return NextResponse.json(
        { error: "File URL is required" },
        { status: 400 }
      );
    }

    // Step 3: Create a new recording in the database
    let recordingId: string;
    try {
      recordingId = await createRecording(sessionId);
      console.log("Recording created successfully. ID:", recordingId);
    } catch (error) {
      console.error("Error during createRecording:", error.message);
      return NextResponse.json(
        { error: "Failed to create recording" },
        { status: 500 }
      );
    }

    // Step 4: Update the recording with the S3 file URL
    try {
      const { error } = await supabase
        .from("Recording")
        .update({ s3_url: fileUrl, stt_status: "ready" })
        .eq("id", recordingId);

      if (error) {
        console.error("Database update error:", error.message);
        throw new Error("Failed to update recording in the database");
      }
      console.log(
        "Database updated successfully for recording ID:",
        recordingId
      );
    } catch (error) {
      console.error("Error updating the recording:", error.message);
      return NextResponse.json(
        { error: "Failed to update the recording" },
        { status: 500 }
      );
    }

    // Step 5: Return success response
    return NextResponse.json({ message: "Database updated successfully" });
  } catch (error) {
    console.error("Unexpected error occurred:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

async function createRecording(sessionId: string): Promise<string> {
  try {
    const { data, error } = await supabase
      .from("Recording")
      .insert({
        session_id: sessionId,
        stt_status: "pending",
        topic_status: "pending",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error inserting new recording:", error.message);
      throw new Error("Failed to insert new recording");
    }

    if (!data?.id) {
      console.error("Recording creation failed: Missing ID in response");
      throw new Error("Failed to create recording: ID is missing");
    }

    return data.id;
  } catch (error) {
    console.error("Error in createRecording function:", error.message);
    throw error; // Re-throw the error to propagate it to the caller
  }
}
