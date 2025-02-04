const cron = require("node-cron");
const { createBrowserClient } = require("@supabase/ssr");
const axios = require("axios");
const dotenv = require("dotenv");

// .env 파일 로드
dotenv.config({ path: ".env.local" });

const BASE_URL =
  // process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  process.env.NEXT_PUBLIC_API_BASE_URL;

// Supabase 클라이언트 생성
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

// scheduler for 10 minutes
// cron.schedule("*/10 * * * *", async () => {
cron.schedule("*/30 * * * * *", async () => {
  console.log("Running STT and Topic scheduler");
  sttScheduler();
  topicScheduler();
});

async function sttScheduler() {
  const { data, error } = await supabase
    .from("Recording")
    .select("id")
    .eq("stt_status", "ready");

  if (error) {
    console.error("Error fetching recording:", error.message);
  }

  data.forEach(async (recording) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/recordings/${recording.id}/transcription`,
        null
      );
      console.log("Transcription successfully requested");
    } catch (error) {
      console.error("Error while requesting transcription:", error);
    }
  });
}

async function topicScheduler() {
  const { data, error } = await supabase
    .from("Recording")
    .select("id")
    .eq("topic_status", "ready");

  if (error) {
    console.error("Error fetching recording:", error.message);
  }

  data.forEach(async (recording) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/recordings/${recording.id}/topic`,
        null
      );
      console.log("Topic successfully requested");
    } catch (error) {
      console.error("Error while requesting topic:", error);
    }
  });
}
