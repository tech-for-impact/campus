import React from "react";
import styles from "./FirstSessionSummary.module.css";

import { Button, Tabs } from "flowbite-react";
import type { CustomFlowbiteTheme } from "flowbite-react";
import { Flowbite } from "flowbite-react";
import { Accordion, ListGroup } from "flowbite-react";
import { HiUserCircle, HiClipboardList, HiAdjustments } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";

const customTab: CustomFlowbiteTheme = {
  tabs: {
    base: "flex flex-col gap-2",
    tablist: {
      base: "flex text-center",
      variant: {
        default: "flex-wrap border-b border-gray-200 dark:border-gray-700",
        underline:
          "-mb-px flex-wrap border-b border-gray-200 dark:border-gray-700",
        pills:
          "flex-wrap space-x-2 text-sm font-medium text-gray-500 dark:text-gray-400",
        fullWidth:
          "grid w-full grid-flow-col divide-x divide-gray-200 rounded-none text-sm font-medium shadow dark:divide-gray-700 dark:text-gray-400",
      },
      tabitem: {
        base: "flex items-center justify-center rounded-t-lg p-4 text-sm font-medium first:ml-0 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500",
        variant: {
          default: {
            base: "rounded-t-lg",
            active: {
              on: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-500",
              off: "text-gray-500 hover:bg-gray-50 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300",
            },
          },
          underline: {
            base: "rounded-t-lg",
            active: {
              on: "active rounded-t-lg border-b-2 border-cyan-600 text-cyan-600 dark:border-cyan-500 dark:text-gray-500",
              off: "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300",
            },
          },
          pills: {
            base: "",
            active: {
              on: "rounded-lg bg-gray-600 text-white",
              off: "rounded-lg hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white",
            },
          },
          fullWidth: {
            base: "ml-0 flex w-full rounded-none first:ml-0",
            active: {
              on: "active rounded-none bg-gray-100 p-4 text-gray-900 dark:bg-gray-700 dark:text-white",
              off: "rounded-none bg-white hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white",
            },
          },
        },
        icon: "mr-2 h-5 w-5",
      },
    },
    tabitemcontainer: {
      base: "",
      variant: {
        default: "",
        underline: "",
        pills: "",
        fullWidth: "",
      },
    },
    tabpanel: "my-3",
  },
};

interface PreQuestions {
  questions?: {
    list: string[];
  };
}

interface RecordingItem {
  id: string;
  s3_url: string;
  topic_status: string;
  stt_status: string;
  created_at: string;
}

interface FirstSessionSummaryProps {
  patientInfo: any;
  preQuestions: PreQuestions;
  sessionSummaryData: { topic_id: number; content: string }[];
  recentRecording: RecordingItem;
  pharmacistComment: string;
  setPharmacistComment: React.Dispatch<React.SetStateAction<string>>;
  careNoteComment: string;
  setCareNoteComment: React.Dispatch<React.SetStateAction<string>>;
}

