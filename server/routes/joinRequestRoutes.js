const express = require('express');
const router = express.Router();
const {
  sendJoinRequest, getProjectRequests, respondToRequest,
} = require('../controllers/joinRequestController');
const { protect } = require('../middleware/authMiddleware');

router.post('/',               protect, sendJoinRequest);
router.get('/:projectId',      protect, getProjectRequests);
router.put('/:id',             protect, respondToRequest);

module.exports = router;