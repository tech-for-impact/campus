import React, { useState, useEffect } from "react";
import styles from "./SessionAddModal.module.css";

interface Patient {
  id: string;
  name: string;
  date_of_birth: Date;
  gender: string;
  phone_number: string;
  organization: string;
  created_at: Date;
  modified_at: Date;
}

interface Session {
  id?: string;
  patient_id?: string;
  session_datetime: Date;
  title: string;
  status?: string | null;
  pharmacist_summary?: string | null;
  patient_summary?: string | null;
  form_type?: string | null;
  form_content?: string | null;
  created_at?: Date;
  modified_at?: Date;
  former_questions?: string | null;
  prescription_drugs?: string | null;
  other_drugs?: string | null;
  pharmacist_note?: string | null;
  temp?: string | null;
}

interface SessionAddModalProps {
  session?: Session;
  patient: Patient;
  isEditMode?: boolean;
  onClose: () => void;
  onSubmit: (sessionData: Session) => void;
  sessionCount: number;
}

const SessionAddModal: React.FC<SessionAddModalProps> = ({
  session,
  patient,
  isEditMode = false,
  onClose,
  onSubmit,
  sessionCount,
}) => {
  const [title, setTitle] = useState("");
  const [dateTime, setDateTime] = useState<Date>(new Date());

  useEffect(() => {
    if (isEditMode && session) {
      setTitle(session.title);
      setDateTime(session.session_datetime);
    } else {
      const now = new Date();
      setTitle(`${sessionCount}회차 상담`);
      setDateTime(now);
    }
  }, [isEditMode, session, patient.name]);

  const handleSubmit = () => {
    onSubmit({
      title: title,
      session_datetime: dateTime,
    });
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{isEditMode ? "상담 수정" : "새 상담 추가"}</h2>
        <input
          type="text"
          placeholder="상담 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.inputField}
        />
        <input
          type="datetime-local"
          placeholder="상담 일시"
          value={dateTime.toISOString().slice(0, 16)} // Date 객체를 "YYYY-MM-DDTHH:MM" 형식으로 변환
          onChange={(e) => setDateTime(new Date(e.target.value))}
          className={styles.inputField}
        />
        <button onClick={handleSubmit} className={styles.primaryButton}>
          {isEditMode ? "수정" : "추가"}
        </button>
        <button onClick={onClose} className={styles.secondaryButton}>
          취소
        </button>
      </div>
    </div>
  );
};

export default SessionAddModal;
