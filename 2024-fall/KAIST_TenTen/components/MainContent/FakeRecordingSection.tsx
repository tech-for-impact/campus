"use client";

import React, { useState, useEffect } from "react";
import { FaStop, FaMicrophone } from "react-icons/fa";
import styles from "./FakeRecordingSection.module.css";

const FakeRecordingSection: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const mins = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  const handleRecordClick = () => {
    /*if (isRecording) {
      // Stop recording
      setIsRecording(false);
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      setTimeout(() => {
        alert("녹음이 업로드되었습니다. 잠시 후 요약이 준비됩니다.");
      }, 1000); // Simulate 1-second delay
    } else {
      // Start recording
      setIsRecording(true);
      setTimeElapsed(0);
      const id = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
      setIntervalId(id);
    }*/
    alert("녹음 기능은 배포 환경에서 사용하실 수 없습니다.");
  };

  return (
    <div className={styles.fakeRecordingSection}>
      <h2 className={styles.title}>약사 상담 녹음</h2>
      {isRecording ? (
        <p className={styles.subtitle}>경과 시간: {formatTime(timeElapsed)}</p>
      ) : (
        <p className={styles.subtitle}>
          아래 버튼을 눌러 상담을 녹음합니다. 녹음 업로드 후, 자동 요약에
          1분~2분 가량이 소요될 수 있습니다.
        </p>
      )}
      <button
        className={`${styles.recordButton} ${
          isRecording ? styles.recording : ""
        }`}
        onClick={handleRecordClick}
      >
        {isRecording ? (
          <FaStop className={styles.icon} />
        ) : (
          <FaMicrophone className={styles.icon} />
        )}
      </button>
    </div>
  );
};

export default FakeRecordingSection;
