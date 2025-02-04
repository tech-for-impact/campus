import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/component";

// Supabase 클라이언트 생성
const supabase = createClient();

// GET: 환자의 가장 최근 상담 기록 조회
export async function GET(
  req: NextRequest,
  { params }: { params: { patientId: string } }
) {
  const { patientId } = params;

  if (!patientId) {
    return NextResponse.json(
      { error: "Patient ID is required" },
      { status: 400 }
    );
  }

  try {
    // 최신 상담 기록 가져오기
    console.log("Fetching latest session for patient with ID:", patientId);
    const { data, error } = await supabase
      .from("Session") // Session 테이블에서
      .select("*") // 필요한 모든 필드 선택
      .eq("patient_id", patientId) // 해당 환자의 데이터만 필터링
      .order("session_datetime", { ascending: false }) // 날짜 기준으로 내림차순 정렬
      .limit(1) // 가장 최근 1개의 기록만 가져오기
      .single(); // 단일 결과 반환

    // 에러 처리
    if (error) {
      console.error("Error fetching latest session:", error.message);
      return NextResponse.json(
        { error: "Failed to fetch latest session" },
        { status: 500 }
      );
    }

    // 데이터가 없는 경우 처리
    if (!data) {
      return NextResponse.json(
        { error: "No sessions found for the given patient" },
        { status: 404 }
      );
    }

    // 성공적으로 최신 상담 데이터 반환
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
