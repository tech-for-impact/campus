"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./PatientCard.module.css";

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

interface PatientCardProps {
  patient: Patient;
  onViewDetails: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
  onEdit: (patient: Patient) => void;
}

const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  onViewDetails,
  onDelete,
  onEdit,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDeleteClick = () => {
    onDelete(patient);
    setShowDropdown(false);
  };

  const handleEditClick = () => {
    onEdit(patient);
    setShowDropdown(false);
  };

  const handleViewDetailsClick = () => {
    onViewDetails(patient);
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className={styles.patientContainer}>
      <div className={styles.patientRow}>
        <div className={styles.patientField}>{patient.name}</div>
        <div className={styles.patientField}>
          {patient.date_of_birth.toISOString().split("T")[0]}
        </div>
        <div className={styles.patientField}>{patient.gender}</div>
        <div className={styles.patientField}>
          {patient.modified_at.toISOString().split("T")[0]}
        </div>
        <button className={styles.actionButton} onClick={toggleDropdown}>
          ⋮
        </button>
        {showDropdown && (
          <div className={styles.dropdownMenu} ref={dropdownRef}>
            <div className={styles.dropdownItem} onClick={handleEditClick}>
              수정
            </div>
            <div className={styles.dropdownItem} onClick={handleDeleteClick}>
              삭제
            </div>
            <div
              className={styles.dropdownItem}
              onClick={handleViewDetailsClick}
            >
              상담 보기
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientCard;
