import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createClient } from "@/utils/supabase/component";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// const BASE_URL = "http://localhost:3000"; // for local testing

const supabase = createClient();

const s3Client = new S3Client({
  region: process.env.MY_AWS_REGION,
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY!,
  },
});

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const { sessionId } = params;

  let recordingId;
  try {
    recordingId = await createRecording(sessionId);
  } catch (dbError) {
    console.error("Database insert error:", dbError);
    return NextResponse.json(
      { error: "Database insert failed" },
      { status: 500 }
    );
  }

  try {
    // upload wav file to s3
    const presignedUrl = await getPresignedUrl(recordingId);
    await uploadToS3(presignedUrl, req);

    const fileUrl = `https://${process.env.MY_AWS_S3_BUCKET_NAME}.s3.${process.env.MY_AWS_REGION}.amazonaws.com/recordings/${recordingId}.wav`;

    // update recording url in Recording table
    try {
      await updateRecordingUrl(recordingId, fileUrl);
    } catch (dbError) {
      console.error("Database update error:", dbError);
      return NextResponse.json(
        { error: "Database update failed", fileUrl: fileUrl },
        { status: 500 }
      );
    }

    // Request STT
    try {
      const response = await fetch(
        `${BASE_URL}/api/recordings/${recordingId}/transcription`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        throw new Error("STT request failed");
      }
      const result = await response.json();
      console.log("STT done.", result.transcription);
    } catch (error) {
      console.error("Error while requesting STT:", error);
    }

    // Request topics
    try {
      const response = await fetch(
        `${BASE_URL}/api/recordings/${recordingId}/topic`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        throw new Error("Topic request failed");
      }
      console.log("Topic successfully requested");
    } catch (error) {
      console.error("Error while requesting topic:", error);
    }

    return NextResponse.json({
      message: "Recording file upload, STT, and topic request successful.",
      fileUrl: fileUrl,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Failed among file upload, STT, and topic request." },
      { status: 500 }
    );
  }
}

// insert into Recording table
async function createRecording(sessionId) {
  const { data, error } = await supabase
    .from("Recording")
    .insert({
      session_id: sessionId,
      stt_status: "pending",
      topic_status: "pending",
    })
    .select("id");

  if (error) {
    throw new Error(`Error creating database record: ${error.message}`);
  }

  return data[0].id; // recordingId
}

// update recording s3_url
async function updateRecordingUrl(recordingId, fileUrl) {
  const { error } = await supabase
    .from("Recording")
    .update({
      s3_url: fileUrl,
      stt_status: "ready",
    })
    .eq("id", recordingId);

  if (error) {
    throw new Error(`Error updating database record: ${error.message}`);
  }
}

async function getPresignedUrl(recordingId) {
  try {
    const s3Params = {
      Bucket: process.env.MY_AWS_S3_BUCKET_NAME,
      Key: `recordings/${recordingId}.wav`,
      ContentType: "audio/wav",
    };

    console.log("[DEBUG] S3 Parameters for presigned URL:", s3Params);

    // Presigned URL 생성
    const command = new PutObjectCommand(s3Params);
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    return presignedUrl;
  } catch (error) {
    console.error("[ERROR] Failed to create presigned URL:", error.message);
    throw new Error("Failed to create presigned URL. Please try again later.");
  }
}

async function uploadToS3(presignedUrl, req) {
  const formData = await req.formData();
  const wavfile = formData.get("wavfile") as File;

  // 파일 내용을 ArrayBuffer로 변환 후 Buffer로 변환
  const arrayBuffer = await wavfile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const s3UploadResponse = await fetch(presignedUrl, {
    method: "PUT",
    headers: { "Content-Type": "audio/wav" },
    body: buffer,
  });

  if (!s3UploadResponse.ok) {
    console.log("File upload to S3 failed.");
    return;
  }
}
