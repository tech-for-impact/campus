// Header.tsx - 공통 헤더 컴포넌트
// 모든 페이지 상단에 표시되는 로고와 메인 링크

import React from "react";
import styles from "./Header.module.css";

interface HeaderProps {
  activeTab: "firstSession" | "followUp";
  onTabChange: (tab: "firstSession" | "followUp") => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <header className={`${styles.header} bg-white`}>
      <a href="/" className={styles.headertext}>
        TenTen
      </a>
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
    </header>
  );
};

export default Header;
