import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/component";

// Supabase 클라이언트 생성
const supabase = createClient();

// DELETE: 특정 세션 삭제
export async function DELETE(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const { sessionId } = params;

  if (!sessionId) {
    return NextResponse.json(
      { error: "Session ID is required" },
      { status: 400 }
    );
  }

  // 세션 정보 삭제
  console.log("Deleting session with ID:", sessionId);
  const { error } = await supabase
    .from("Session") // Session 테이블에서
    .delete() // 데이터 삭제
    .eq("id", sessionId); // sessionId와 일치하는 항목을 삭제합니다.

  // 에러 처리
  if (error) {
    console.error("Error deleting session:", error.message);
    return NextResponse.json(
      { error: "Failed to delete session" },
      { status: 500 }
    );
  }

  // 삭제 성공 응답 반환
  return NextResponse.json(
    { message: "Session deleted successfully" },
    { status: 200 }
  );
}

// 상담 카드 정보 수정: PUT
export async function PUT(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const { sessionId } = params;

  if (!sessionId) {
    return NextResponse.json(
      { error: "Session ID is required" },
      { status: 400 }
    );
  }

  try {
    // 요청 바디에서 업데이트할 데이터 가져오기
    const { title, session_datetime } = await req.json();

    // 필수 데이터 확인
    if (!session_datetime) {
      return NextResponse.json(
        { error: "session_datetime are required" },
        { status: 400 }
      );
    }

    // 업데이트할 필드 객체
    const updatedFields = {
      title: title || "제목 없음",
      session_datetime,
    };

    // 세션 정보 업데이트
    console.log("Updating session with ID:", sessionId);
    const { data, error } = await supabase
      .from("Session")
      .update(updatedFields)
      .eq("id", sessionId)
      .single();

    // 에러 처리
    if (error) {
      console.error("Error updating session:", error.message);
      return NextResponse.json(
        { error: "Failed to update session" },
        { status: 500 }
      );
    }

    // 세션과 연결된 patient_id 가져오기
    const { data: session, error: fetchError } = await supabase
      .from("Session")
      .select("patient_id")
      .eq("id", sessionId)
      .single();

    if (fetchError || !session) {
      console.error("Error fetching session data:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch session data" },
        { status: 500 }
      );
    }

    // patient 테이블의 modified_at 업데이트
    const { error: patientError } = await supabase
      .from("Patient")
      .update({ modified_at: new Date() })
      .eq("id", session.patient_id);

    if (patientError) {
      console.error("Error updating patient modified_at:", patientError.message);
      return NextResponse.json(
        { error: "Failed to update patient modified_at" },
        { status: 500 }
      );
    }    

    // 성공적으로 업데이트된 데이터 반환
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }
}
