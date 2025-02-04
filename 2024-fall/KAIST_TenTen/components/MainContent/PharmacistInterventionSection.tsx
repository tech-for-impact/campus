import React from "react";
import { FaTrashAlt } from "react-icons/fa";
import styles from "./PharmacistInterventionSection.module.css";
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

interface PharmacistInterventionSectionProps {
  pharmacistIntervention: any;
  setPharmacistIntervention: React.Dispatch<React.SetStateAction<any>>;
  sessionId: string;
  onAddContent: (content: string) => void;
  topics: Topics;
  pharmacistComment: string;
  setPharmacistComment: React.Dispatch<React.SetStateAction<string>>;
}

const PharmacistInterventionSection: React.FC<
  PharmacistInterventionSectionProps
> = ({
  pharmacistIntervention,
  setPharmacistIntervention,
  sessionId,
  pharmacistComment,
  setPharmacistComment,
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
        body: JSON.stringify({ pharmacist_comments: updatedComments }),
      });

      if (!response.ok) {
        throw new Error("Failed to update pharmacist comments");
      }
      console.log("Pharmacist comments updated successfully");
    } catch (error) {
      console.error("Error updating pharmacist comments:", error);
    }
  };

  const handleAddComment = () => {
    if (pharmacistComment.trim() !== "") {
      const currentComments = pharmacistIntervention.pharmacist_comments || [];
      if (currentComments.includes(pharmacistComment)) {
        alert("이미 존재하는 중재 내용입니다.");
        setPharmacistComment("");
        return;
      }
      const updatedComments = [...currentComments, pharmacistComment];
      setPharmacistIntervention({ pharmacist_comments: updatedComments });
      setPharmacistComment(""); // 입력창 초기화
      updateCommentsOnServer(updatedComments);
    }
  };

  const handleDeleteComment = (index: number) => {
    const currentComments = pharmacistIntervention.pharmacist_comments || [];
    const updatedComments = currentComments.filter((_, i) => i !== index);
    setPharmacistIntervention({ pharmacist_comments: updatedComments });
    updateCommentsOnServer(updatedComments);
  };

  return (
    <>
      <h3 className={styles.sectionTitle}>약사 중재 내용</h3>
      <div className={styles.section}>
        <ul className={styles.interventionList}>
          {pharmacistIntervention.pharmacist_comments.map((comment, index) => (
            <li key={index} className={styles.interventionItem}>
              <span style={{ whiteSpace: "pre-wrap" }}>{comment}</span>
              <button
                className={styles.deleteButton}
                onClick={() => handleDeleteComment(index)} // 삭제 로직 함수로 분리
              >
                <FaTrashAlt />
              </button>
            </li>
          ))}
        </ul>
        <Textarea
          className={styles.textarea}
          value={pharmacistComment}
          onChange={(e) => setPharmacistComment(e.target.value)}
          placeholder="약사 중재 내용을 입력하세요."
        />
        <button className={styles.addButton} onClick={handleAddComment}>
          추가하기
        </button>
      </div>
    </>
  );
};

export default PharmacistInterventionSection;
