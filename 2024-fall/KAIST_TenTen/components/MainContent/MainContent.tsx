"use client";

import React, { useEffect } from "react";
import PersonalInfoSection from "./PersonalInfoSection";
import PreQuestionsSection from "./PreQuestionsSection";
import PrescriptionDrugsSection from "./PrescriptionDrugsSection";
import SupplementsSection from "./supplementsSection";
import OTCSection from "./OTCSection";
import CareNotesSection from "./CareNotesSection";
import PharmacistInterventionSection from "./PharmacistInterventionSection";
import RecordingSection from "./RecordingSection";
import FakeRecordingSection from "./FakeRecordingSection";
import styles from "./MainContent.module.css";

interface RelatedScript {
  time: string;
  content: string;
}

interface SessionSummaryItem {
  topic_id: number;
  start_time: string;
  end_time: string;
  content: string;
  related_scripts: RelatedScript[];
}

type Topics = SessionSummaryItem[];

interface MainContentProps {
  isFollowUp: boolean;
  onCompleteFirstSession: () => void;
  onRecordingStatusChange: (isRecording: boolean) => void;
  patientInfo: any;
  setPatientInfo: React.Dispatch<React.SetStateAction<any>>;
  preQuestions: any;
  setPreQuestions: React.Dispatch<React.SetStateAction<any>>;
  sessionId: string | null;
  medicationList: any;
  setMedicationList: React.Dispatch<React.SetStateAction<any>>;
  careNote: any;
  setCareNote: React.Dispatch<React.SetStateAction<any>>;
  pharmacistIntervention: any;
  setPharmacistIntervention: React.Dispatch<React.SetStateAction<any>>;
  pharmacistComment: string;
  setPharmacistComment: React.Dispatch<React.SetStateAction<string>>;
  careNoteComment: string;
  setCareNoteComment: React.Dispatch<React.SetStateAction<string>>;
  topics: Topics;
}

const MainContent: React.FC<MainContentProps> = ({
  isFollowUp,
  onCompleteFirstSession,
  onRecordingStatusChange,
  patientInfo,
  setPatientInfo,
  preQuestions,
  setPreQuestions,
  sessionId,
  medicationList,
  setMedicationList,
  careNote,
  setCareNote,
  pharmacistIntervention,
  setPharmacistIntervention,
  pharmacistComment,
  setPharmacistComment,
  careNoteComment,
  setCareNoteComment,
  topics,
}) => {
  const handleAddContent = (content: string) => {
    // console.log("추가된 content:", content);
  };

  useEffect(() => {
    // isFollowUp이 변경될 때 스크롤 위치를 맨 위로 이동
    window.scrollTo(0, 0);
  }, [isFollowUp]);

  return (
    <div className={styles.mainContent}>
      {!isFollowUp && (
        <>
          <section id="patientInfo" className={styles.section}>
            <PersonalInfoSection
              patientInfo={patientInfo}
              setPatientInfo={setPatientInfo}
              sessionId={sessionId}
            />
          </section>
          <section id="preQuestions" className={styles.section}>
            <PreQuestionsSection
              preQuestions={preQuestions}
              setPreQuestions={setPreQuestions}
              sessionId={sessionId}
            />
          </section>
          <section id="prescriptionDrugs" className={styles.section}>
            <PrescriptionDrugsSection
              medicationList={medicationList}
              setMedicationList={setMedicationList}
              sessionId={sessionId}
            />
          </section>
          <section id="otc" className={styles.section}>
            <OTCSection
              medicationList={medicationList}
              setMedicationList={setMedicationList}
              sessionId={sessionId}
            />
          </section>
          <section id="supplements" className={styles.section}>
            <SupplementsSection
              medicationList={medicationList}
              setMedicationList={setMedicationList}
              sessionId={sessionId}
            />
          </section>
          <button
            className={styles.completeButton}
            onClick={onCompleteFirstSession}
          >
            사전 접수 완료
          </button>
        </>
      )}

      {isFollowUp && (
        <>
          {/* 기존 RecordingSection 주석 처리 */}

          {/* <section id="recording" className={styles.section}>
            <RecordingSection
              onRecordingStatusChange={onRecordingStatusChange}
              sessionId={sessionId ?? "임시ID"}
            />
          </section> */}

          <section id="recording" className={styles.section}>
            <FakeRecordingSection />
          </section>
          <section id="prescriptionDrugs" className={styles.section}>
            <PrescriptionDrugsSection
              medicationList={medicationList}
              setMedicationList={setMedicationList}
              sessionId={sessionId}
            />
          </section>
          <section id="otc" className={styles.section}>
            <OTCSection
              medicationList={medicationList}
              setMedicationList={setMedicationList}
              sessionId={sessionId}
            />
          </section>
          <section id="supplements" className={styles.section}>
            <SupplementsSection
              medicationList={medicationList}
              setMedicationList={setMedicationList}
              sessionId={sessionId}
            />
          </section>
          <section id="pharmacistIntervention" className={styles.section}>
            <PharmacistInterventionSection
              pharmacistIntervention={pharmacistIntervention}
              setPharmacistIntervention={setPharmacistIntervention}
              sessionId={sessionId}
              onAddContent={handleAddContent}
              pharmacistComment={pharmacistComment}
              setPharmacistComment={setPharmacistComment}
              topics={topics}
            />
          </section>
          <section id="careNotes" className={styles.section}>
            <CareNotesSection
              careNote={careNote}
              setCareNote={setCareNote}
              sessionId={sessionId}
              onAddContent={handleAddContent}
              topics={topics}
              careNoteComment={careNoteComment}
              setCareNoteComment={setCareNoteComment}
            />
          </section>
          <button
            className={styles.completeButton}
            onClick={onCompleteFirstSession}
          >
            상담 완료
          </button>
        </>
      )}
    </div>
  );
};

export default MainContent;
