import express from 'express';
import { markAttendance, getAttendance, getStats, getOverallStats } from '../controllers/attendanceController.js';
import authenticateToken from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/', authenticateToken, markAttendance);
router.get('/', authenticateToken, getAttendance);
router.get('/stats', authenticateToken, getOverallStats); // For dashboard
router.get('/stats/:subjectId', authenticateToken, getStats);

export default router;

