import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/component";

// Supabase 클라이언트 생성
const supabase = createClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const { sessionId } = params;

  // 상담 카드 조회
  // title, session_datetime, created_at, modified_at, temp필드 조회
  console.log("Fetching temp field for session with ID:", sessionId);
  const { data, error } = await supabase
    .from("Session")
    .select("title, session_datetime, created_at, modified_at, temp")
    .eq("id", sessionId)
    .single();

  if (error) {
    console.error("Error fetching session:", error.message);
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

// 상담 카드 수정
export async function PATCH(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const { sessionId } = params;

  // 요청에서 업데이트할 데이터를 가져오기
  const updatedData = await req.json();

  // 기존 temp 데이터 가져오기
  const { data: currentData, error: fetchError } = await supabase
    .from("Session")
    .select("temp")
    .eq("id", sessionId)
    .select()
    .single();

  if (fetchError) {
    console.error("Error fetching current temp data:", fetchError.message);
    return NextResponse.json(
      { error: "Error fetching current temp data" },
      { status: 500 }
    );
  }

  // 점(.)이 포함된 키를 중첩된 객체로 변환하는 함수
  function setNestedValue(target, keyPath, value) {
    const keys = keyPath.split(".");
    let current = target;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current)) {
        current[key] = {};
      }
      current = current[key];
    }
    current[keys[keys.length - 1]] = value;
  }

  // 깊은 병합을 수행하는 유틸리티 함수
  function deepMerge(target, source) {
    for (const key in source) {
      if (key.includes(".")) {
        // 점(.)이 포함된 키를 중첩된 객체로 변환
        setNestedValue(target, key, source[key]);
      } else if (
        source[key] instanceof Object &&
        !Array.isArray(source[key]) &&
        source[key] !== null
      ) {
        if (!(key in target)) {
          target[key] = {};
        }
        // 재귀적으로 병합 수행
        deepMerge(target[key], source[key]);
      } else {
        // 중첩된 객체의 필드가 아닌 경우에만 직접 병합
        target[key] = source[key];
      }
    }
    return target;
  }

  // 기존 데이터와 업데이트된 데이터를 깊은 병합
  const newTempData = deepMerge(currentData?.temp || {}, updatedData);

  // temp 필드 업데이트
  console.log("Updating temp field for session with ID:", sessionId);
  const { data, error } = await supabase
    .from("Session")
    .update({ temp: newTempData }) // 병합된 temp 데이터 업데이트
    .eq("id", sessionId)
    .select() // 없으면 null로 들어옴
    .single();

  if (error) {
    console.error("Error updating session:", error.message);
    return NextResponse.json(
      { error: "Error updating session" },
      { status: 500 }
    );
  }

  // Patient 테이블의 modified_at 업데이트
  const patientId = currentData.patient_id;
  if (patientId) {
    const { error: patientError } = await supabase
      .from("Patient")
      .update({ modified_at: new Date() }) // patient의 modified_at 업데이트
      .eq("id", patientId);

    if (patientError) {
      console.error(
        "Error updating patient modified_at:",
        patientError.message
      );
      return NextResponse.json(
        { error: "Error updating patient modified_at" },
        { status: 500 }
      );
    }
  }

  console.log("Update successful:", data); // 성공적으로 업데이트된 데이터 확인

  // 수정된 temp 데이터를 JSON 형식으로 반환
  return NextResponse.json(data);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const { sessionId } = params;

  // 요청에서 전체 데이터를 가져오기
  const updatedData = await req.json();

  // 데이터가 비어 있으면 요청 취소
  if (!updatedData || Object.keys(updatedData).length === 0) {
    console.warn(`Empty data received for session ID: ${sessionId}`);
    return NextResponse.json(
      { error: "Data cannot be empty" },
      { status: 400 }
    );
  }

  //console.log("Replacing temp field for session with ID:", sessionId);

  // temp 필드 업데이트 (전체 교체)
  const { data, error } = await supabase
    .from("Session")
    .update({ temp: updatedData }) // 전체 데이터로 교체
    .eq("id", sessionId)
    .select() // 결과 반환
    .single();

  if (error) {
    console.error("Error replacing session data:", error.message);
    return NextResponse.json(
      { error: "Error replacing session data" },
      { status: 500 }
    );
  }

  //console.log("Replace successful:", data);

  // 수정된 temp 데이터를 JSON 형식으로 반환
  return NextResponse.json(data);
}
