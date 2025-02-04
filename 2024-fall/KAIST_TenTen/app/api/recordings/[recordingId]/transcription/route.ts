import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import qs from "qs";
import FormData from "form-data";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { createClient } from "@/utils/supabase/component";
import { Readable } from "stream";

const supabase = createClient();

const s3Client = new S3Client({
  region: process.env.MY_AWS_REGION,
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
  },
});

const defaultKeywords = [
  "스테로이드",
  "타이레놀",
  "항생제",
  "진통소염제",
  "항히스타민제",
  "알레르기",
  "비염",
];

export const runtime = "nodejs";

// POST: Request STT to returnzero
export async function POST(
  req: NextRequest,
  { params }: { params: { recordingId: string } }
) {
  const { recordingId } = params;

  // Run STT
  try {
    // download recording file from S3
    const recordingFileBuffer = await downloadRecordingFile(recordingId);
    // get keywords
    const keywords = await getKeywords(recordingId);
    // get auth token
    const authToken = await getAuthToken();
    // get transcription with keywords
    const sttStatus = await getSttStatus(recordingId);
    if (sttStatus !== "ready") {
      console.error(
        "Transcription not ready or already in progress or completed"
      );
      return NextResponse.json(
        {
          error: "Transcription not ready or already in progress or completed",
        },
        { status: 400 }
      );
    }
    await setSttStatus(recordingId, "in_progress");
    const { utterances } = await getTranscription(
      authToken,
      recordingFileBuffer,
      keywords
    );
    await setSttStatus(recordingId, "completed");
    await setTopicStatus(recordingId, "ready");

    // insert utterances into Utterance table
    try {
      await insertUtterances(recordingId, utterances);
    } catch (dbError) {
      console.error("Database insert error:", dbError);
      return NextResponse.json(
        { error: "Database insert failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Created transcription successfully",
      transcription: utterances,
    });
  } catch (error) {
    console.error("Creating transcription error:", error);
    return NextResponse.json(
      { error: "Creating transcription failed" },
      { status: 500 }
    );
  }
}

// download wav file from S3 and return buffer
async function downloadRecordingFile(recordingId: string): Promise<Buffer> {
  const downloadParams = {
    Bucket: process.env.MY_AWS_S3_BUCKET_NAME,
    Key: `recordings/${recordingId}.wav`,
  };
  const command = new GetObjectCommand(downloadParams);
  const { Body } = await s3Client.send(command);

  if (Body instanceof Readable) {
    // TODO: return buffer
    const chunks: Uint8Array[] = [];
    // `Readable` 스트림을 async iterator로 읽어들이기
    for await (const chunk of Body) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  } else {
    throw new Error("Unexpected Body type returned from S3");
  }
}

async function getKeywords(recordingId: string): Promise<string[]> {
  const {
    data: { session_id: sessionId },
    error: sessionIdError,
  } = await supabase
    .from("Recording")
    .select("session_id")
    .eq("id", recordingId)
    .single();

  if (sessionIdError) {
    throw new Error(
      `Error fetching session_id by recording_id: ${sessionIdError.message}`
    );
  }

  if (!sessionId) {
    throw new Error("Session ID not found for the given recording ID.");
  }

  const { data: drugs, error: drugsError } = await supabase
    .from("Session")
    .select("prescription_drugs, other_drugs")
    .eq("id", sessionId);

  if (drugsError) {
    throw new Error(`Error fetching drugs: ${drugsError.message}`);
  }

  const prescription_drugs: string[] = drugs[0]?.prescription_drugs ?? [];
  const other_drugs: string[] = drugs[0]?.other_drugs ?? [];

  return [...defaultKeywords, ...prescription_drugs, ...other_drugs];
}

async function getAuthToken() {
  try {
    const response = await axios.post(
      "https://openapi.vito.ai/v1/authenticate",
      qs.stringify({
        // 데이터를 URL 인코딩해서 전송
        client_id: process.env.RETURNZERO_CLIENT_ID,
        client_secret: process.env.RETURNZERO_CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          accept: "application/json",
        },
      }
    );

    // 응답으로 받은 JWT 토큰 출력
    const token = response.data.access_token;
    return token;
  } catch (error) {
    console.error(
      "Error fetching token:",
      error.response ? error.response.data : error.message
    );
  }
}

async function getTranscription(
  auth_token: string,
  audioFileBuffer: Buffer,
  keywords: string[]
) {
  const formData = new FormData();

  formData.append("file", audioFileBuffer, {
    filename: "recording.wav",
    contentType: "audio/wav",
  });

  formData.append(
    "config",
    JSON.stringify({
      model_name: "sommers", // 또는 'whisper'
      use_diarization: true,
      diarization: {
        spk_count: 2,
      },
      keywords: keywords,
    })
  );

  try {
    const response = await axios.post(
      "https://openapi.vito.ai/v1/transcribe",
      formData,
      {
        headers: {
          Authorization: `Bearer ${auth_token}`,
          accept: "application/json",
          ...formData.getHeaders(),
        },
      }
    );
    const transcribeId = response.data.id;
    console.log("Transcription request sent:", transcribeId);

    // 전사 결과 조회
    const results = await checkTranscriptionResult(auth_token, transcribeId);
    return results;
  } catch (error) {
    console.error("Error during transcription request:", error);
  }
}

async function checkTranscriptionResult(
  auth_token,
  transcribeId
): Promise<any> {
  try {
    // 일정 시간 대기 (예: 5초)
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const response = await axios.get(
      `https://openapi.vito.ai/v1/transcribe/${transcribeId}`,
      {
        headers: {
          Authorization: `Bearer ${auth_token}`,
          accept: "application/json",
        },
      }
    );

    if (response.data.status === "completed") {
      console.log("Transcription completed");
      return response.data.results;
    } else if (response.data.status === "transcribing") {
      console.log("Transcription is still in progress. Retrying...");
      return await checkTranscriptionResult(auth_token, transcribeId); // 재귀 호출로 재시도
    } else {
      console.error("Transcription failed:", response.data);
      return null;
    }
  } catch (error) {
    console.error("Error retrieving transcription result:", error);
  }
}

async function insertUtterances(recordingId: string, utterances) {
  for (let i = 0; i < utterances.length; i++) {
    const utterance = utterances[i];

    const { start_at, duration, spk, spk_type, msg } = utterance;

    const sequence_num = i + 1;

    const { error } = await supabase.from("Utterance").insert({
      recording_id: recordingId, // 외래 키로 사용되는 recording ID
      sequence_num: sequence_num, // 각 utterance의 순서 번호
      started_at: start_at, // 시작 시간
      duration: duration, // 지속 시간
      speaker_num: spk, // 화자 번호
      speaker: spk_type, // 화자 유형
      msg: msg, // 메시지 내용
      created_at: new Date(), // 현재 시간으로 설정
      modified_at: new Date(), // 현재 시간으로 설정
    });

    if (error) {
      console.error("Error inserting utterance:", error);
      throw new Error(`Failed to insert utterance at sequence ${sequence_num}`);
    }
  }
}

async function setSttStatus(recordingId: string, status: string) {
  supabase
    .from("Recording")
    .update({ stt_status: status })
    .eq("id", recordingId);
}

async function setTopicStatus(recordingId: string, status: string) {
  supabase
    .from("Recording")
    .update({ topic_status: status })
    .eq("id", recordingId);
}

async function getSttStatus(recordingId: string) {
  const { data, error } = await supabase
    .from("Recording")
    .select("stt_status")
    .eq("id", recordingId)
    .single();

  if (error) {
    console.error("Error fetching stt_status:", error);
    return null;
  }

  return data.stt_status;
}
