// SessionCard.tsx

import React, { useState, useRef, useEffect } from "react";
import { Spinner } from "flowbite-react";
import styles from "./SessionCard.module.css";

interface Session {
  id: string;
  patient_id: string;
  session_datetime: Date;
  title: string;
  status: string | null;
  pharmacist_summary: string | null;
  patient_summary: string | null;
  form_type: string | null;
  form_content: string | null;
  created_at: Date;
  modified_at: Date;
  former_questions: string | null;
  prescription_drugs: string | null;
  other_drugs: string | null;
  pharmacist_note: string | null;
  temp: string | null;
}

interface SessionCardProps {
  session: Session;
  onViewDetails: (session: Session) => void;
  onDelete: (session: Session) => void;
  onEdit: (session: Session) => void;
  isLoading: boolean;
  isZero: boolean;
}

const SessionCard: React.FC<SessionCardProps> = ({
  session,
  onViewDetails,
  onDelete,
  onEdit,
  isLoading,
  isZero,
}) => {
  if (isZero) {
    return (
      <div className={styles.sessionContainer}>
        <div className={styles.sessionRow}>
          <div className={styles.sessionField}>{session.title}</div>
          <div className={styles.sessionField}></div>
          <div className={styles.sessionField}></div>
          <button className={styles.actionButton}></button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.sessionContainer}>
        <div className={`${styles.sessionRow} gap-4`}>
          <Spinner className={styles.sessionField} color="gray"></Spinner>
          <div className={styles.sessionField}>상담 정보를 로딩 중입니다.</div>
          <div className={styles.sessionField}></div>
          <button className={styles.actionButton}></button>
        </div>
      </div>
    );
  }

  const [showDropdown, setShowDropdown] = useState(false);

  const handleDeleteClick = () => {
    onDelete(session);
    setShowDropdown(false);
  };

  const handleEditClick = () => {
    onEdit(session);
    setShowDropdown(false);
  };

  const handleViewDetailsClick = () => {
    onViewDetails(session);
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const formattedDateTime = session.session_datetime.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const formattedModifiedDateTime = session.modified_at.toLocaleString(
    "ko-KR",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }
  );

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className={styles.sessionContainer}>
      <div className={styles.sessionRow}>
        <div className={styles.sessionField}>{session.title}</div>
        <div className={styles.sessionField}>{formattedDateTime}</div>
        <div className={styles.sessionField}>{formattedModifiedDateTime}</div>
        <button className={styles.actionButton} onClick={toggleDropdown}>
          ⋮
        </button>
        {showDropdown && (
          <div className={styles.dropdownMenu} ref={dropdownRef}>
            <div className={styles.dropdownItem} onClick={handleEditClick}>
              수정
            </div>
            <div className={styles.dropdownItem} onClick={handleDeleteClick}>
              삭제
            </div>
            <div
              className={styles.dropdownItem}
              onClick={handleViewDetailsClick}
            >
              상담 보기
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionCard;
