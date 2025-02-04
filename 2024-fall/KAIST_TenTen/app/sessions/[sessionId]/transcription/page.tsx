"use client";

import { useEffect, useState } from "react";

interface Utterance {
  id: string;
  recording_id: string;
  sequence_num: number;
  started_at: number;
  duration: number;
  speaker_num: number;
  speaker: string;
  msg: string;
  created_at: string;
  modified_at: string;
}

interface UtterancesByRecording {
  [recordingId: string]: Utterance[];
}

interface Props {
  params: { sessionId: string };
}

export default function TranscriptionPage({ params }: Props) {
  const { sessionId } = params;
  const [utterancesByRecording, setUtterancesByRecording] =
    useState<UtterancesByRecording>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTranscription() {
      try {
        const response = await fetch(
          `/api/sessions/${sessionId}/transcription`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch transcription data");
        }

        // 데이터가 recordingId 별로 나누어진 형태로 들어온다고 가정
        const data: UtterancesByRecording = await response.json();
        setUtterancesByRecording(data);
      } catch (error) {
        console.error("Error fetching transcription:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTranscription();
  }, [sessionId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Transcriptions</h1>
      {Object.entries(utterancesByRecording).map(
        ([recordingId, utterances]) => (
          <div
            key={recordingId}
            style={{
              border: "1px solid #ddd",
              margin: "16px 0",
              padding: "16px",
            }}
          >
            <h2>Recording ID: {recordingId}</h2>
            <ul>
              {utterances.map((utterance) => (
                <li key={utterance.id}>
                  <p>
                    <strong>Speaker {utterance.speaker_num}</strong>:{" "}
                    {utterance.msg}
                  </p>
                  <p>Sequence: {utterance.sequence_num}</p>
                  <p>Started At: {utterance.started_at}</p>
                  <p>Duration: {utterance.duration}</p>
                </li>
              ))}
            </ul>
          </div>
        )
      )}
    </div>
  );
}
