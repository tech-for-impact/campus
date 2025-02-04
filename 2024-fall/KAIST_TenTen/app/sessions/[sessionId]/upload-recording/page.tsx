"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";

// Type for handling file input
interface FileInput {
  file: File | null;
}

interface Props {
  params: { sessionId: string };
}

export default function UploadRecording({ params }: Props) {
  const { sessionId } = params;

  const [fileInput, setFileInput] = useState<FileInput>({ file: null });
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  // Handle file input change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFileInput({ file: files[0] });
    }
  };

  // Handle form submit to upload the file
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const { file } = fileInput;
    if (!file) {
      setUploadStatus("Please select a file first.");
      return;
    }

    // TODO: Check if it is .wav file, else convert into wav file
    if (file.type !== "audio/wav") {
      setUploadStatus("Please select a .wav file.");
      return;
    }

    const formData = new FormData();
    formData.append("wavfile", file);

    try {
      setUploadStatus("Uploading file...");
      const response = await fetch(`/api/sessions/${sessionId}/upload-s3`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setUploadStatus(`File uploaded successfully and saved to DB`);
        // TODO: request to ai server to get summary
      } else {
        setUploadStatus("File upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("An error occurred while uploading the file.");
    }
  };

  return (
    <div className="container">
      <h1>Upload Your Audio Recording</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
}
