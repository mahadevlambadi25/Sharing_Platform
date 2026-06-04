const express = require('express');
const router = express.Router();
const { createRequest, getMyRequests, getIncomingRequests, updateRequestStatus } = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createRequest);
router.get('/mine', protect, getMyRequests);
router.get('/incoming', protect, getIncomingRequests);
router.put('/:id', protect, updateRequestStatus);

module.exports = router;