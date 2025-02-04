# How to Run

- aGainApp 폴더에서 터미널에 "cd backend"를 실행합니다.
- 이후 "npm install"을 실행합니다.
- 설치가 끝나면 "node index.js"를 실행합니다.
- API 명세서는 다음 링크를 참고하세요. https://www.notion.so/dad9df69a70548fdb1c979f11d8968df?p=9594e840c1ec4d619286b88f4cb7c1c4&pm=s

# 파일별 역할 설명

- config/firebaseAdmin.js : Firebase Admin SDK 초기화와 관련된 설정을 포함하는 파일입니다.
- controllers/ : 각 기능의 로직과 데이터 처리 역할을 수행합니다. 데이터베이스와 상호작용하는 부분을 포함합니다.
- models/ : 데이터 모델과 데이터베이스와 상호작용하는 메소드를 정의합니다.
- routes/ : 각 기능별로 분리된 라우터 파일입니다. Express 라우팅을 정의하여 index.js에서 사용됩니다.
- utils/helpers.js : 거리 계산 함수와 같이 여러 컨트롤러에서 사용할 유틸리티 함수를 정의합니다.

# API 간단한 설명

- /party/ : 존재하는 모든 파티들의 정보를 현 위치로부터 거리가 가까운 순서대로 json 형식으로 반환합니다.
- /party/:id : id가 매개변수 "id"인 파티의 정보를 json 형식으로 반환합니다.
- /party/like/:userid/:partyid : 매개변수 "userid"를 id로 가지는 유저가 매개변수 "partyid"를 id로 가지는 파티에 좋아요를 누릅니다. 이미 눌렀다면 취소합니다.
  이후 매개변수 "partyid"를 id로 가지는 파티의 정보를 json 형식으로 반환합니다.

- /user/ : 존재하는 모든 유저들을 json 형식으로 반환합니다.
- /user/:id : id가 매개변수 "id"인 유저의 정보를 json 형식으로 반환합니다.
- /user/ticket/:id : id가 매개변수 "id"인 유저의 티켓 수를 json 형식으로 반환합니다.
- /user/upload : POST 메서드를 사용합니다. 유저의 정보와 프로필 사진을 받아 정보는 db에, 프로필 사진은 Firestore에 저장합니다.

- /cloth/ : 존재하는 모든 옷들을 최신순으로 정렬하여 json 형식으로 반환합니다.
- /cloth/:id : id가 매개변수 "id"인 옷의 정보를 json 형식으로 반환합니다.
- /cloth/party/:id : id가 매개변수 "id"인 파티에 등록된 모든 옷을 최신순으로 정렬하여 json 형식으로 반환합니다.
- /cloth/user/:id : id가 매개변수 "id"인 유저가 등록한 모든 옷을 최신순으로 정렬하여 json 형식으로 반환합니다.
- /cloth/like/:userid/:clothid : 매개변수 "userid"를 id로 가지는 유저가 매개변수 "clothid"를 id로 가지는 옷에 좋아요를 누릅니다. 이미 눌렀다면 취소합니다.
  이후 매개변수 "clothid"를 id로 가지는 옷의 정보를 json 형식으로 반환합니다.
- /cloth/upload : POST 메서드를 사용합니다. 옷의 정보와 프로필 사진을 받아 정보는 db에, 프로필 사진은 Firestore에 저장합니다.
