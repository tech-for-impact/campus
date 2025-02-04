"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/Patients/SearchBar";
import PatientCard from "@/components/Patients/PatientCard";
import PatientAddModal from "@/components/Patients/PatientAddModal";
import DeleteModal from "@/components/DeleteModal";
import styles from "./PatientsListPage.module.css";


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

const PatientsListPage = () => {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  // API를 통해 환자 목록을 가져오는 함수
  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/patients", { method: "GET" });
      if (!response.ok) throw new Error("Failed to fetch patients");

      const data: Patient[] = await response.json();
      const formattedPatients = data.map((patient) => ({
        ...patient,
        date_of_birth: new Date(patient.date_of_birth),
        created_at: new Date(patient.created_at),
        modified_at: new Date(patient.modified_at),
      }));
      setPatients(formattedPatients);
      setSearchTerm("");
      setSelectedPatient(null);
    } catch (err) {
      console.error("환자 목록을 불러오는 데 문제가 발생했습니다:", err);
    } finally {
      setLoading(false);
    }
  };

  // 환자 추가 함수
  const handleAddPatient = async (patientData: Omit<Patient, "id">) => {
    setLoading(true);
    try {
      const response = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...patientData,
          date_of_birth: patientData.date_of_birth.toISOString(),
          created_at: new Date().toISOString(),
          modified_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create patient: ${errorText}`);
      }

      setShowModal(false);
      setSelectedPatient(null);
      fetchPatients();
    } catch (err) {
      console.error("새 환자를 추가하는 데 실패했습니다:", err);
    } finally {
      setLoading(false);
    }
  };

  // 환자 삭제 함수
  const handleDeletePatient = async () => {
    if (!selectedPatient) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/patients/${selectedPatient.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete patient");

      setShowDeleteModal(false);
      setSelectedPatient(null);
      fetchPatients();
    } catch (err) {
      console.error("환자를 삭제하는 데 실패했습니다:", err);
    } finally {
      setLoading(false);
    }
  };

  // 환자 수정 함수
  const handleUpdatePatient = async (patientData: Patient) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/patients/${patientData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...patientData,
          date_of_birth: patientData.date_of_birth.toISOString(),
          created_at: patientData.created_at.toISOString(),
          modified_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Failed to update patient");

      setShowModal(false);
      setSelectedPatient(null);
      fetchPatients();
    } catch (err) {
      console.error("환자 정보를 수정하는 데 실패했습니다:", err);
    } finally {
      setLoading(false);
    }
  };

  // 환자 삭제 확인 모달 열기
  const handleDeleteConfirm = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowDeleteModal(true);
  };

  // 환자 정보 수정 핸들러
  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  // 환자 상담 보기 핸들러
  const handleViewDetails = (patient: Patient) => {
    setSelectedPatient(patient);
    router.push(`/patients/${patient.id}`);
  };

  // 환자 정렬
  const groupByDateAndOrganization = (patients: Patient[]) => {
    const grouped = patients.reduce(
      (acc: Record<string, Patient[]>, patient) => {
        const dateKey = patient.modified_at.toISOString().split("T")[0];
        const orgKey = patient.organization || "미지정 소속";
        const combinedKey = `${dateKey}_${orgKey}`;

        if (!acc[combinedKey]) acc[combinedKey] = [];
        acc[combinedKey].push(patient);
        return acc;
      },
      {}
    );
    const sortedEntries = Object.entries(grouped).sort(
      ([keyA], [keyB]) => {
        const [dateA, orgA] = keyA.split("_");
        const [dateB, orgB] = keyB.split("_");

        const dateComparison = new Date(dateB).getTime() - new Date(dateA).getTime();
        if (dateComparison !== 0) return dateComparison;

        return orgA.localeCompare(orgB);
      }
    );
    return Object.fromEntries(sortedEntries);
  };

  // 날짜와 요일 포맷팅
  const formatDate = (date: string) => {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const d = new Date(date);
    return [`${days[d.getDay()]}`, `${d.getDate()}`];
  };

  // 이름으로 필터링된 환자 목록
  const filteredPatients =
    searchTerm.trim() === ""
      ? []
      : patients.filter((patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <div className={styles.Page}>
      <div className={styles.listHeader}>
        <h2 className={styles.listHeadertext}>전체 환자 목록</h2>
        <SearchBar
          placeholder="검색어를 입력하세요"
          onSearch={(term) => setSearchTerm(term)}
          searchTerm={searchTerm}
          filteredPatients={patients.filter((patient) =>
            patient.name.toLowerCase().includes(searchTerm.toLowerCase())
          )}
          onDelete={handleDeleteConfirm}
          onEdit={handleEditPatient}
        />
        <button className={styles.actionButton} onClick={() => setShowModal(true)}>
          +
        </button>
      </div>
      {showModal && (
        <PatientAddModal
          patient={selectedPatient}
          isEditMode={!!selectedPatient}
          onClose={() => {
            setShowModal(false);
            setSelectedPatient(null);
          }}
          onSubmit={selectedPatient ? handleUpdatePatient : handleAddPatient}
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          onConfirm={handleDeletePatient}
          onCancel={() => setShowDeleteModal(false)}
          deleteName={`환자 "${selectedPatient?.name}"`}
        />
      )}
      {loading ? (
        <p>환자 목록 로딩 중...</p>
      ) : (
        <div className={styles.patientList}>
          {Object.entries(groupByDateAndOrganization(patients)).map(
            ([combinedKey, patientGroup]) => {
              const [date, organization] = combinedKey.split("_");
              return (
                <>
                  <div className={styles.groupHeader}>
                    <div className={styles.groupHeaderTime}>
                      <div className={styles.groupHeaderDay}>{formatDate(date)[0]}</div>
                      <div className={styles.groupHeaderDate}>{formatDate(date)[1]}</div>
                    </div>
                    <div className={styles.groupHeaderOrganization}>
                      {organization}
                    </div>
                  </div>
                  <div key={combinedKey} className={styles.groupContainer}>
                    <div className={styles.tableHeader}>
                      <div className={styles.tableHeaderItem}>이름</div>
                      <div className={styles.tableHeaderItem}>생년월일</div>
                      <div className={styles.tableHeaderItem}>성별</div>
                      <div className={styles.tableHeaderItem}>최근 수정 날짜</div>
                      <div className={styles.fakeButton}></div>
                    </div>
                    <div className={styles.cardList}>
                      {patientGroup.map((patient) => (
                        <PatientCard
                          key={patient.id}
                          patient={patient}
                          onViewDetails={handleViewDetails}
                          onDelete={handleDeleteConfirm}
                          onEdit={handleEditPatient}
                        />
                      ))}
                    </div>
                  </div>
                </>
              );
            }
          )}
        </div>
      )}
    </div>
  );
};

export default PatientsListPage;
