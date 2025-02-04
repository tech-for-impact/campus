import React, { useState, useRef, useEffect } from "react";
import styles from "./PatientAddModal.module.css";

interface Patient {
  id?: string;
  name: string;
  date_of_birth: Date;
  gender: string;
  phone_number?: string;
  organization: string;
  created_at: Date;
  modified_at: Date;
}

interface PatientAddModalProps {
  patient?: Patient;
  isEditMode?: boolean;
  onClose: () => void;
  onSubmit: (patientData: Patient) => void;
}

const PatientAddModal: React.FC<PatientAddModalProps> = ({
  patient,
  isEditMode = false,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [organization, setOrganization] = useState("");
  const [createdAt, setCreatedAt] = useState<Date>(new Date());
  const [modifiedAt, setModifiedAt] = useState<Date>(new Date());
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const monthRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditMode && patient) {
      setName(patient.name);
      setGender(patient.gender);
      setPhoneNumber(patient.phone_number || "");
      setOrganization(patient.organization);
      setCreatedAt(patient.created_at);
      setModifiedAt(patient.modified_at);

      const birthDate = new Date(patient.date_of_birth);
      setBirthYear(birthDate.getFullYear().toString());
      setBirthMonth((birthDate.getMonth() + 1).toString().padStart(2, "0"));
      setBirthDay(birthDate.getDate().toString().padStart(2, "0"));
    }
  }, [isEditMode, patient]);

  const handleBirthDateInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const value = e.target.value.replace(/\D/g, "");
    if (type === "year") {
      setBirthYear(value);
      if (value.length === 4) monthRef.current?.focus();
    } else if (type === "month") {
      setBirthMonth(value);
      if (value.length === 2) dayRef.current?.focus();
    } else if (type === "day") {
      setBirthDay(value);
    }
  };

  const handleSubmit = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name) newErrors.name = "이름을 입력하세요";
    if (!birthYear || !birthMonth || !birthDay)
      newErrors.date_of_birth = "생년월일을 입력하세요";
    if (!gender) newErrors.gender = "성별을 입력하세요";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const date_of_birth = new Date(
      `${birthYear}-${birthMonth.padStart(2, "0")}-${birthDay.padStart(2, "0")}`
    );

    onSubmit({
      id: patient?.id,
      name,
      date_of_birth,
      gender,
      phone_number: phoneNumber || null,
      organization,
      created_at: createdAt,
      modified_at: modifiedAt,
    });
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{isEditMode ? "환자 정보 수정" : "새 환자 추가"}</h2>

        <input
          type="text"
          placeholder="이름 *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.inputField}
        />
        {errors.name && (
          <div className={styles.errorMessage}>{errors.name}</div>
        )}

        <div className={styles.dateContainer}>
          <input
            type="text"
            placeholder="생년 (YYYY)"
            value={birthYear}
            onChange={(e) => handleBirthDateInput(e, "year")}
            maxLength={4}
            className={`${styles.inputField} ${styles.dateInput}`}
          />
          <input
            type="text"
            placeholder="월 (MM)"
            ref={monthRef}
            value={birthMonth}
            onChange={(e) => handleBirthDateInput(e, "month")}
            maxLength={2}
            className={`${styles.inputField} ${styles.dateInput}`}
          />
          <input
            type="text"
            placeholder="일 (DD) *"
            ref={dayRef}
            value={birthDay}
            onChange={(e) => handleBirthDateInput(e, "day")}
            maxLength={2}
            className={`${styles.inputField} ${styles.dateInput}`}
          />
        </div>
        {errors.date_of_birth && (
          <div className={styles.errorMessage}>{errors.date_of_birth}</div>
        )}

        <input
          type="text"
          placeholder="성별 (남, 여) *"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className={styles.inputField}
        />
        {errors.gender && (
          <div className={styles.errorMessage}>{errors.gender}</div>
        )}

        <input
          type="text"
          placeholder="전화번호 (01012345678)"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className={styles.inputField}
        />

        <input
          type="text"
          placeholder="소속"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          className={styles.inputField}
        />

        <button onClick={handleSubmit} className={styles.primaryButton}>
          {isEditMode ? "수정" : "추가"}
        </button>
        <button onClick={onClose} className={styles.secondaryButton}>
          취소
        </button>
      </div>
    </div>
  );
};

export default PatientAddModal;
