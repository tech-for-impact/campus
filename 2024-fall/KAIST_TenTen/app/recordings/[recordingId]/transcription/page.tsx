"use client";

import { createClient } from "@/utils/supabase/component";

interface Props {
  params: { recordingId: string };
}

export default async function Recordings({ params }: Props) {
  // const supabase = createClient();
  // const { data: recordings } = await supabase.from("Recording").select();

  const { recordingId } = params;

  const handleClick = async () => {
    console.log("clicked");
    try {
      console.log("Requesting transcription...");
      const response = await fetch(
        `/api/recordings/${recordingId}/transcription`,
        {
          method: "POST",
          body: "",
        }
      );

      if (response.ok) {
        // TODO: request to ai server to get summary
        console.log("Transcription requested successfully");
        console.log(response.json());
      } else {
        console.error("Error getting transcription:", response.statusText);
      }
    } catch (error) {
      console.error("Error getting transcription:", error);
    }
  };

  return (
    <div>
      {/* <pre>{JSON.stringify(recordings, null, 2)}</pre> */}
      <button onClick={handleClick}>click</button>
    </div>
  );
  // TODO: Render the list of recordings as buttons
}
