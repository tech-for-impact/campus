// MainPage.tsx - 메인 페이지 컴포넌트
// 전체 페이지 레이아웃과 환자 리스트 포함

import React from "react";
import Header from "../components/Header/Header";
import PatientsListPage from "../components/Patients/PatientsListPage";
import styles from "./MainPage.module.css";

const MainPage: React.FC = () => {
  return (
    <div className={styles.mainPage}>
      <Header />
      <PatientsListPage />
    </div>
  );
};

export default MainPage;
