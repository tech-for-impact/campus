import React from "react";
import styles from "./PersonalInfoSection.module.css";

import {
  TextInput,
  Datepicker,
  Label,
  Radio,
  Textarea,
  Checkbox,
  Button,
} from "flowbite-react";

const PersonalInfoLoading: React.FC = () => {
  return (
    <div className={styles.section}>
      <div className={styles.subSection}>
        <div className="grid grid-cols-3 gap-4">
          <div className={styles.infoItem}>
            <label className={styles.label}>참여자 성명</label>
            <TextInput type="text" placeholder="성명" />
          </div>
          <div className={styles.infoItem}>
            <label className={styles.label}>생년월일</label>
            <TextInput type="text" placeholder="0000-00-00" />
          </div>
          <div className={styles.infoItem}>
            <label className={styles.label}>연락처</label>
            <TextInput type="text" placeholder="0100000000" />
          </div>
        </div>
        <div className={styles.infoItem}>
          <label className={styles.label}>의료보장형태</label>
          <div className={styles.radioContainer}>
            {["건강보험", "의료급여", "보훈", "비급여"].map((option) => (
              <div key={option} className="flex items-center gap-2">
                <Radio
                  id={`insurance-option-${option}`}
                  name="insurance_type"
                  value={option}
                />
                <Label htmlFor={`insurance-option-${option}`}>{option}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.subSection}>
        <div className="grid grid-cols-3 gap-4">
          <div className={styles.infoItem}>
            <label className={styles.label}>최초 상담일</label>
            <Datepicker
              language="ko"
              labelTodayButton="오늘"
              labelClearButton="리셋"
            />
          </div>
          <div className={styles.infoItem}>
            <label className={styles.label}>상담일</label>
            <Datepicker
              language="ko"
              labelTodayButton="오늘"
              labelClearButton="리셋"
            />
          </div>
        </div>
        <div className={styles.infoItem}>
          <label className={styles.label}>상담 차수</label>
          <TextInput type="text" placeholder="내용을 입력하세요" />
        </div>
        <div className={styles.infoItem}>
          <label className={styles.label}>상담 약사</label>
          {Array.from({ length: 3 }).map((_, index) => (
            <TextInput
              key={index}
              type="text"
              placeholder={`약사 ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className={styles.subSection}>
        <div className={styles.infoItem}>
          <label className={styles.label}>앓고 있는 질병</label>
          <div className={`${styles.checkboxContainer} grid grid-cols-3`}>
            {[
              "고혈압",
              "고지혈증",
              "뇌혈관질환",
              "심장질환",
              "당뇨병",
              "갑상선질환",
              "위장관질환",
              "파킨슨",
              "척추·관절염/신경통·근육통",
              "수면장애",
              "우울증/불안장애",
              "치매,인지장애",
              "비뇨·생식기질환(전립선비대증,자궁내막염,방광염 등)",
              "신장질환",
              "호흡기질환(천식,COPD 등)",
              "안질환(백내장,녹내장,안구건조증 등)",
              "이비인후과(만성비염, 만성중이염 등)",
              "암질환",
              "간질환",
              "뇌경색",
            ].map((option) => (
              <div key={option} className="flex items-center gap-2">
                <Checkbox id={`chronic-disease-${option}`} />
                <Label htmlFor={`chronic-disease-${option}`}>{option}</Label>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.infoItem}>
          <label className={styles.label}>기타 질병</label>
          <TextInput type="text" placeholder="내용을 입력하세요" />
        </div>
        <div className={styles.infoItem}>
          <label className={`${styles.label} mt-6`}>
            과거 질병 및 수술 이력
          </label>
          <Textarea placeholder="내용을 입력하세요" />
        </div>
        <div className={styles.infoItem}>
          <label className={styles.label}>주요 불편한 증상</label>
          <Textarea placeholder="내용을 입력하세요" />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoLoading;