const session_summary = [
  {
    question_time: "51분 10초~51분 49초",
    question: "간염 약의 부작용과 복용 시 주의사항은 무엇인가요?",
    patient_statement:
      "환자는 간염 보유자로서 장기간 약을 복용 중이며, 약의 부작용과 복용 시 주의사항에 대해 궁금해함.",
    pharmacist_response: [
      {
        summary:
          "간염 약의 주요 부작용은 내성입니다. 약은 바이러스 증식을 억제하며, 내성이 생기면 다른 약으로 변경해야 할 수 있습니다.",
        quotes: [
          {
            time: "52분 3초",
            content:
              "이 약의 대표적인 부작용은 내성입니다. 바이러스를 억제하는 것이 치료의 핵심입니다.",
          },
          {
            time: "53분 28초",
            content:
              "지금은 억제가 잘 되고 있고, 한 가지 약으로 유지되고 있다는 것은 치료가 잘 되고 있다는 것입니다.",
          },
        ],
      },
    ],
  },
  {
    question_time: "53분 53초~54분 56초",
    question: "장기간 약 복용이 신체에 미치는 영향은 무엇인가요?",
    patient_statement:
      "환자는 장기간 동일한 약을 복용하는 것이 신체에 미치는 영향에 대해 궁금해함.",
    pharmacist_response: [
      {
        summary:
          "장기간 약 복용은 신체 대사에 부담을 주어 노화를 촉진할 수 있습니다. 그러나 약을 복용하지 않으면 간 손상이 더 심해질 수 있습니다.",
        quotes: [
          {
            time: "54분 8초",
            content:
              "약을 복용하면 대사 과정에 부담이 가해져 노화가 더 빨리 올 수 있습니다.",
          },
          {
            time: "55분 17초",
            content:
              "약을 안 먹었을 때는 더 급격히 안 좋아지기 때문에 복용하는 것이지만, 노화는 더 빨리 올 수 있습니다.",
          },
        ],
      },
    ],
  },
  {
    question_time: "59분 59초~60분 36초",
    question: "간염 보유자가 피해야 할 영양제는 무엇인가요?",
    patient_statement:
      "환자는 간염 보유자로서 피해야 할 영양제에 대해 궁금해함.",
    pharmacist_response: [
      {
        summary:
          "간염 보유자는 특별히 피해야 할 영양제는 없으며, 항산화 영양제를 꾸준히 섭취하는 것이 좋습니다.",
        quotes: [
          {
            time: "60분 36초",
            content:
              "간에 영향을 주는 영양제는 특별히 없으며, 항산화 영양제를 꾸준히 드시는 것이 좋습니다.",
          },
          {
            time: "61분 27초",
            content: "오메가-3와 같은 필수 영양소도 섭취하는 것이 좋습니다.",
          },
        ],
      },
    ],
  },
  {
    question_time: "62분 22초~63분 41초",
    question: "한약이 간에 미치는 영향은 무엇인가요?",
    patient_statement:
      "환자는 한약이 간에 미치는 부정적인 영향에 대해 궁금해함.",
    pharmacist_response: [
      {
        summary:
          "현대 한약은 성분이 명확하게 밝혀지고, 간 수치에 영향을 덜 미치는 방향으로 개선되었습니다.",
        quotes: [
          {
            time: "62분 41초",
            content:
              "예전에는 한약재의 성분이 명확하지 않아 간 수치가 올라갈 때 대처가 어려웠지만, 현재는 데이터가 축적되고 있어 더 안전한 처방이 이루어지고 있습니다.",
          },
          {
            time: "63분 41초",
            content:
              "한약의 추출물은 성분이 많아 간에 부담이 될 가능성이 큽니다.",
          },
        ],
      },
    ],
  },
];

