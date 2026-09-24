const express = require('express');
const router = express.Router();
const { createEvent, getEvents, getEventById, registerEvent, markAttendance, getMyEvents,deleteEvent } = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');
router.get('/', getEvents);
router.get('/:id', getEventById);
router.get('/my-events', protect, getMyEvents);
router.post('/mark-attendance', protect, authorize('admin', 'teacher'), markAttendance);
router.post('/create', protect, authorize('admin', 'teacher'), createEvent);
router.post('/:id/register', protect, registerEvent); // koi bhi logged-in user (student) register kar sake
router.delete('/:id', protect, deleteEvent);
module.exports = router;