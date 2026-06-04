const express = require('express');
const router = express.Router();
const { getStats, getAllUsers, deleteUser, getAllRequests } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All admin routes require valid token + admin role
router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/requests', getAllRequests);

module.exports = router;