const FirstSessionSummary: React.FC<FirstSessionSummaryProps> = ({
  patientInfo,
  preQuestions,
  sessionSummaryData,
  pharmacistComment,
  setPharmacistComment,
  careNoteComment,
  setCareNoteComment,
}) => {
  const formatSessionSummary = (entry) => {
    const { question, pharmacist_response } = entry;
    const formattedSummary = [
      `Q : ${question}`, // "Q : "를 추가
      "", // 한 줄 띄우기
      ...pharmacist_response.map((response) => `A : ${response.summary}`), // "A : "를 추가
    ].join("\n");

    return formattedSummary;
  };

  const handleAddToComment = (text: string, isCareNote: boolean) => {
    if (text.trim()) {
      if (isCareNote) {
        setCareNoteComment((prev) =>
          prev ? `${prev}\n${text.trim()}` : text.trim()
        );
      } else {
        setPharmacistComment((prev) =>
          prev ? `${prev}\n${text.trim()}` : text.trim()
        );
      }
    }
  };

  return (
    <div className={styles.summaryContainer}>
      <Flowbite theme={{ theme: customTab }}>
        <Tabs aria-label="Tabs with icons" variant="underline">
          <Tabs.Item
            active
            title="상담 요약"
            icon={HiUserCircle}
            className={styles.summaryTab}
          >
            <div className={styles.scrollableContent}>
              <div className="flex flex-col gap-4">
                {/* 환자 개인 정보 */}
                <Accordion alwaysOpen={false} className={styles.accordion}>
                  <Accordion.Panel
                    className={styles.accordionPanel}
                    isOpen={false}
                  >
                    <Accordion.Title className={styles.accordionTitle}>
                      환자 개인 정보
                    </Accordion.Title>
                    <Accordion.Content className={styles.accordionContent}>
                      <div className={styles.listItem}>
                        <span className={styles.boldTitle}>질병 목록:</span>
                        <span>
                          {Array.isArray(
                            patientInfo.medical_conditions?.chronic_diseases
                              .disease_names
                          ) &&
                          patientInfo.medical_conditions.chronic_diseases
                            .disease_names.length > 0
                            ? patientInfo.medical_conditions.chronic_diseases.disease_names.join(
                                ", "
                              )
                            : "없음"}
                        </span>
                      </div>
                      <div className={styles.listItem}>
                        <span className={styles.boldTitle}>
                          과거 질병 및 수술 이력:
                        </span>
                        <span>
                          {patientInfo.medical_conditions?.medical_history ||
                            "없음"}
                        </span>
                      </div>
                      <div className={styles.listItem}>
                        <span className={styles.boldTitle}>
                          주요 불편한 증상:
                        </span>
                        <span>
                          {patientInfo.medical_conditions?.symptoms || "없음"}
                        </span>
                      </div>
                      {patientInfo.medical_conditions?.allergies
                        .has_allergies === "예" && (
                        <div className={styles.listItem}>
                          <span className={styles.boldTitle}>알러지:</span>
                          <span>
                            {patientInfo.medical_conditions.allergies
                              .has_allergies === "예"
                              ? `의심 항목: ${patientInfo.medical_conditions.allergies.suspected_items}`
                              : "없음"}
                          </span>
                        </div>
                      )}
                      {patientInfo.medical_conditions?.adverse_drug_reactions
                        .has_adverse_drug_reactions === "예" && (
                        <div className={styles.listItem}>
                          <span className={styles.boldTitle}>약물 부작용:</span>
                          <span>
                            {patientInfo.medical_conditions
                              .adverse_drug_reactions
                              .has_adverse_drug_reactions === "예"
                              ? `의심 약물: ${patientInfo.medical_conditions.adverse_drug_reactions.suspected_medications}, 증상: ${patientInfo.medical_conditions.adverse_drug_reactions.reaction_details}`
                              : "없음"}
                          </span>
                        </div>
                      )}
                      {patientInfo.lifestyle?.smoking.is_smoking === "예" && (
                        <div className={styles.listItem}>
                          <span className={styles.boldTitle}>흡연:</span>
                          <span>
                            {patientInfo.lifestyle.smoking.is_smoking === "예"
                              ? `흡연 기간: ${patientInfo.lifestyle.smoking.duration_in_years}년, 평균 흡연량: ${patientInfo.lifestyle.smoking.pack_per_day}갑`
                              : "비흡연"}
                          </span>
                        </div>
                      )}
                      {patientInfo.lifestyle?.alcohol.is_drinking === "예" && (
                        <div className={styles.listItem}>
                          <span className={styles.boldTitle}>음주:</span>
                          <span>
                            {patientInfo.lifestyle.alcohol.is_drinking === "예"
                              ? `주 ${patientInfo.lifestyle.alcohol.drinks_per_week}회, 음주량: ${patientInfo.lifestyle.alcohol.amount_per_drink}`
                              : "비음주"}
                          </span>
                        </div>
                      )}
                      <div className={styles.listItem}>
                        <span className={styles.boldTitle}>운동:</span>
                        <span>
                          {patientInfo.lifestyle?.exercise.is_exercising ===
                          "예"
                            ? `${
                                patientInfo.lifestyle.exercise
                                  .exercise_frequency
                              }, 운동 종류: ${
                                patientInfo.lifestyle.exercise.exercise_types
                                  ? patientInfo.lifestyle.exercise
                                      .exercise_types
                                  : "없음"
                              }`
                            : "운동 안 함"}
                        </span>
                      </div>
                      <div className={styles.listItem}>
                        <span className={styles.boldTitle}>영양:</span>
                        <span>
                          {patientInfo.lifestyle?.diet.is_balanced_meal === "예"
                            ? `균형 잡힌 식사 ${patientInfo.lifestyle.diet.balanced_meals_per_day}`
                            : "불규칙한 식사"}
                        </span>
                      </div>
                    </Accordion.Content>
                  </Accordion.Panel>
                </Accordion>

                {/* 사전 상담 질문 */}
                <Accordion alwaysOpen={true} className={styles.accordion}>
                  <Accordion.Panel isOpen={false}>
                    <Accordion.Title className={styles.accordionTitle}>
                      사전 상담 질문
                    </Accordion.Title>
                    <Accordion.Content className={styles.accordionContent}>
                      {Array.isArray(preQuestions.questions?.list) &&
                      preQuestions.questions.list.length > 0 ? (
                        preQuestions.questions.list.map((question, index) => (
                          <p key={index} className={styles.questionList}>
                            {question}
                          </p>
                        ))
                      ) : (
                        <p>질문 없음</p>
                      )}
                    </Accordion.Content>
                  </Accordion.Panel>
                </Accordion>

                <Accordion alwaysOpen={true} className={styles.accordion}>
                  <Accordion.Panel alwaysOpen={true}>
                    <Accordion.Title className={styles.outerAccordionTitle}>
                      상담 녹음 요약
                    </Accordion.Title>
                    {/* 상담 녹음 요약 */}
                    <Accordion.Content className={styles.outerAccordionContent}>
                      {session_summary.map((entry, idx) => (
                        <Accordion
                          alwaysOpen={true}
                          className={styles.innerAccordion}
                        >
                          <Accordion.Panel
                            key={idx}
                            className={styles.innerAccordionPanel}
                          >
                            <Accordion.Title
                              className={styles.innerAccordionTitle}
                            >
                              {`Q : ${entry.question}`}
                            </Accordion.Title>
                            <Accordion.Content>
                              <div>
                                {/* 환자 발언 요약 */}
                                <div className={styles.questionSection}>
                                  <p>{entry.patient_statement}</p>
                                  <div className={styles.quoteContainer}>
                                    {entry.pharmacist_response[0].quotes.map(
                                      (quote, idx) => (
                                        <div
                                          key={idx}
                                          className={styles.quoteBox}
                                        >
                                          <blockquote
                                            className={styles.quoteText}
                                          >
                                            "{quote.content}"
                                          </blockquote>
                                          <span className={styles.timestamp}>
                                            {quote.time}
                                          </span>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>

                                {/* 약사 답변 요약 */}
                                <div className={`${styles.answerSummary} mt-4`}>
                                  <p className={styles.boldLabel}>
                                    약사 답변 요약:
                                  </p>
                                  {entry.pharmacist_response.map(
                                    (response, idx) => (
                                      <div
                                        key={idx}
                                        className={styles.answerPoint}
                                      >
                                        {response.summary}
                                        {response.quotes && (
                                          <div
                                            className={styles.quoteContainer}
                                          >
                                            {response.quotes.map(
                                              (quote, quoteIdx) => (
                                                <div
                                                  key={quoteIdx}
                                                  className={styles.quoteBox}
                                                >
                                                  <blockquote
                                                    className={styles.quoteText}
                                                  >
                                                    "{quote.content}"
                                                  </blockquote>
                                                  <span
                                                    className={styles.timestamp}
                                                  >
                                                    {quote.time}
                                                  </span>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    )
                                  )}
                                </div>

                                {/*추가 버튼*/}
                                <div className={styles.buttonRow}>
                                  <button
                                    onClick={() => {
                                      const formattedText =
                                        formatSessionSummary(entry);
                                      handleAddToComment(formattedText, false);
                                    }}
                                    className={styles.addButton}
                                  >
                                    + 중재노트
                                  </button>
                                  <button
                                    onClick={() => {
                                      const formattedText =
                                        formatSessionSummary(entry);
                                      handleAddToComment(formattedText, true);
                                    }}
                                    className={styles.addButton}
                                  >
                                    + 돌봄노트
                                  </button>
                                </div>
                              </div>
                            </Accordion.Content>
                          </Accordion.Panel>
                        </Accordion>
                      ))}
                    </Accordion.Content>
                  </Accordion.Panel>
                </Accordion>
              </div>
            </div>
          </Tabs.Item>

          <Tabs.Item title="대화 내용" icon={MdDashboard}>
            <div className={styles.scrollableContent}>
              <p>대화 내용 준비 중...</p>
            </div>
          </Tabs.Item>
        </Tabs>
      </Flowbite>
    </div>
  );
};

export default FirstSessionSummary;
