import React, { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import styles from "./OTCSection.module.css";

interface OTCDrug {
  name: string;
  unit: string;
  purpose: string;
  status: string;
}

interface PrescriptionDrug {
  name: string;
  days: string;
  purpose: string;
  status: string;
}

interface MedicationList {
  current_medications: {
    ethical_the_counter_drugs: {
      count: number;
      list: PrescriptionDrug[];
    };
    over_the_counter_drugs: {
      count: number;
      list: OTCDrug[];
    };
    health_functional_foods: {
      count: number;
      list: OTCDrug[];
    };
  };
}

interface Props {
  medicationList: MedicationList;
  setMedicationList: (updatedList: MedicationList) => void;
  sessionId: string;
}

const OTCSection: React.FC<Props> = ({
  medicationList,
  setMedicationList,
  sessionId,
}) => {
  const [drugs, setDrugs] = useState<OTCDrug[]>([]);

  useEffect(() => {
    setDrugs(medicationList.current_medications.over_the_counter_drugs.list);
  }, [medicationList]);

  const [newDrug, setNewDrug] = useState<OTCDrug>({
    name: "",
    unit: "",
    purpose: "",
    status: "상시 복용",
  });

  const handleAddDrug = () => {
    const newErrors: { [key: string]: string } = {};

    if (!newDrug.name) {
      newErrors.name = "상품명을 입력하세요";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (newDrug.name) {
      const updatedDrugs = [...drugs, newDrug];
      const updatedList = {
        ...medicationList,
        current_medications: {
          ...medicationList.current_medications,
          over_the_counter_drugs: {
            count: updatedDrugs.length,
            list: updatedDrugs,
          },
        },
      };

      setMedicationList(updatedList);
      setDrugs(updatedDrugs);
      setNewDrug({ name: "", unit: "", purpose: "", status: "상시 복용" });

      // Make the PATCH request to update the server
      fetch(`/api/sessions/${sessionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_medications: {
            over_the_counter_drugs: {
              count: updatedDrugs.length,
              list: updatedDrugs,
            },
          },
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to update data");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Data updated successfully:", data.temp);
        })
        .catch((error) => {
          console.error("Error updating data:", error);
        });
    }
  };

  const handleDeleteDrug = (index: number) => {
    const updatedDrugs = drugs.filter((_, i) => i !== index);
    const updatedList = {
      ...medicationList,
      current_medications: {
        ...medicationList.current_medications,
        over_the_counter_drugs: {
          count: updatedDrugs.length,
          list: updatedDrugs,
        },
      },
    };

    setMedicationList(updatedList);
    setDrugs(updatedDrugs);

    fetch(`/api/sessions/${sessionId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        current_medications: {
          over_the_counter_drugs: {
            count: updatedDrugs.length,
            list: updatedDrugs,
          },
        },
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update data");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data updated successfully:", data);
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewDrug({ name: "", unit: "", purpose: "", status: "상시 복용" });
  };

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  return (
    <div>
      <h3 className={styles.sectionTitle}>일반의약품</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>상품명</th>
            <th>제품 단위</th>
            <th>약물 사용 목적</th>
            <th>사용 상태</th>
            <th onClick={handleOpenModal} className={styles.addButton}>
              +
            </th>
          </tr>
        </thead>
        <tbody>
          {drugs.length > 0 ? (
            drugs.map((drug, index) => (
              <tr key={index}>
                <td>{drug.name}</td>
                <td>{drug.unit}</td>
                <td>{drug.purpose}</td>
                <td>{drug.status}</td>
                <td>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteDrug(index)}
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className={styles.emptyMessage}>
                + 버튼을 눌러 항목을 추가해주세요.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>새 일반의약품 추가</h2>

            <input
              id="drug-name"
              placeholder="상품명 *"
              value={newDrug.name}
              onChange={(e) => setNewDrug({ ...newDrug, name: e.target.value })}
              className={styles.modalInputField}
            />
            {errors.name && (
              <div className={styles.errorMessage}>{errors.name}</div>
            )}

            <input
              id="drug-days"
              placeholder="제품 단위"
              value={newDrug.unit}
              onChange={(e) => setNewDrug({ ...newDrug, unit: e.target.value })}
              className={styles.modalInputField}
            />

            <input
              id="drug-purpose"
              placeholder="약물 사용 목적"
              value={newDrug.purpose}
              onChange={(e) =>
                setNewDrug({ ...newDrug, purpose: e.target.value })
              }
              className={styles.modalInputField}
            />

            <select
              id="drug-status"
              value={newDrug.status}
              onChange={(e) =>
                setNewDrug({ ...newDrug, status: e.target.value })
              }
              className={styles.modalInputField}
            >
              <option value="상시 복용">상시 복용</option>
              <option value="필요 시 복용">필요 시 복용</option>
              <option value="복용 중단">복용 중단</option>
              <option value="기타">기타</option>
            </select>

            <button
              onClick={() => {
                handleAddDrug();
                setIsModalOpen(true);
              }}
              className={styles.primaryButton}
            >
              추가
            </button>
            <button
              onClick={handleCloseModal}
              className={styles.secondaryButton}
            >
              완료
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OTCSection;
