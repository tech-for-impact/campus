// components/DeleteModal.tsx
import React from "react";
import styles from "./DeleteModal.module.css";

interface DeleteModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  deleteName: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  onConfirm,
  onCancel,
  deleteName,
}) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2
          className={styles.modalTitle}
        >{`${deleteName}를 삭제하시겠습니까?`}</h2>
        <p className={styles.modalMessage}>
          한 번 삭제한 정보는 복구할 수 없습니다.
        </p>
        <div className={styles.buttonContainer}>
          <button onClick={onConfirm} className={styles.confirmButton}>
            확인
          </button>
          <button onClick={onCancel} className={styles.cancelButton}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
