const express = require('express');
const router = express.Router();
const {
  getAllParties,
  getPartyById,
  togglePartyLike,
  getPartyLike,
  uploadParty,
} = require('../controllers/partyController');

router.get('/', getAllParties);
router.get('/:id', getPartyById);
router.get('/like/:partyid', getPartyLike);
router.get('/like/:userid/:partyid', togglePartyLike);
router.post('/upload', uploadParty);

module.exports = router;
