const express = require('express');
const multer = require('multer');
const router = express.Router();
const {
  getAllClothes,
  getClothByID,
  getClothByPartyID,
  getClothByUserID,
  toggleClothLike,
  getClothLike,
  uploadCloth,
} = require('../controllers/clothController');

const upload = multer();

router.get('/', getAllClothes); // 모든 옷을 등록된 순서 (최신순)으로 불러온다.
router.get('/:id', getClothByID); // 해당 id를 가진 옷을 불러온다.
router.get('/party/:id', getClothByPartyID); // 해당 id를 가진 파티에 올라온 모든 옷을 불러온다.
router.get('/user/:id', getClothByUserID); // 해당 id를 가진 유저가 가진 모든 옷을 불러온다.
router.get('/like/:clothid', getClothLike);
router.get('/like/:userid/:clothid', toggleClothLike); // 유저가 해당 옷에 좋아요를 눌렀으면 취소하고, 아니라면 좋아요를 누른다.
// toggleClothLike의 경우, FE에서 좋아요 버튼 연타를 막아줘야 함.
router.post('/upload', upload.single('file'), uploadCloth);

module.exports = router;
