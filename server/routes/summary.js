import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { generateSummary } from '../controllers/summaryController.js';

const router = express.Router();

router.use(requireAuth);

router.post('/', generateSummary);

export default router;
