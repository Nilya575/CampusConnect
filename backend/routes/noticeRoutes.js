const express = require('express');
const router = express.Router();
const { createNotice, getNotices, deleteNotice } = require('../controllers/noticeController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Sabko dekhne do (login zaroori nahi)
router.get('/', getNotices);

// Sirf admin/teacher create kar sakein (login + role check zaroori)
router.post('/create', protect, authorize('admin', 'teacher'), createNotice);

// Delete - login zaroori hai (andar controller mein role/owner check hoga)
router.delete('/:id', protect, deleteNotice);

module.exports = router;