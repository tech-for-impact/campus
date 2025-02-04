import { NextRequest, NextResponse } from "next/server";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { createClient } from "@/utils/supabase/component";

const supabase = createClient();

const sqsClient = new SQSClient({
  region: process.env.MY_AWS_REGION,
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
  },
});

export const runtime = "nodejs";

// POST: Send a message to the SQS queue
// recordingId 넘겨주면 됨.
export async function POST(
  req: NextRequest,
  { params }: { params: { recordingId: string } }
) {
  const { recordingId } = params;

  try {
    // Validate
    if (!recordingId) {
      return NextResponse.json(
        { error: "Recording ID is required" },
        { status: 400 }
      );
    }

    // (optional, if needed)
    const { data: recording, error } = await supabase
      .from("Recording")
      .select("id, s3_url")
      .eq("id", recordingId)
      .single();

    if (error) {
      console.error("Error fetching recording from Supabase:", error);
      return NextResponse.json(
        { error: "Error fetching recording" },
        { status: 500 }
      );
    }

    if (!recording) {
      return NextResponse.json(
        { error: "Recording not found" },
        { status: 404 }
      );
    }
    const messageBody = JSON.stringify({ recording_id: recordingId });

    const command = new SendMessageCommand({
      QueueUrl: process.env.MY_AWS_SQS_QUEUE_URL,
      MessageBody: messageBody,
    });

    await sqsClient.send(command);

    console.log("Message sent to SQS:", messageBody);

    return NextResponse.json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message to SQS:", error);
    return NextResponse.json(
      { error: "Error sending message to SQS" },
      { status: 500 }
    );
  }
}
