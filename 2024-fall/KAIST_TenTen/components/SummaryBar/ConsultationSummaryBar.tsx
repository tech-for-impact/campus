import React, { useState } from "react";
import styles from "./ConsultationSummaryBar.module.css";

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

interface ConsultationSummaryBarProps {
  sessionSummary: SessionSummaryItem[];
  onAddContent: (content: string) => void;
}

const ConsultationSummaryBar: React.FC<ConsultationSummaryBarProps> = ({
  sessionSummary,
  onAddContent,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className={styles.summaryBar}>
      <h2 className={styles.title}>요약된 상담 내용</h2>
      {sessionSummary.map((item, index) => (
        <div key={item.topic_id} className={styles.summaryItem}>
          <div className={styles.summaryHeader}>
            <div className={styles.summaryContent}>{item.content}</div>
            <div className={styles.buttons}>
              <button
                onClick={() => toggleExpand(index)}
                className={styles.expandButton}
              >
                {expandedIndex === index ? "접기 ▲" : "펼치기 ▼"}
              </button>
              <button
                onClick={() => onAddContent(item.content)}
                className={styles.addButton}
              >
                추가하기
              </button>
            </div>
          </div>
          {expandedIndex === index && (
            <div className={styles.relatedScripts}>
              {item.related_scripts.map((script, scriptIndex) => (
                <div key={scriptIndex} className={styles.scriptItem}>
                  <p>
                    <strong>{script.time}:</strong> {script.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ConsultationSummaryBar;
