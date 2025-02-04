import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/component";

// Supabase 클라이언트 생성
const supabase = createClient();

// GET: get all patients
export async function GET(req: NextRequest) {
  try {
    // Patient 테이블의 모든 환자 정보를 조회
    const { data: patients, error } = await supabase
      .from("Patient")
      .select("*"); // 모든 필드를 선택하여 조회

    // 에러 처리
    if (error) {
      console.error("Error fetching patients:", error.message);
      return NextResponse.json(
        { error: "Failed to fetch patients" },
        { status: 500 }
      );
    }

    // 성공적으로 조회된 환자 데이터 반환
    return NextResponse.json(patients, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}

// POST: insert new patient
export async function POST(req: NextRequest) {
  try {
    // 요청 바디에서 JSON 데이터를 파싱
    const { name, date_of_birth, gender, phone_number, organization } =
      await req.json();

    // 필수 데이터가 있는지 확인
    if (!name || !gender) {
      return NextResponse.json(
        { error: "Some required fields not exist" },
        { status: 400 }
      );
    }

    // Patient 테이블에 데이터 삽입
    const { data, error } = await supabase
      .from("Patient")
      .insert([
        {
          name,
          date_of_birth,
          gender,
          phone_number,
          organization,
        },
      ])
      .single(); // 삽입 후 단일 레코드 반환

    // 에러 처리
    if (error) {
      console.error("Error inserting patient:", error.message);
      return NextResponse.json(
        { error: "Failed to insert patient" },
        { status: 500 }
      );
    }

    // 성공적으로 삽입되면 생성된 데이터 반환
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }
}
