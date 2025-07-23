import express from 'express';
import multer from 'multer';
import { createSemester, getSemesters, uploadHolidays } from '../controllers/semesterController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
router.post('/', authenticateToken, createSemester);
router.get('/', authenticateToken, getSemesters);
router.post('/:id/holidays', authenticateToken, upload.single('holidayFile'), uploadHolidays);

export default router;
