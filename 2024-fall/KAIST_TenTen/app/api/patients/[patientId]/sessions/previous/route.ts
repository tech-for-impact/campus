import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/component";

// Supabase 클라이언트 생성
const supabase = createClient();

// GET: 환자의 모든 상담 카드 + JSON 데이터의 특정 필드 조회
export async function GET(
  req: NextRequest,
  { params }: { params: { patientId: string } }
) {
  const { patientId } = params;

  // 환자 ID가 없을 경우 에러 반환
  if (!patientId) {
    return NextResponse.json(
      { error: "Patient ID is required" },
      { status: 400 }
    );
  }

  try {
    // Supabase에서 모든 이전 상담 기록 조회
    console.log("Fetching all sessions for patient ID:", patientId);
    const { data, error } = await supabase
      .from("Session") // Session 테이블
      .select(`
        id, 
        session_datetime, 
        temp ->> 'pharmacist_comments', 
        temp ->> 'care_note'
      `) // JSON 필드에서 'pharmacist_comments', 'care_note' 추출
      .eq("patient_id", patientId) // 특정 환자의 데이터 필터링
      .order("session_datetime", { ascending: false }); // 최신 순 정렬

    // 쿼리 에러 처리
    if (error) {
      console.error("Error fetching sessions:", error.message);
      return NextResponse.json(
        { error: "Failed to fetch sessions" },
        { status: 500 }
      );
    }

    // 쿼리 에러 처리
    if (error) {
        console.error("Error fetching sessions:", error.message);
        return NextResponse.json(
          { error: "Failed to fetch sessions" },
          { status: 500 }
        );
    }
  
      // 데이터가 없는 경우에도 빈 배열 반환
    return NextResponse.json(data || [], { status: 200 });
    } catch (err) {
      console.error("Unexpected error:", err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
}
  
