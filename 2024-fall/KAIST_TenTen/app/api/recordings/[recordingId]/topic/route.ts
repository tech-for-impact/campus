import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/component";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const supabase = createClient();

const sqsClient = new SQSClient({
  region: process.env.MY_AWS_REGION,
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
  },
});

export const runtime = "nodejs";

// GET: 주어진 recordingId에 대한 TopicSummary 데이터를 가져오기
export async function GET(
  req: NextRequest,
  { params }: { params: { recordingId: string } }
) {
  const { recordingId } = params;

  try {
    // 유효성 검사
    if (!recordingId) {
      return NextResponse.json(
        { error: "Recording ID is required" },
        { status: 400 }
      );
    }

    // Recording 테이블에서 topic_status 확인
    const { data: recording, error: recordingError } = await supabase
      .from("Recording")
      .select("topic_status")
      .eq("id", recordingId)
      .single();

    if (recordingError) {
      console.error(
        "Supabase에서 Recording을 가져오는 중 오류:",
        recordingError
      );
      return NextResponse.json(
        { error: "Error fetching recording" },
        { status: 500 }
      );
    }

    // Recording이 없거나 topic_status가 "completed"가 아니면 오류 반환
    if (!recording || recording.topic_status !== "completed") {
      return NextResponse.json(
        { error: "Topic summary is not yet completed or recording not found" },
        { status: 400 }
      );
    }

    // 주어진 recordingId에 대한 TopicSummary 데이터를 가져옴
    const { data: topicSummaries, error: topicSummaryError } = await supabase
      .from("TopicSummary")
      .select("*") // Ensure that RLS policies allow this
      .eq("recording_id", recordingId);

    if (topicSummaryError) {
      console.error(
        "Supabase에서 TopicSummary를 가져오는 중 오류:",
        topicSummaryError
      );
      return NextResponse.json(
        { error: "Error fetching topic summary" },
        { status: 500 }
      );
    }
    // Check the recordingId being used
    console.log("Recording ID:", recordingId);

    // Check the data fetched from TopicSummary
    console.log("TopicSummaries:", topicSummaries);

    // TopicSummary 데이터가 없으면 오류 반환
    if (!topicSummaries || topicSummaries.length === 0) {
      return NextResponse.json(
        {
          error: `No topic summaries found for the given recording ID: ${recordingId}`,
          topicSummaries,
        },
        { status: 404 }
      );
    }

    // insert topics into supabase
    const { data, error } = await supabase.from("Recording").insert([
      {
        topics: topicSummaries,
      },
    ]);

    // 에러 처리
    if (error) {
      console.error("Error inserting topics:", error.message);
      return NextResponse.json(
        { error: "Failed to insert topics" },
        { status: 500 }
      );
    }

    // TopicSummary 데이터를 반환
    return NextResponse.json({ topicSummaries });
  } catch (error) {
    console.error("Topic summary를 가져오는 중 오류:", error);
    return NextResponse.json(
      { error: "Error retrieving topic summary" },
      { status: 500 }
    );
  }
}

// POST: Request to generate topic summary for a given recordingId
export async function POST(
  req: NextRequest,
  { params }: { params: { recordingId: string } }
) {
  const { recordingId } = params;

  // Topic Post Method Calling
  try {
    await sendSqsMessage(recordingId);
    await setTopicStatus(recordingId, "in_progress");
    return NextResponse.json({
      message: "Sent request to topic lambda function successfully",
    });
  } catch (sqsError) {
    console.error("Error sending message to SQS:", sqsError);
    return NextResponse.json(
      { error: "Error sending message to SQS" },
      { status: 500 }
    );
  }
}

// send sqs request to topic lambda function
async function sendSqsMessage(recordingId: string) {
  const messageBody = JSON.stringify({ recording_id: recordingId });

  const command = new SendMessageCommand({
    QueueUrl: process.env.AWS_SQS_QUEUE_URL,
    MessageBody: messageBody,
  });

  await sqsClient.send(command);
  console.log("Message sent to SQS:", messageBody);
}

async function setTopicStatus(recordingId: string, status: string) {
  supabase
    .from("Recording")
    .update({ topic_status: status })
    .eq("id", recordingId);
}
