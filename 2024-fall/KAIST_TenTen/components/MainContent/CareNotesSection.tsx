import React from "react";
import { FaTrashAlt } from "react-icons/fa";
import styles from "./CareNotesSection.module.css";

import { Textarea } from "flowbite-react";

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

interface CareNotesInterventionSectionProps {
  careNote: any;
  setCareNote: React.Dispatch<React.SetStateAction<any>>;
  sessionId: string;
  onAddContent: (content: string) => void;
  topics: Topics;
  careNoteComment: string;
  setCareNoteComment: React.Dispatch<React.SetStateAction<string>>;
}

const CareNotesInterventionSection: React.FC<
  CareNotesInterventionSectionProps
> = ({
  careNote,
  setCareNote,
  sessionId,
  careNoteComment,
  setCareNoteComment,
  onAddContent,
  topics,
}) => {
  const updateCommentsOnServer = async (updatedComments: string[]) => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ care_note: updatedComments }),
      });

      if (!response.ok) {
        throw new Error("Failed to update care note comments");
      }
      console.log("Care note comments updated successfully");
    } catch (error) {
      console.error("Error updating care note comments:", error);
    }
  };

  const handleAddComment = () => {
    if (careNoteComment.trim() !== "") {
      const currentComments = careNote.care_note || [];
      if (currentComments.includes(careNoteComment)) {
        alert("이미 존재하는 중재 내용입니다.");
        setCareNoteComment("");
        return;
      }
      const updatedComments = [...currentComments, careNoteComment];
      setCareNote({ care_note: updatedComments });
      setCareNoteComment(""); // 입력창 초기화
      updateCommentsOnServer(updatedComments);
    }
  };

  const handleDeleteComment = (index: number) => {
    const currentComments = careNote.care_note || [];
    const updatedComments = currentComments.filter((_, i) => i !== index);
    setCareNote({ care_note: updatedComments });
    updateCommentsOnServer(updatedComments);
  };

  return (
    <>
      <h3 className={styles.sectionTitle}>돌봄 노트</h3>
      <div className={styles.section}>
        <ul className={styles.interventionList}>
          {careNote.care_note.map((comment, index) => (
            <li key={index} className={styles.interventionItem}>
              <span style={{ whiteSpace: "pre-wrap" }}>{comment}</span>
              <button
                className={styles.deleteButton}
                onClick={() => handleDeleteComment(index)}
              >
                <FaTrashAlt />
              </button>
            </li>
          ))}
        </ul>
        <Textarea
          className={styles.textarea}
          value={careNoteComment}
          onChange={(e) => setCareNoteComment(e.target.value)}
          placeholder="돌봄 노트 내용을 입력하세요."
        />
        <button className={styles.addButton} onClick={handleAddComment}>
          추가하기
        </button>
      </div>
    </>
  );
};

export default CareNotesInterventionSection;
