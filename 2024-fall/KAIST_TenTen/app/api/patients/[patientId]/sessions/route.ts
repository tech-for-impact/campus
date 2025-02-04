import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/component";

// Supabase 클라이언트 생성
const supabase = createClient();

const defaultTemp = {
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
  pharmacist_comments: [],
  care_note: [],
};

// Post: create new session card for a patient
export async function POST(
  req: NextRequest,
  { params }: { params: { patientId: string } }
) {
  try {
    // 요청 바디에서 JSON 데이터를 파싱
    const { session_datetime, title } = await req.json();
    const patientId = params.patientId;

    // 필수 데이터가 있는지 확인
    if (!session_datetime || !patientId) {
      return NextResponse.json(
        { error: "Required fields are missing or invalid patient ID" },
        { status: 400 }
      );
    }

    const sessionTitle = title || "제목 없음";

    // Patient 테이블에서 환자 정보 조회
    const { data: patient, error: patientError } = await supabase
      .from("Patient")
      .select("name, date_of_birth, phone_number")
      .eq("id", patientId)
      .single();
    if (patientError) {
      console.error("Error fetching patient:", patientError.message);
      return NextResponse.json(
        { error: "Failed to fetch patient data" },
        { status: 404 }
      );
    }

    // 이전 상담카드 가져오기
    const { data: lastSession, error: lastSessionError } = await supabase
      .from("Session")
      .select("temp")
      .eq("patient_id", patientId)
      .order("session_datetime", { ascending: false })
      .limit(1)
      .single();

    // 이전 상담카드가 없으면 defaultTemp 사용 // 잠시 막아둠
    //const tempFromLastSession = lastSession ? lastSession.temp : defaultTemp;

    // 새로운 상담카드의 temp 생성
    const updatedTemp = {
      ...defaultTemp,
      personal_info: {
        name: patient.name,
        date_of_birth: patient.date_of_birth,
        phone_number: patient.phone_number,
      },
    };
    /* {
      ...defaultTemp,
      personal_info: {
        name: patient.name,
        date_of_birth: patient.date_of_birth,
        phone_number: patient.phone_number,
      },
      consultation_info: {
        ...tempFromLastSession.consultation_info,
        current_consult_date: session_datetime, // 새로 입력된 값
        consult_session_number: "", // 초기화
      },
      medical_conditions: tempFromLastSession.medical_conditions,
      lifestyle: tempFromLastSession.lifestyle,
      medication_management: tempFromLastSession.medication_management,
      questions: tempFromLastSession.questions,
      current_medications: tempFromLastSession.current_medications,
      pharmacist_comments: "", // 초기화
      care_note: "", // 초기화
    };*/

    // Session 테이블에 데이터 삽입
    const { data: session, error: sessionError } = await supabase
      .from("Session")
      .insert([
        {
          session_datetime: session_datetime,
          title: sessionTitle,
          patient_id: patientId,
          patient_summary: "",
          temp: updatedTemp,
        },
      ])
      .single();

    // 에러 처리
    if (sessionError) {
      console.error("Error inserting session:", sessionError.message);
      return NextResponse.json(
        { error: "Failed to insert session" },
        { status: 500 }
      );
    }

    // 성공적으로 삽입된 데이터 반환
    return NextResponse.json(session, { status: 201 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }
}
