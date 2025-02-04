const { admin } = require('../config/firebaseAdmin');

const bucket = admin.storage().bucket();

const R = 6371; // 지구 반지름 (킬로미터 단위)

function getDistance(lat1, lon1, lat2, lon2) {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function format_date(timestamp) {
  // {"_seconds": 1234, "_nanoseconds": 1234} => "2024-11-15T13:00:00+09:00"
  const date = new Date(timestamp._seconds * 1000);
  const koreanDateString = new Date(
    date.getTime() + 9 * 60 * 60 * 1000
  ).toISOString(); // +09:00 변환

  // 3. 원하는 형식으로 변환 ("YYYY-MM-DDTHH:mm:ss+09:00" 형식)
  const result = koreanDateString.slice(0, -5) + '+09:00'; // 나노초는 생략
  return result;
}

async function getWebUrl(image_path) {
  const file = bucket.file(image_path);
  const signedUrls = await file.getSignedUrl({
    action: 'read',
    expires: '03-09-2500', // URL의 만료 날짜를 설정하세요 (예: 2500년 3월 9일까지 유효)
  });
  return signedUrls[0];
}

module.exports = { getDistance, format_date, getWebUrl };
