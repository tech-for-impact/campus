// src/App.jsx
import React from 'react';
import './styles.scss'; // 전역 스타일 import
import styles from './styles.module.scss'; // SCSS 모듈 import

function ScssTest() {
  return (
    <div>
      <header>
        <h1>SCSS 기능 예제</h1>
      </header>

      <div className="container">
        <button className={styles.button}>Click Me</button>
      </div>
    </div>
  );
}

export default ScssTest;
