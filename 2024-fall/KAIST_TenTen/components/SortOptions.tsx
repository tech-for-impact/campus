// SortOptions.tsx - 정렬 옵션 컴포넌트
// 정렬 기준을 선택해 상위 컴포넌트로 전달

"use client";

import React from "react";
import styles from "./SortOptions.module.css";

interface SortOptionsProps {
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

const SortOptions: React.FC<SortOptionsProps> = ({ options, onChange }) => (
  <select
    className={styles.sortOptions}
    onChange={(e) => onChange(e.target.value)}
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

export default SortOptions;
