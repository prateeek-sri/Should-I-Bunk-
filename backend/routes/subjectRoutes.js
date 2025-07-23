import express from 'express';
import { createSubject, getSubjects } from '../controllers/subjectController.js';
import authenticateToken from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/', authenticateToken, createSubject);
router.get('/', authenticateToken, getSubjects);

export default router;
