"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import SessionCard from "./SessionCard";
import Header from "../Header/Header";
import PatientProfile from "./PatientProfile";
import SessionAddModal from "./SessionAddModal";
import DeleteModal from "@/components/DeleteModal";
import styles from "./PatientDetailPage.module.css";

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

const PatientDetailPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const patientId = pathname.split("/").pop();

  const [loading, setLoading] = useState(true);
  const [patientInfo, setPatientInfo] = useState<Patient | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId) return;
    loadSessions();
  }, [patientId]);

  //API를 통해 상담 목록을 가져오는 함수
  const loadSessions = async () => {
    setLoading(true);
    try {
      const data = await fetchPatientInfo(patientId as string);
      const formattedPatientInfo = {
        ...data.patient,
        created_at: new Date(data.patient.created_at),
        modified_at: new Date(data.patient.modified_at),
        date_of_birth: new Date(data.patient.date_of_birth),
      };
      const formattedSessions = data.sessions.map((session: Session) => ({
        ...session,
        created_at: new Date(session.created_at),
        modified_at: new Date(session.modified_at),
        session_datetime: new Date(session.session_datetime),
      }));

      setPatientInfo(formattedPatientInfo);
      setSessions(formattedSessions);
      setSelectedSession(null);
      setShowModal(false);
      setShowDeleteModal(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientInfo = async (
    patientId: string
  ): Promise<{ patient: Patient; sessions: Session[] }> => {
    const response = await fetch(`/api/patients/${patientId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch patient information");
    }
    return await response.json();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSession(null);
  };

  // 상담 추가 함수
  const handleAddSession = async (sessionData: {
    title: string;
    session_datetime: Date;
  }) => {
    setLoading(true);
    try {
      const formattedSessionData = {
        title: sessionData.title,
        session_datetime: sessionData.session_datetime.toISOString(),
      };

      const response = await fetch(`/api/patients/${patientId}/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedSessionData),
      });

      if (!response.ok) {
        throw new Error("Failed to create session");
      }

      await loadSessions();
    } catch (error) {
      console.error("Error creating session:", error);
      alert("세션 추가에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  // 상담 삭제 함수
  const handleDeleteSession = async () => {
    setLoading(true);
    try {
      console.log(selectedSession.id);
      const response = await fetch(
        `/api/patients/${patientId}/sessions/${selectedSession.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete session");
      }

      await loadSessions();
    } catch (error) {
      console.error("Error deleting session:", error);
      alert("세션 삭제에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  // 상담 수정 함수
  const handleUpdateSession = async (sessionData: {
    title: string;
    session_datetime: Date;
  }) => {
    setLoading(true);
    try {
      if (!selectedSession) {
        throw new Error("No session selected for update");
      }

      const formattedSessionData = {
        title: sessionData.title,
        session_datetime: sessionData.session_datetime.toISOString(),
      };

      const response = await fetch(
        `/api/patients/${patientId}/sessions/${selectedSession.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedSessionData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update session");
      }

      await loadSessions();
    } catch (error) {
      console.error("Error updating session:", error);
      alert("세션 수정에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  // 상담 삭제 확인 모달 열기
  const handleDeleteConfirm = (session: Session) => {
    setSelectedSession(session);
    setShowDeleteModal(true);
  };

  // 상담 정보 수정 핸들러
  const handleEditSession = (session: Session) => {
    setSelectedSession(session);
    setShowModal(true);
  };

  // 상담 내용 보기 핸들러
  const handleViewDetails = (session: Session) => {
    setSelectedSession(session);
    router.push(`../sessions/${session.id}`);
  };

  //스켈레톤 코드 용 페이크 데이터
  const fakePatient: Patient = {
    id: "fakePatient001",
    name: "환자 정보를 로딩 중입니다",
    date_of_birth: new Date("1111-11-11"), // 임의의 과거 날짜
    gender: "로딩",
    phone_number: "01011111111", // 가짜 번호
    organization: "",
    created_at: new Date("1111-11-11"), // 임의 생성 날짜
    modified_at: new Date("1111-11-11"), // 임의 수정 날짜
  };

  const fakeSession = {
    id: "fakeId12345",
    patient_id: "patient001",
    session_datetime: new Date(),
    title: "상담이 없습니다. +를 눌러 새 상담을 추가해 주세요.",
    status: "pending", // or "completed", "cancelled"
    pharmacist_summary: null,
    patient_summary: null,
    form_type: null,
    form_content: null,
    created_at: null,
    modified_at: null,
    former_questions: null,
    prescription_drugs: null,
    other_drugs: null,
    pharmacist_note: null,
    temp: null,
  };

  return (
    <div className={styles.Page}>
      <Header />
      {patientInfo ? (
        <PatientProfile
          patient={patientInfo}
          isLoading={false}
        ></PatientProfile>
      ) : (
        <PatientProfile patient={fakePatient} isLoading={true}></PatientProfile>
      )}

      {error && <div className={styles.errorMessage}>{error}</div>}
      {showModal && (
        <SessionAddModal
          session={selectedSession || undefined}
          patient={patientInfo}
          isEditMode={!!selectedSession}
          onClose={handleCloseModal}
          onSubmit={selectedSession ? handleUpdateSession : handleAddSession}
          sessionCount={
            !sessions || sessions.length === 0 ? 1 : sessions.length + 1
          }
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          onConfirm={handleDeleteSession}
          onCancel={() => setShowDeleteModal(false)}
          deleteName={`"${selectedSession?.title}"`}
        />
      )}
      {loading ? (
        <div className={styles.sessionContainer}>
          <div className={styles.tableHeader}>
            <div className={styles.tableHeaderItem}>이름</div>
            <div className={styles.tableHeaderItem}>상담 날짜</div>
            <div className={styles.tableHeaderItem}>최근 수정 날짜</div>
            <button className={styles.actionButton}>+</button>
          </div>
          <div className={styles.cardList}>
            <SessionCard
              key={fakeSession.id}
              session={fakeSession}
              onViewDetails={() => {}}
              onDelete={() => {}}
              onEdit={() => {}}
              isLoading={true}
              isZero={false}
            />
          </div>
        </div>
      ) : (
        <div className={styles.sessionContainer}>
          <div className={styles.tableHeader}>
            <div className={styles.tableHeaderItem}>이름</div>
            <div className={styles.tableHeaderItem}>상담 날짜</div>
            <div className={styles.tableHeaderItem}>최근 수정 날짜</div>
            <button
              className={styles.actionButton}
              onClick={() => setShowModal(true)}
            >
              +
            </button>
          </div>
          <div className={styles.cardList}>
            {sessions.length > 0 ? (
              sessions
                .sort(
                  (a, b) => b.modified_at.getTime() - a.modified_at.getTime()
                )
                .map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onViewDetails={handleViewDetails}
                    onDelete={handleDeleteConfirm}
                    onEdit={handleEditSession}
                    isLoading={false}
                    isZero={false}
                  />
                ))
            ) : (
              <SessionCard
                key={fakeSession.id}
                session={fakeSession}
                onViewDetails={() => {}}
                onDelete={() => {}}
                onEdit={() => {}}
                isLoading={false}
                isZero={true}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDetailPage;
