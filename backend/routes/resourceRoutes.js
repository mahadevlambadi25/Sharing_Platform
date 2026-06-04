const express = require('express');
const router = express.Router();
const { createResource, getAllResources, getResourceById, updateResource, deleteResource } = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getAllResources);
router.get('/:id', getResourceById);
router.post('/', protect, upload.single('file'), createResource);
router.put('/:id', protect, upload.single('file'), updateResource);
router.delete('/:id', protect, deleteResource);

module.exports = router;