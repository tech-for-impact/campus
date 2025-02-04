"use client";

import React, { useState } from "react";
import { FaPencilAlt, FaMicrophone } from "react-icons/fa";
import styles from "./NavigationList.module.css";

interface NavigationListProps {
  activeTab: "firstSession" | "followUp";
  isRecording: boolean;
  isFirstSessionCompleted: boolean;
  onTabChange: (tab: "firstSession" | "followUp") => void;
}

const NavigationList: React.FC<NavigationListProps> = ({
  activeTab,
  isRecording,
  isFirstSessionCompleted,
  onTabChange,
}) => {
  const [selectedId, setSelectedId] = useState<string>("");

  const topics =
    activeTab === "followUp"
      ? [
        { id: "recording", title: "녹음하기" },
        { id: "prescriptionDrugs", title: "처방 의약품" },
        { id: "otcAndSupplements", title: "일반의약품+건강기능식품" },
        { id: "pharmacistIntervention", title: "약사 중재 내용" },
        { id: "careNotes", title: "돌봄 노트" },
      ]
      : [
        { id: "patientInfo", title: "환자 상세 정보" },
        { id: "preQuestions", title: "상담 전 질문" },
        { id: "prescriptionDrugs", title: "처방 의약품" },
        { id: "otcAndSupplements", title: "일반의약품+건강기능식품" },
      ];

  const handleNavigationClick = (id: string) => {
    setSelectedId(id);

    const element = document.getElementById(id);
    if (element) {
      const rootStyles = getComputedStyle(document.documentElement);
      const headerHeight = parseInt(
        rootStyles.getPropertyValue("--header-height"),
        10
      );
      const offsetPosition =
        element.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  /*patientinfocard나중에 다시 추가고려 */
  return (
    <div className={styles.navigationList}>
      <div className={styles.tabHeader}>
        <h2 className={styles.tabTitle}>
          {activeTab === "followUp" ? "약사 상담" : "사전 접수"}
        </h2>

        <div className={styles.tabButtons}>
          <button
            className={
              activeTab === "firstSession"
                ? styles.inactiveButton
                : styles.activeButton
            }
            onClick={() => onTabChange("firstSession")}
          >
            &lt;
          </button>
          <button
            className={
              activeTab === "followUp"
                ? styles.inactiveButton
                : styles.activeButton
            }
            onClick={() => onTabChange("followUp")}
          >
            &gt;
          </button>
        </div>
      </div>
      <ol>
        {topics.map((t) => (
          <li key={t.id} className={styles.navItem}>
            <button
              onClick={() => handleNavigationClick(t.id)}
              className={styles.navButton}
            >
              {t.title}
            </button>
            {selectedId === t.id && <FaPencilAlt className={styles.penIcon} />}
            {t.id === "recording" && isRecording && (
              <FaMicrophone className={styles.recordIcon} />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default NavigationList;
