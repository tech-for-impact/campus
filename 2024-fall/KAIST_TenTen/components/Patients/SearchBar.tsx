"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./SearchBar.module.css";

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

interface SearchBarProps {
  placeholder: string;
  onSearch: (value: string) => void;
  searchTerm: string;
  filteredPatients: Patient[];
  onDelete: (patient: Patient) => void;
  onEdit: (patient: Patient) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  onSearch,
  searchTerm,
  filteredPatients,
  onDelete,
  onEdit,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/patients/${patient.id}`);
  };

  const toggleDropdown = (id: string, selectedPatient: Patient) => {
    setActiveDropdown((prev) => (prev === id ? null : id));
    setPatient((prev) => (prev?.id === id ? null : selectedPatient));
  };

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className={styles.searchBar}
      />
      {searchTerm.trim() !== "" && filteredPatients.length > 0 && (
        <div className={styles.filteredResults}>
          {filteredPatients.map((patient) => (
            <div key={patient.id} className={styles.resultItem}>
              <span className={styles.resultName}>{patient.name}</span>
              <span className={styles.resultDOB}>
                {patient.date_of_birth.toISOString().split("T")[0]}
              </span>
              <span className={styles.resultGender}>{patient.gender}</span>
              <div className={styles.actionContainer}>
                <button
                  className={styles.actionButton}
                  onClick={() => toggleDropdown(patient.id, patient)}
                >
                  ⋮
                </button>
                {activeDropdown === patient.id && (
                  <div className={styles.dropdownMenu}>
                    <div
                      className={styles.dropdownItem}
                      onClick={() => onEdit(patient)}
                    >
                      수정
                    </div>
                    <div
                      className={styles.dropdownItem}
                      onClick={() => onDelete(patient)}
                    >
                      삭제
                    </div>
                    <div
                      className={styles.dropdownItem}
                      onClick={handleViewDetails}
                    >
                      상담 보기
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
