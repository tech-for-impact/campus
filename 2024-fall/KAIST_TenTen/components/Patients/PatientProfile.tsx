import React from "react";
import styles from "./PatientProfile.module.css";
import {
  FaPhone,
  FaBirthdayCake,
  FaVenusMars,
  FaBuilding,
  FaFileAlt,
  FaSms,
  FaHistory,
} from "react-icons/fa";
import { Spinner } from "flowbite-react";
import { useState } from "react";
import { Button, Modal, Carousel } from "flowbite-react";

interface Patient {
  id: string;
  name: string;
  date_of_birth: Date;
  gender: string;
  phone_number: string;
  organization: string;
  created_at: Date;
  modified_at: Date;
}

interface PatientProfileProps {
  patient: Patient;
  isLoading: boolean;
}

const PatientProfile: React.FC<PatientProfileProps> = ({
  patient,
  isLoading,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState<string | null>(null);

  // 모달 열기 함수
  const handleOpenModal = (content: string) => {
    setModalContent(content); // 클릭한 버튼의 내용을 설정
    setOpenModal(true); // 모달 열기
  };

  // 모달 닫기 함수
  const handleCloseModal = () => {
    setModalContent(null); // 모달 내용 초기화
    setOpenModal(false); // 모달 닫기
  };

  return isLoading ? (
    <div className={styles.profileContainer}>
      <div className={styles.imageContainer}>
        <img
          src="/images/old_woman_color_light.svg"
          className={styles.profileImage}
          alt="환자 프로필 이미지"
        />
      </div>
      <div className={styles.profileInfo}>
        <div className="flex gap-4 items-center">
          <Spinner className={styles.loadingTitle} color="gray" />
          <h2 className={styles.profileName}>{patient.name}</h2>
        </div>
        <p className={styles.profilePhone}>
          <FaPhone className={styles.icon} />
          {patient.phone_number}
        </p>
        <div className={styles.profileDetailsRow}>
          <div className={styles.profileDetail}>
            <FaBirthdayCake className={styles.icon} />
            {patient.date_of_birth.toISOString().split("T")[0]}
          </div>
          <div className={styles.profileDetail}>
            <FaVenusMars className={styles.icon} />
            {patient.gender}
          </div>
          <div className={styles.profileDetail}>
            <FaBuilding className={styles.icon} />
            {patient.organization}
          </div>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.actionButton}>
          <FaFileAlt className={styles.buttonIcon} />
          한글 출력
        </button>
        <button className={styles.actionButton}>
          <FaSms className={styles.buttonIcon} />
          문자 전송
        </button>
        <button className={styles.actionButton}>
          <FaHistory className={styles.buttonIcon} />
          히스토리
        </button>
      </div>
    </div>
  ) : (
    <>
      <div className={styles.profileContainer}>
        <div className={styles.imageContainer}>
          <img
            src="/images/old_woman_color_light.svg"
            className={styles.profileImage}
            alt="환자 프로필 이미지"
          />
        </div>
        <div className={styles.profileInfo}>
          <h2 className={styles.profileName}>{patient.name}</h2>
          <p className={styles.profilePhone}>
            <FaPhone className={styles.icon} />
            {patient.phone_number}
          </p>
          <div className={styles.profileDetailsRow}>
            <div className={styles.profileDetail}>
              <FaBirthdayCake className={styles.icon} />
              {patient.date_of_birth.toISOString().split("T")[0]}
            </div>
            <div className={styles.profileDetail}>
              <FaVenusMars className={styles.icon} />
              {patient.gender}
            </div>
            <div className={styles.profileDetail}>
              <FaBuilding className={styles.icon} />
              {patient.organization}
            </div>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button
            className={styles.actionButton}
            onClick={() => handleOpenModal("한글 출력")}
          >
            <FaFileAlt className={styles.buttonIcon} />
            한글 출력
          </button>
          <button
            className={styles.actionButton}
            onClick={() => handleOpenModal("문자 전송")}
          >
            <FaSms className={styles.buttonIcon} />
            문자 전송
          </button>
          <button
            className={styles.actionButton}
            onClick={() => handleOpenModal("히스토리")}
          >
            <FaHistory className={styles.buttonIcon} />
            히스토리
          </button>
        </div>
      </div>

      {/* 모달 */}
      <Modal
        dismissible
        show={openModal}
        onClose={() => setOpenModal(false)}
        className={styles.modal}
      >
        <Modal.Header>
          {modalContent === "문자 전송" && (
            <p>상담 회차 선택 후 문자로 전송할 pdf 파일의 예시입니다.</p>
          )}
          {modalContent === "한글 출력" && (
            <p>한글 출력 기능은 현재 개발중입니다.</p>
          )}
          {modalContent === "히스토리" && <p>기능 개발 중</p>}
        </Modal.Header>
        {modalContent === "문자 전송" && (
          <Modal.Body className={styles.modalBody}>
            <div className={styles.carouselContainer}>
              <Carousel slide={false}>
                <img
                  src="/images/sendSession_1.png"
                  alt="First slide"
                  className={styles.carouselImage}
                />
                <img
                  src="/images/sendSession_2.png"
                  alt="Second slide"
                  className={styles.carouselImage}
                />
              </Carousel>
            </div>
          </Modal.Body>
        )}
        {modalContent === "한글 출력" && (
          <Modal.Body className={styles.modalBody}>
            <div className={styles.carouselContainer}>
              <Carousel slide={false}>
                <img
                  src="/images/hwpFile.png"
                  alt="Hwp slide"
                  className={styles.hwpImage}
                />
              </Carousel>
            </div>
          </Modal.Body>
        )}

        {modalContent === "히스토리" && (
          <Modal.Body>
            <p>
              히스토리 기능은 아직 개발 진척도가 낮습니다. 추후 업데이트
              예정입니다.
            </p>
          </Modal.Body>
        )}
        <Modal.Footer className="flex justify-end">
          <Button onClick={() => setOpenModal(false)}>닫기</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PatientProfile;
