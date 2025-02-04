"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import MainContent from "../components/MainContent/MainContent";
import PersonalInfoLoading from "@/components/MainContent/PersonalInfoLoading";
import FirstSessionSummary from "../components/Sidebar/FirstSessionSummary";
import SessionHeader from "../components/Header/SessionHeader";
import styles from "./ConsultationRecordPage.module.css";
import { Spinner } from "flowbite-react";

interface RecordingItem {
  id: string;
  s3_url: string;
  topic_status: string;
  stt_status: string;
  created_at: string;
}

interface RelatedScript {
  time: string;
  content: string;
}

interface SessionSummaryItem {
  topic_id: number;
  start_time: string;
  end_time: string;
  content: string;
  related_scripts: RelatedScript[];
}

const ConsultationRecordPage: React.FC = () => {
  const pathname = usePathname();
  const sessionId = pathname.split("/").pop();
  const router = useRouter();

  // 로딩 상태 관리
  const [loading, setLoading] = useState(true);
  // 상담 데이터 상태 관리
  const [activeTab, setActiveTab] = useState<"firstSession" | "followUp">(
    "firstSession"
  );
  const [isFirstSessionCompleted, setIsFirstSessionCompleted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  //상담 정보 관리
  const [patientInfo, setPatientInfo] = useState({
    personal_info: {
      name: "",
      date_of_birth: "",
      phone_number: "",
    },
    consultation_info: {
      insurance_type: "",
      initial_consult_date: "",
      current_consult_date: "",
      consult_session_number: "",
      pharmacist_names: ["", "", ""],
    },
    medical_conditions: {
      chronic_diseases: {
        disease_names: [],
        additional_info: "",
      },
      medical_history: "",
      symptoms: "",
      allergies: {
        has_allergies: "아니오",
        suspected_items: [],
      },
      adverse_drug_reactions: {
        has_adverse_drug_reactions: "아니오",
        suspected_medications: [],
        reaction_details: [],
      },
    },
    lifestyle: {
      smoking: {
        is_smoking: "아니오",
        duration_in_years: "",
        pack_per_day: "",
      },
      alcohol: {
        is_drinking: "아니오",
        drinks_per_week: "",
        amount_per_drink: "",
      },
      exercise: {
        is_exercising: "아니오",
        exercise_frequency: "",
        exercise_types: [],
      },
      diet: {
        is_balanced_meal: "아니오",
        balanced_meals_per_day: "",
      },
    },
    medication_management: {
      living_condition: {
        living_alone: "예",
        family_members: [],
        medication_assistants: [],
      },
      medication_storage: {
        has_medication_storage: "아니오",
        location: "",
      },
      prescription_storage: {
        is_prescription_stored: "아니오",
      },
    },
  });
  const [medicationList, setMedicationList] = useState({
    current_medications: {
      ethical_the_counter_drugs: {
        count: 0,
        list: [],
      },
      over_the_counter_drugs: {
        count: 0,
        list: [],
      },
      health_functional_foods: {
        count: 0,
        list: [],
      },
    },
  });
  const [pharmacistComment, setPharmacistComment] = useState("");
  const [careNoteComment, setCareNoteComment] = useState("");

  const [preQuestions, setPreQuestions] = useState({ questions: { list: [] } });
  const [sessionSummaryData, setSessionSummaryData] = useState([
    {
      topic_id: 1,
      content: "Q. 당뇨약을 줄이는 게 현실적인가요?",
    },
    {
      topic_id: 2,
      content: "Q. 운동 계획을 어떻게 세우는 게 좋을까요?",
    },
  ]);
  const [pharmacistIntervention, setPharmacistIntervention] = useState({
    pharmacist_comments: [] as string[],
  });

  const [careNote, setCareNote] = useState({
    care_note: [] as string[],
  });

  function updateStatesFromData(updatedData) {
    setPatientInfo({
      personal_info: updatedData.personal_info,
      consultation_info: updatedData.consultation_info,
      medical_conditions: updatedData.medical_conditions,
      lifestyle: updatedData.lifestyle,
      medication_management: updatedData.medication_management,
    });

    setMedicationList({
      current_medications: updatedData.current_medications,
    });

    setPharmacistIntervention({
      pharmacist_comments: updatedData.pharmacist_comments || [], // Ensure it defaults to an array
    });

    setCareNote({
      care_note: updatedData.care_note || [], // Ensure it defaults to an array
    });
    setPreQuestions({
      questions: updatedData.questions,
    });
  }

  // 병합된 전체 상담 생성
  const getMergedState = () => ({
    personal_info: patientInfo.personal_info,
    consultation_info: patientInfo.consultation_info,
    medical_conditions: patientInfo.medical_conditions,
    lifestyle: patientInfo.lifestyle,
    medication_management: patientInfo.medication_management,
    current_medications: medicationList.current_medications,
    questions: preQuestions.questions,
    pharmacist_comments: pharmacistIntervention.pharmacist_comments, // Now an array
    care_note: careNote.care_note, // Now an array
  });

  // PUT 요청 함수
  const sendPutRequest = useCallback(() => {
    const mergedState = getMergedState();

    //console.log("Sending PUT request with:", mergedState);

    fetch(`/api/sessions/${sessionId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mergedState),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to sync data");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data synced successfully:", data.temp);
      })
      .catch((error) => {
        console.error("Error syncing data:", error);
      });
  }, [
    patientInfo,
    medicationList,
    preQuestions,
    sessionSummaryData,
    pharmacistIntervention,
    careNote,
  ]);

  // 주기적 PUT 요청
  useEffect(() => {
    const intervalId = setInterval(() => {
      sendPutRequest();
    }, 10000); // 10초마다 동기화

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 정리
  }, [sendPutRequest]);

  //데이터 무결성 확인 및 상태 설정
  useEffect(() => {
    const fetchAndUpdateData = async () => {
      setLoading(true);
      try {
        // 데이터 가져오기
        const response = await fetch(`/api/sessions/${sessionId}`);
        const data = await response.json();

        // Guard clause: If data or data.temp is null or undefined, handle it
        if (!data || !data.temp) {
          // console.log(
          //   "Data or temp is null or undefined. Creating new object..."
          // );
          data.temp = {
            personal_info: {
              name: "",
              date_of_birth: "",
              phone_number: "",
            },
            consultation_info: {
              insurance_type: "",
              initial_consult_date: "",
              current_consult_date: "",
              consult_session_number: "",
              pharmacist_names: ["", "", ""],
            },
            medical_conditions: {
              chronic_diseases: {
                disease_names: [],
                additional_info: "",
              },
              medical_history: "",
              symptoms: "",
              allergies: {
                has_allergies: "아니오",
                suspected_items: [],
              },
              adverse_drug_reactions: {
                has_adverse_drug_reactions: "아니오",
                suspected_medications: [],
                reaction_details: [],
              },
            },
            lifestyle: {
              smoking: {
                is_smoking: "아니오",
                duration_in_years: "",
                pack_per_day: "",
              },
              alcohol: {
                is_drinking: "아니오",
                drinks_per_week: "",
                amount_per_drink: "",
              },
              exercise: {
                is_exercising: "아니오",
                exercise_frequency: "",
                exercise_types: [],
              },
              diet: {
                is_balanced_meal: "아니오",
                balanced_meals_per_day: "",
              },
            },
            medication_management: {
              living_condition: {
                living_alone: "예",
                family_members: [],
                medication_assistants: [],
              },
              medication_storage: {
                has_medication_storage: "아니오",
                location: "",
              },
              prescription_storage: {
                is_prescription_stored: "아니오",
              },
            },
            questions: { list: [] },
            current_medications: {
              ethical_the_counter_drugs: { count: 0, list: [] },
              over_the_counter_drugs: { count: 0, list: [] },
              health_functional_foods: { count: 0, list: [] },
            },
            pharmacist_comments: "",
            care_note: "",
          };
          // PATCH 요청 보내기
          const patchResponse = await fetch(`/api/sessions/${sessionId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data.temp),
          });

          if (!patchResponse.ok) {
            console.error("Error updating session:", patchResponse.statusText);
          } else {
            //console.log("Update request successful");
          }
        }

        // 데이터를 상태로 설정
        updateStatesFromData(data.temp);

        // 데이터가 불완전할 경우에만 PATCH 요청 수행
        if (isDataInvalid(data)) {
          console.log("Data is incomplete, sending update request...");

          // Filter out only the incomplete data
          const updatedData = filterIncompleteData(data.temp);

          // PATCH 요청 보내기
          const patchResponse = await fetch(`/api/sessions/${sessionId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
          });

          // 상태 업데이트
          updateStatesFromData(updatedData);

          if (!patchResponse.ok) {
            console.error("Error updating session:", patchResponse.statusText);
          } else {
            console.log("Update request successful");
          }
        } else {
          //console.log("Data is valid, no update needed.");
          //console.log(data.temp);
        }
      } catch (error) {
        console.error("Error fetching or sending update request:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndUpdateData();
  }, [sessionId]);

  const filterIncompleteData = (data: any) => {
    const filteredData: any = {};

    // Check and add only fields that are missing or default
    if (
      !data.personal_info ||
      !data.personal_info.name ||
      !data.personal_info.date_of_birth ||
      !data.personal_info.phone_number
    ) {
      filteredData.personal_info = data.personal_info || {
        name: "",
        date_of_birth: "",
        phone_number: "",
      };
    }

    if (
      !data.consultation_info ||
      !data.consultation_info.insurance_type ||
      !data.consultation_info.initial_consult_date ||
      !data.consultation_info.current_consult_date
    ) {
      filteredData.consultation_info = data.consultation_info || {
        insurance_type: "",
        initial_consult_date: "",
        current_consult_date: "",
        consult_session_number: 0,
        pharmacist_names: ["", "", ""],
        summary: "",
      };
    }

    if (
      !data.medical_conditions ||
      !data.medical_conditions.chronic_diseases ||
      !data.medical_conditions.chronic_diseases.disease_names
    ) {
      filteredData.medical_conditions = data.medical_conditions || {
        chronic_diseases: {
          disease_names: [],
          additional_info: "",
        },
        medical_history: "",
        symptoms: "",
        allergies: {
          has_allergies: "아니오",
          suspected_items: [],
        },
        adverse_drug_reactions: {
          has_adverse_drug_reactions: "아니오",
          suspected_medications: [],
          reaction_details: [],
        },
      };
    }

    if (
      !data.lifestyle ||
      !data.lifestyle.smoking ||
      !data.lifestyle.alcohol ||
      !data.lifestyle.exercise
    ) {
      filteredData.lifestyle = data.lifestyle || {
        smoking: {
          is_smoking: "아니오",
          duration_in_years: 0,
          pack_per_day: 0,
        },
        alcohol: {
          is_drinking: "아니오",
          drinks_per_week: 0,
          amount_per_drink: "",
        },
        exercise: {
          is_exercising: "아니오",
          exercise_frequency: "",
          exercise_types: [],
        },
        diet: {
          is_balanced_meal: "아니오",
          balanced_meals_per_day: null,
        },
      };
    }

    if (
      !data.medication_management ||
      !data.medication_management.living_condition ||
      !data.medication_management.medication_storage ||
      !data.medication_management.prescription_storage
    ) {
      filteredData.medication_management = data.medication_management || {
        living_condition: {
          living_alone: "예",
          family_members: [],
          medication_assistants: [],
        },
        medication_storage: {
          has_medication_storage: "아니오",
          location: "",
        },
        prescription_storage: {
          is_prescription_stored: "아니오",
        },
      };
    }

    if (
      !data.current_medications ||
      !data.current_medications.ethical_the_counter_drugs ||
      !Array.isArray(data.current_medications.ethical_the_counter_drugs.list) ||
      !data.current_medications.over_the_counter_drugs ||
      !Array.isArray(data.current_medications.over_the_counter_drugs.list) ||
      !data.current_medications.health_functional_foods ||
      !Array.isArray(data.current_medications.health_functional_foods.list)
    ) {
      filteredData.current_medications = data.current_medications || {
        ethical_the_counter_drugs: { count: 0, list: [] },
        over_the_counter_drugs: { count: 0, list: [] },
        health_functional_foods: { count: 0, list: [] },
      };
    }

    if (!data.questions) {
      filteredData.questions = data.questions || { list: [] };
    }

    if (!data.pharmacist_comments) {
      filteredData.pharmacist_comments = data.pharmacist_comments || "";
    }

    if (!data.care_note) {
      filteredData.care_note = data.care_note || "";
    }

    if (!Array.isArray(data.pharmacist_comments)) {
      filteredData.pharmacist_comments = [];
    }

    if (!Array.isArray(data.care_note)) {
      filteredData.care_note = [];
    }

    console.log(filteredData);
    return filteredData;
  };

  const isDataInvalid = (data: any) => {
    // 데이터가 없거나 temp 객체가 없으면 불완전
    if (!data || !data.temp) {
      //console.log("Data or temp is null or undefined.");
      return true;
    }

    const { temp } = data;

    // 개인 정보 검증: temp 안에 personal_info 객체가 존재하는지 확인
    if (
      !temp.personal_info ||
      !("name" in temp.personal_info) ||
      !("date_of_birth" in temp.personal_info) ||
      !("phone_number" in temp.personal_info)
    ) {
      //console.log("Personal info is incomplete or undefined:");
      return true;
    }

    // 상담 정보 검증: temp 안에 consultation_info 객체가 존재하는지 확인
    if (
      !temp.consultation_info ||
      !("insurance_type" in temp.consultation_info) ||
      !("initial_consult_date" in temp.consultation_info) ||
      !("current_consult_date" in temp.consultation_info)
    ) {
      // console.log(
      //   "Consultation info is incomplete or undefined:",
      //   temp.consultation_info
      // );
      return true;
    }

    // 만성 질환 정보 검증: temp 안에 medical_conditions 객체가 존재하는지 확인
    if (
      !temp.medical_conditions ||
      !temp.medical_conditions.chronic_diseases ||
      !("disease_names" in temp.medical_conditions.chronic_diseases)
    ) {
      // console.log(
      //   "Medical conditions are incomplete or undefined:",
      //   temp.medical_conditions.chronic_diseases
      // );
      return true;
    }

    // 라이프스타일 정보 검증: temp 안에 lifestyle 객체가 존재하는지 확인
    if (
      !temp.lifestyle ||
      !("smoking" in temp.lifestyle) ||
      !("alcohol" in temp.lifestyle) ||
      !("exercise" in temp.lifestyle)
    ) {
      //console.log("Lifestyle info is incomplete or undefined:", temp.lifestyle);
      return true;
    }

    // 약물 관리 정보 검증: temp 안에 medication_management 객체가 존재하는지 확인
    if (
      !temp.medication_management ||
      !("living_condition" in temp.medication_management) ||
      !("medication_storage" in temp.medication_management) ||
      !("prescription_storage" in temp.medication_management)
    ) {
      // console.log(
      //   "Medication management info is incomplete or undefined:",
      //   temp.medication_management
      // );
      return true;
    }

    // 약물 목록 검증: temp 안에 current_medications 객체가 존재하는지 확인
    if (
      !temp.current_medications ||
      !temp.current_medications.ethical_the_counter_drugs ||
      !Array.isArray(temp.current_medications.ethical_the_counter_drugs.list) ||
      !temp.current_medications.over_the_counter_drugs ||
      !Array.isArray(temp.current_medications.over_the_counter_drugs.list) ||
      !temp.current_medications.health_functional_foods ||
      !Array.isArray(temp.current_medications.health_functional_foods.list)
    ) {
      // console.log(
      //   "Current medications are incomplete or undefined:",
      //   temp.current_medications
      // );
      return true;
    }

    // 기타 검증: temp 안에 필요한 필드가 존재하는지 확인
    if (
      !("pharmacist_comments" in temp) ||
      !("care_note" in temp) ||
      !("questions" in temp)
    ) {
      // console.log(
      //   "Pharmacist comments or care note or questions is missing or undefined:",
      //   temp.pharmacist_comments,
      //   temp.care_note,
      //   temp.questions
      // );
      return true;
    }

    //리스트인지 확인
    if (
      !Array.isArray(temp.pharmacist_comments) ||
      !Array.isArray(temp.care_note)
    ) {
      return true;
    }

    // 모든 검증을 통과하면 데이터가 유효함
    return false;
  };

  const handleRecordingStatusChange = (recordingStatus: boolean) => {
    setIsRecording(recordingStatus);
  };

  const handleCompleteFirstSession = () => {
    router.push(`../../patients`);
  };

  const handleTabChange = (tab: "firstSession" | "followUp") => {
    setActiveTab(tab);
  };

  type Topics = SessionSummaryItem[];

  //recording 정보 관리
  const [recentRecording, setRecentRecording] = useState<RecordingItem | null>(
    null
  );
  const [topics, setTopics] = useState<Topics>([]);

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const response = await fetch(
          `/api/sessions/${sessionId}/get_recording`
        );
        if (response.ok) {
          const data: RecordingItem[] = await response.json();
          //console.log("Fetched Recordings:", data);
          // 가장 최근 녹음 파일 선택
          if (data.length > 0) {
            const latestRecording = data.sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )[0];

            console.log(latestRecording);

            setRecentRecording(latestRecording); // 최근 녹음 ID 저장
          }
        } else {
          console.error("Failed to fetch recordings:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching recordings:", error);
      }
    };

    fetchRecordings();
  }, [sessionId]);

  // Fetch topics using the recent recordingId
  useEffect(() => {
    const fetchTopics = async () => {
      if (!recentRecording) return;
      console.log(
        "stt",
        recentRecording.stt_status,
        "topic",
        recentRecording.topic_status,
        recentRecording.created_at
      );
      if (recentRecording.topic_status != "completed") {
        return;
      }
      try {
        const response = await fetch(
          `/api/recordings/${recentRecording.id}/topic`,
          {
            method: "GET",
          }
        );
        if (response.ok) {
          const data = await response.json();
          //console.log("Fetched Topics");
          setTopics(data.topicSummaries || []); // Topic 데이터 저장
        } else {
          console.error("Failed to fetch topics:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    fetchTopics();
  }, [recentRecording]);

  return (
    <div className={styles.consultationRecordPage}>
      <SessionHeader activeTab={activeTab} onTabChange={handleTabChange} />
      <div className={styles.contentWrapper}>
        <main className={styles.mainContent}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.loadingContainer}>
                <h3 className={styles.loadingTitle}>환자 상세 정보</h3>
                <Spinner className={styles.loadingTitle} color="gray" />
              </div>
              <PersonalInfoLoading />
            </div>
          ) : (
            <MainContent
              isFollowUp={activeTab === "followUp"}
              onCompleteFirstSession={handleCompleteFirstSession}
              onRecordingStatusChange={handleRecordingStatusChange}
              patientInfo={patientInfo}
              setPatientInfo={setPatientInfo}
              preQuestions={preQuestions}
              setPreQuestions={setPreQuestions}
              medicationList={medicationList}
              setMedicationList={setMedicationList}
              careNote={careNote}
              setCareNote={setCareNote}
              pharmacistIntervention={pharmacistIntervention}
              setPharmacistIntervention={setPharmacistIntervention}
              pharmacistComment={pharmacistComment}
              setPharmacistComment={setPharmacistComment}
              careNoteComment={careNoteComment}
              setCareNoteComment={setCareNoteComment}
              sessionId={sessionId}
              topics={topics}
            />
          )}
        </main>
        <aside className={styles.rightSidebar}>
          {loading ? (
            <h2 className="font-bold text-lg text-gray-700 mt-4">
              상담 내용 로딩 중...
            </h2>
          ) : (
            <FirstSessionSummary
              patientInfo={patientInfo}
              preQuestions={preQuestions}
              sessionSummaryData={sessionSummaryData}
              recentRecording={recentRecording}
              pharmacistComment={pharmacistComment}
              setPharmacistComment={setPharmacistComment}
              careNoteComment={careNoteComment}
              setCareNoteComment={setCareNoteComment}
            />
          )}
        </aside>
      </div>
    </div>
  );
};

export default ConsultationRecordPage;
